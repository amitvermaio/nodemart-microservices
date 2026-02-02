import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import productRoutes from "./routes/product.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

app.use("/api/products", productRoutes);
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

export default app;