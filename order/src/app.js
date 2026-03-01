import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import orderRoutes from './routes/order.route.js';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/orders', orderRoutes);
app.get('/health', (req, res) => {
  res.status(200).send('Order Service is healthy');
});

export default app;