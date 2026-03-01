import Payment from '../models/payment.model.js';
import axios from 'axios';
import { stripe } from '../config/stripe.js';
import { publishToQueue } from '../broker/broker.js';

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:4003/api/orders';

export const createPayment = async (req, res) => {
  const { orderId } = req.params;
  const token =
    req.cookies?.NodeMart_Token ||
    req.headers.authorization?.split(' ')[1];

  try {
    // Check for an existing pending payment (prevents duplicates on retries)
    const existingPayment = await Payment.findOne({ order: orderId, user: req.user.id, status: 'PENDING' });
    if (existingPayment) {
      const existingIntent = await stripe.paymentIntents.retrieve(existingPayment.stripeOrderId);
      if (existingIntent && existingIntent.status !== 'canceled' && existingIntent.client_secret) {
        return res.status(200).json({
          clientSecret: existingIntent.client_secret,
          paymentId: existingPayment._id,
        });
      }
    }

    const { data } = await axios.get(`${ORDER_SERVICE_URL}/${orderId}`, { 
      headers: { 
          Authorization: `Bearer ${token}`
        }
      }
    );

    const price = data.order.totalPrice;

    // Stripe minimum amounts by currency
    const minAmounts = { USD: 0.5, INR: 50, EUR: 0.5, GBP: 0.3 };
    const cur = price.currency.toUpperCase();
    const minAmount = minAmounts[cur] ?? 0.5;
    if (price.amount < minAmount) {
      return res.status(400).json({
        message: `Order total (${cur} ${price.amount}) is below the minimum payment amount of ${cur} ${minAmount}.`,
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(price.amount * 100),
      currency: price.currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      metadata: {
        orderId,
        userId: req.user.id,
      },
    });
    
    const payment = await Payment.create({
      order: orderId,
      stripeOrderId: paymentIntent.id,
      price,
      user: req.user.id,
      status: 'PENDING',
    });

    // Send response first — queue publish must not block the payment flow
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
    });

    // Non-blocking: publish to queue after response is sent
    try {
      await publishToQueue('PAYMENT_SELLER_DASHBOARD.PAYMENT_CREATED', payment);
    } catch (queueErr) {
      console.error('Queue publish failed (non-fatal):', queueErr.message);
    }
  } catch (err) {
    console.error('Payment creation error:', err?.response?.data || err.message || err);
    res.status(500).json({ message: 'Payment failed' });
  }
};


// testing phase
export const verifyPayment = async (req, res) => {
  const { paymentIntentId } = req.body;

  try {
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

    let payment;
    if (intent.status === 'succeeded') {
      payment = await Payment.findOneAndUpdate(
        { stripeOrderId: paymentIntentId },
        { status: 'COMPLETED' },
        { new: true }
      );

      res.json({ success: true });

      // Non-blocking queue publish
      try {
        await publishToQueue('PAYMENT_SELLER_DASHBOARD.PAYMENT_UPDATED', payment);
      } catch (queueErr) {
        console.error('Queue publish failed (non-fatal):', queueErr.message);
      }
      return;
    }

    res.status(400).json({ success: false });
  } catch (err) {
    console.error('Payment verification error:', err.message || err);
    res.status(500).json({ message: 'Verification failed' });
  }
};
