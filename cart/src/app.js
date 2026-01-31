import express from 'express';
import cookieParser from 'cookie-parser';
import cartRoutes from './routes/cart.route.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/carts', cartRoutes);
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

export default app;