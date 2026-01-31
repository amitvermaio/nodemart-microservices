import mongoose from 'mongoose';
import User from '../models/user.model.js';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import Payment from '../models/payment.model.js';

export const getMetrics = async (req, res) => {
  try {
    const seller = req.user.id;
    const sellerObjectId = new mongoose.Types.ObjectId(seller);

    const productStats = await Order.aggregate([
      { $match: { status: 'DELIVERED' } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      { $match: { 'product.seller': sellerObjectId } },
      {
        $group: {
          _id: '$items.product',
          productId: { $first: '$items.product' },
          title: { $first: '$product.title' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: {
            $sum: {
              $multiply: [ '$items.quantity', '$items.price.amount' ],
            },
          },
          orderIds: { $addToSet: '$_id' },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    const totalItemsSold = productStats.reduce(
      (sum, p) => sum + (p.totalQuantity || 0),
      0,
    );

    const totalRevenue = productStats.reduce(
      (sum, p) => sum + (p.totalRevenue || 0),
      0,
    );

    const orderIdSet = new Set();
    productStats.forEach((p) => {
      (p.orderIds || []).forEach((id) => {
        orderIdSet.add(id.toString());
      });
    });

    const totalOrders = orderIdSet.size;

    const topProducts = productStats.slice(0, 5).map((p) => ({
      productId: p.productId,
      title: p.title,
      sales: p.totalQuantity,
      revenue: p.totalRevenue,
    }));

    res.status(200).json({
      sales: {
        totalOrders,
        totalItemsSold,
      },
      revenue: {
        total: totalRevenue,
        currency: 'INR',
      },
      topProducts
    });
  } catch (error) {
    console.error('Error fetching seller metrics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const getOrders = async (req, res) => {
  try {
    const seller = req.user.id;
    const sellerObjectId = new mongoose.Types.ObjectId(seller);

    const orders = await Order.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      { $match: { 'product.seller': sellerObjectId } },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'buyer',
        },
      },
      { $unwind: '$buyer' },
      {
        $lookup: {
          from: 'payments',
          localField: '_id',
          foreignField: 'order',
          as: 'payment',
        },
      },
      { $unwind: { path: '$payment', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$_id',
          orderId: { $first: '$_id' },
          status: { $first: '$status' },
          totalPrice: { $first: '$totalPrice' },
          shippingAddress: { $first: '$shippingAddress' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          buyer: {
            $first: {
              _id: '$buyer._id',
              username: '$buyer.username',
              fullname: '$buyer.fullname',
              email: '$buyer.email',
            },
          },
          payment: {
            $first: {
              _id: '$payment._id',
              status: '$payment.status',
              paymentId: '$payment.paymentId',
              stripeOrderId: '$payment.stripeOrderId',
              price: '$payment.price',
            },
          },
          items: {
            $push: {
              productId: '$product._id',
              title: '$product.title',
              description: '$product.description',
              images: '$product.images',
              stock: '$product.stock',
              quantity: '$items.quantity',
              price: '$items.price',
            },
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const getProducts = async (req, res) => {
  try {
    const seller = req.user.id;

    const lowStockThreshold = Number(req.query.lowStockThreshold) || 5;

    const products = await Product.find({ seller }).sort({ createdAt: -1 });

    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const lowStockProducts = products.filter((p) => (p.stock || 0) <= lowStockThreshold);

    res.status(200).json({
      inventory: {
        totalProducts,
        totalStock,
      },
      lowStock: {
        threshold: lowStockThreshold,
        count: lowStockProducts.length,
        products: lowStockProducts,
      },
      products,
    });
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}