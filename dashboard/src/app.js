import express from 'express';
import cookieParser from 'cookie-parser';
import sellerRoutes from './routes/seller.route.js';
const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, uptime: process.uptime() });
});
app.use('/api/seller/dashboard', sellerRoutes);

export default app;