import Payment from '../models/payment.model.js';
import axios from 'axios';

export const createPayment = async (req, res) => {
  const orderId = req.params.orderId;
  const token = req.cookies['NodeMart_Token'] || req.headers?.authorization?.split(' ')[ 1 ];
  try {
    const orderResponse = await axios.get(`http://localhost:4003/api/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}