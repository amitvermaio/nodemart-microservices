import Order from '../models/order.model.js';
import axios from 'axios';
import { publishToQueue } from '../broker/broker.js';

const CART_SERVICE_URL = process.env.CART_SERVICE_URL || 'http://localhost:4002/api/carts';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:4001/api/products';

export const createOrder = async (req, res) => {
  const user = req.user;
  const token = req.cookies['NodeMart_Token'] || req.headers?.authorization?.split(' ')[1];
  const shippingAddress = req.body.shippingAddress;
  try {
    const cartResponse = await axios.get(CART_SERVICE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    if (!cartResponse.data.cart.items || cartResponse.data.cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const products = await Promise.all(cartResponse.data.cart.items.map(async (item) => {
      return (await axios.get(`${PRODUCT_SERVICE_URL}/${item.productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })).data.product
    }));

    let payableAmount = 0;
    let orderCurrency = 'USD'; // default, will be set from first product

    const orderItems = cartResponse.data.cart.items.map((item, index) => {
      const product = products.find(p => p._id === item.productId);

      // if not in stock, do not allow order creation
      if (product.stock < item.quantity) {
        throw new Error(`Product ${product.title} is out of stock`);
      }

      const itemTotal = product.price.amount * item.quantity;
      payableAmount += itemTotal;

      // Use the currency from the first product
      if (index === 0) {
        orderCurrency = product.price.currency || 'USD';
      }

      return {
        product: item.productId,
        quantity: item.quantity,
        price: {
          amount: itemTotal,
          currency: product.price.currency,
        }
      }
    });

    const order = new Order({
      user: user.id,
      items: orderItems,
      status: 'PENDING',
      totalPrice: {
        amount: payableAmount,
        currency: orderCurrency,
      },
      shippingAddress: shippingAddress,
    });

    await order.save();

    await publishToQueue('ORDER_SELLER_DASHBOARD.ORDER_CREATED', order);

    // Clear cart after successful order
    try {
      await axios.delete(CART_SERVICE_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (cartErr) {
      console.warn('Failed to clear cart after order creation:', cartErr.message);
    }

    res.status(201).json({ message: 'Order created successfully', order });

  } catch (error) {
    console.log("Error from create Order controller\n\n");
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const getMyOrders = async (req, res) => {
  const user = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const orders = await Order.find({ user: user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments({ user: user.id });

    res.status(200).json({
      orders,
      meta: {
        page,
        limit,
        total: totalOrders,
        hasMore: skip + orders.length < totalOrders,
      }
    });
  } catch (error) {
    console.error("Error from getMyOrders controller");
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const getOrderById = async (req, res) => {
  const user = req.user;
  const orderId = req.params.id;

  try {
    const order = await Order.findOne({ $and: [{ _id: orderId }, { user: user.id }] });

    if (!order) {
      return res.status(403).json({ message: 'Forbidden, You do not have access to this order.' })
    }

    res.status(200).json({ order });

  } catch (error) {
    console.error("Error from getOrderById controller");
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const cancelOrder = async (req, res) => {
  const user = req.user;
  const orderId = req.params.id;

  try {
    const order = await Order.findOne({ $and: [{ _id: orderId }, { user: user.id }] });

    if (!order) {
      return res.status(403).json({ message: 'Forbidden, You do not have access to this order.' });
    }

    if (order.status !== 'PENDING') {
      return res.status(409).json({ message: 'Error cannot be cancelled at this moment.' });
    }

    order.status = 'CANCELLED';
    await order.save();

    res.status(200).json({ message: 'Order cancelled successfully', order });

  } catch (error) {
    console.error("Error from cancelOrder controller");
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const updateAddress = async (req, res) => {
  const user = req.user;
  const orderId = req.params.id;
  const newAddress = req.body.shippingAddress;

  try {
    const order = await Order.findOne({ $and: [{ _id: orderId }, { user: user.id }] });

    if (!order) {
      return res.status(403).json({ message: 'Forbidden, You do not have access to this order.' });
    }

    if (order.status !== 'PENDING') {
      return res.status(409).json({ message: 'Error cannot update address at this moment.' });
    }

    order.shippingAddress = newAddress;
    await order.save();

    res.status(200).json({ message: 'Shipping address updated successfully', order });
  } catch (error) {
    console.error("Error from updateAddress controller");
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}


/* SELLER CONTROLLER FUNCTIONS */
export const updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const newStatus = req.body.status;
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Verify seller owns at least one product in this order
    const token = req.cookies['NodeMart_Token'] || req.headers?.authorization?.split(' ')[1];
    const productChecks = await Promise.all(
      order.items.map(async (item) => {
        try {
          const { data } = await axios.get(`${PRODUCT_SERVICE_URL}/${item.product}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          return data.product?.seller === req.user.id;
        } catch {
          return false;
        }
      })
    );

    if (!productChecks.some(Boolean)) {
      return res.status(403).json({ message: 'Forbidden, You do not have access to this order.' });
    }

    order.status = newStatus;
    await order.save();

    res.status(200).json({ message: 'Order status updated successfully', order });

  } catch (error) {
    console.error("Error from updateOrderStatus controller");
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}