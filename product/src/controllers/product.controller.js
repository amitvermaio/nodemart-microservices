import mongoose from "mongoose";
import Product from "../models/product.model.js";
import { uploadProductImage } from "../services/azureBlob.service.js";
import { publishToQueue } from '../broker/broker.js';

const normalizeCategory = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [value].filter(Boolean);
};

export const createProduct = async (req, res, next) => {
  try {
    const seller = req.user.id;
    const { title, description, priceAmount, priceCurrency, category, stock } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one product image is required" });
    }

    const amount = parseFloat(priceAmount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid price amount" });
    }

    const uploadPromises = req.files.map((file) =>
      uploadProductImage({
        buffer: file.buffer,
        mimeType: file.mimetype,
        originalName: file.originalname,
      })
    );

    const uploadedImages = await Promise.all(uploadPromises);

    const imagePayload = uploadedImages.map((img) => ({
      url: img.url,
      id: img.id,
      thumbnail: null,
    }));

    const productPayload = {
      title,
      description,
      seller,
      price: { amount, currency: priceCurrency || "INR" },
      category: normalizeCategory(category),
      images: imagePayload,
      stock: stock ? parseInt(stock) : 0,
    };

    const createdProduct = await Product.create(productPayload);

    await publishToQueue('PRODUCT_SELLER_DASHBOARD.PRODUCT_CREATED', createdProduct);

    return res.status(201).json({ data: createdProduct });
  } catch (error) {
    return next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const {
      q,
      minprice,
      maxprice,
      category,
      skip: skipParam = 0,
      limit: limitParam = 20,
    } = req.query;

    const filter = {};

    if (q) {
      filter.$text = { $search: q };
    }

    const parsedMin = Number(minprice);
    const parsedMax = Number(maxprice);

    if (Number.isFinite(parsedMin)) {
      filter["price.amount"] = {
        ...filter["price.amount"],
        $gte: parsedMin,
      };
    }

    if (Number.isFinite(parsedMax)) {
      filter["price.amount"] = {
        ...filter["price.amount"],
        $lte: parsedMax,
      };
    }

    const normalizedCategories = normalizeCategory(category);
    if (normalizedCategories.length > 0) {
      filter.category = { $in: normalizedCategories };
    }

    const parsedSkip = Math.max(Number.parseInt(skipParam, 10) || 0, 0);
    const parsedLimit = Math.min(Math.max(Number.parseInt(limitParam, 10) || 20, 1), 50);

    const includeMeta = parsedSkip === 0;

    // Build a separate filter WITHOUT price constraints for computing the
    // overall min/max price range. This prevents the slider bounds from
    // shrinking when the user applies a price filter.
    const metaFilter = { ...filter };
    delete metaFilter["price.amount"];

    const [products, total, priceStats, availableCategories] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(parsedSkip)
        .limit(parsedLimit),
      Product.countDocuments(filter),
      includeMeta
        ? Product.aggregate([
          { $match: metaFilter },
          {
            $group: {
              _id: null,
              min: { $min: "$price.amount" },
              max: { $max: "$price.amount" },
            },
          },
        ])
        : Promise.resolve([]),
      includeMeta ? Product.distinct("category") : Promise.resolve([]),
    ]);

    const stats = priceStats[0] || {};
    const hasMore = parsedSkip + products.length < total;

    return res.status(200).json({
      data: products,
      pagination: {
        skip: parsedSkip + products.length,
        limit: parsedLimit,
        total,
        hasMore,
      },
      meta: includeMeta
        ? {
          priceRange: {
            min: Number.isFinite(stats.min) ? stats.min : null,
            max: Number.isFinite(stats.max) ? stats.max : null,
          },
          categories: (availableCategories || []).filter(Boolean).sort(),
        }
        : undefined,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = await Product.findOne({ $and: [{ _id: id }, { seller: user.id }] });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const allowedUpdates = ["title", "description", "price", "category"];
    for (const key of Object.keys(updates)) {
      if (allowedUpdates.includes(key)) {
        if (key === "price" && typeof updates[key] === "object") {
          if (updates[key].amount !== undefined) {
            const amount = parseFloat(updates[key].amount);
            if (isNaN(amount) || amount <= 0) {
              return res.status(400).json({ message: "Invalid price amount" });
            }
            product.price.amount = amount;
          }
          if (updates[key].currency !== undefined) {
            product.price.currency = updates[key].currency;
          }
        } else {
          product[key] = updates[key];
        }
      }
    }

    await product.save();
    return res.status(200).json({ message: "Product updated successfully", product });

  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = await Product.findOne({ $and: [{ _id: id }, { seller: user.id }] });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const getProductsBySeller = async (req, res, next) => {
  try {
    const seller = req.user;

    const { skip = 0, limit = 20 } = req.query;

    const products = await Product.find({ seller: seller.id }).skip(skip).limit(Math.min(Number(limit), 20));

    return res.status(200).json({ products });
  } catch (error) {

  }
}