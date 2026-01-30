import User from '../models/user.model.js';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import Payment from '../models/payment.model.js';

export const getMetrics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments({ seller: req.user.id });
    const totalProducts = await Product.countDocuments({ sellerId: req.user.id });
    const totalRevenueAgg = await Payment.aggregate([
      { $match: { sellerId: req.user.id } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ]);
    const totalRevenue = totalRevenueAgg[0] ? totalRevenueAgg[0].totalRevenue : 0;
    res.status(200).json({ totalUsers, totalOrders, totalProducts, totalRevenue });
  } catch (error) {
    console.error('Error fetching seller metrics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}