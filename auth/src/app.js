import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Auth service is healthy' });
});

export default app;