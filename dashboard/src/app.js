import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import sellerRoutes from './routes/seller.route.js';
const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use('/api/seller/dashboard', sellerRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, uptime: process.uptime() });
});

export default app;