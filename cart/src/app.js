import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cartRoutes from './routes/cart.route.js';
import cors from 'cors';
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use('/api/carts', cartRoutes);
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

export default app;