import express from 'express';
import cookieParser from 'cookie-parser';
import cartRoutes from './routes/cart.routes.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/cart', cartRoutes)

export default app;