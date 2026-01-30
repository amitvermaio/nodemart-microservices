import express from 'express';
import cookieParser from 'cookie-parser';
const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, uptime: process.uptime() });
});

export default app;