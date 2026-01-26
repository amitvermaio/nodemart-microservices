import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateAddItemToCart } from '../middlewares/validator.middleware.js';
import { addItemToCart } from '../controllers/cart.controller.js';
const router = Router();

/* POST /api/carts/items */
router.post("/items", 
  validateAddItemToCart,
  authenticate([ 'user' ]), 
  addItemToCart
);

export default router;