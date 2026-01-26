import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateAddItemToCart, validateUpdateCartItem, validateCartItemParam } from '../middlewares/validator.middleware.js';
import { addItemToCart, updateCartItem, getCart, deleteCartItem, deleteCart } from '../controllers/cart.controller.js';
const router = Router();

router.use(authenticate([ 'user' ]));

/* GET /api/carts */
router.get("/", getCart);

/* POST /api/carts/items */
router.post("/items", validateAddItemToCart, addItemToCart);

/* PATCH /api/carts/items/:productId */
router.patch("/items/:productId", validateUpdateCartItem, updateCartItem);

/* DELETE /api/carts/items/:productId */
router.delete("/items/:productId", validateCartItemParam, deleteCartItem);

/* DELETE /api/carts */
router.delete("/", deleteCart);

export default router;