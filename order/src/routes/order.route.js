import { Router } from 'express';
import {
	cancelOrder,
	createOrder,
	fetchMyOrders,
	fetchOrderById,
	fetchSellerOrders,
	updateOrderAddress
} from '../controllers/order.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
const router = Router();


router.post('/', authenticate(['user']), createOrder);
router.get('/me', authenticate(['user']), fetchMyOrders);
router.get('/seller', authenticate(['seller']), fetchSellerOrders);
router.get('/:id', authenticate(['user', 'seller']), fetchOrderById);
router.post('/:id/cancel', authenticate(['user', 'seller']), cancelOrder);
router.post('/:id/address', authenticate(['user', 'seller']), updateOrderAddress);


export default router;