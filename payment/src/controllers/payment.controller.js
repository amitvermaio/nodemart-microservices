import Payment from '../models/payment.model.js';
import axios from 'axios';
import { stripe } from '../config/stripe.js';
import { publishToQueue } from '../broker/broker.js';

export const createPayment = async (req, res) => {
  const { orderId } = req.params;
  const token =
    req.cookies?.NodeMart_Token ||
    req.headers.authorization?.split(' ')[1];

  try {
    const { data } = await axios.get(
      `http://localhost:4003/api/orders/${orderId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const price = data.order.totalPrice;

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

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Payment failed' });
  }
};


// testing phase
export const verifyPayment = async (req, res) => {
  const { paymentIntentId } = req.body;

  try {
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (intent.status === 'succeeded') {
      await Payment.findOneAndUpdate(
        { stripeOrderId: paymentIntentId },
        { status: 'SUCCESS' }
      );

      await publishToQueue('PAYMENT_NOTIFICATION.PAYMENT_COMPLETED', {
        paymentId: payment._id,
        orderId,
        amount: price,
        userId: req.user.id,
      });

      return res.json({ success: true });
    }

    res.status(400).json({ success: false });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed' });
  }
};
