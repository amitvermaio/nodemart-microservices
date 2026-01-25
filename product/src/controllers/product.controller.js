import Product from "../models/product.model.js";
import { uploadProductImage } from "../services/azureBlob.service.js";

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
    const { title, description, priceAmount, priceCurrency, category } = req.body;

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
    };

    const createdProduct = await Product.create(productPayload);
    return res.status(201).json({ data: createdProduct });
  } catch (error) {
    return next(error);
  }
};