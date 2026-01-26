import { Router } from "express";
import multer from "multer";
import { authenticate } from '../middlewares/auth.middleware.js';
import { productsValidation } from '../middlewares/validator.middleware.js';
import { createProduct, getProducts, getProductById, updateProduct } from "../controllers/product.controller.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

/* POST /api/products */
router.post("/",
  authenticate(['seller', 'admin']),
  upload.array("images", 5),
  productsValidation,
  createProduct
);

/* GET /api/products */
router.get("/", getProducts);

/* GET /api/products/:id */
router.get("/:id", getProductById);

/* PATCH /api/products/:id */
router.patch("/:id",
  authenticate(['seller']),
  updateProduct
);

export default router;