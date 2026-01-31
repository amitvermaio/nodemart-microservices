import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { getMetrics, getOrders, getProducts } from '../controllers/seller.controller.js';
const router = Router();

router.use(authenticate([ 'seller' ]));

router.get('/metrics', getMetrics);
router.get('/orders', getOrders);
router.get('/products', getProducts);

export default router;