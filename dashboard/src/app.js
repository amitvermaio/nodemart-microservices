import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import sellerRoutes from './routes/seller.route.js';
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use('/api/seller/dashboard', sellerRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, uptime: process.uptime() });
});

export default app;