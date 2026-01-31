import { subscribeToQueue } from '../broker/broker.js';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import Payment from '../models/payment.model.js';

export const startListener = async () => {
  subscribeToQueue('AUTH_SELLER_DASHBOARD.USER_CREATED', async (user) => {
    await User.create(user);
  });

  subscribeToQueue('PRODUCT_SELLER_DASHBOARD.PRODUCT_CREATED', async (product) => {
    await Product.create(product);
  });

  subscribeToQueue('ORDER_SELLER_DASHBOARD.ORDER_CREATED', async (order) => {
    await Order.create(order);
  });

  subscribeToQueue('PAYMENT_SELLER_DASHBOARD.PAYMENT_CREATED', async (payment) => {
    await Payment.create(payment);
  });

  subscribeToQueue('PAYMENT_SELLER_DASHBOARD.PAYMENT_UPDATED', async (payment) => {
    await Payment.findByIdAndUpdate(payment._id, payment);
  });
}