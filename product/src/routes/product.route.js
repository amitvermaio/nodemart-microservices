import { Router } from "express";
import multer from "multer";
import { authenticate } from '../middlewares/auth.middleware.js';
import { productsValidation } from '../middlewares/validator.middleware.js';
import { createProduct } from "../controllers/product.controller.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/",
  authenticate(['seller', 'admin']),
  upload.array("images", 5),
  productsValidation,
  createProduct
);

export default router;