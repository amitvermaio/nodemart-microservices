import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import paymentRoutes from './routes/payment.route.js';
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api/payments', paymentRoutes);
app.get('/health', (req, res) => {
  res.status(200).send('Payment Service is healthy');
});

export default app;