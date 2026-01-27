import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { addressValidator } from '../middlewares/validator.middleware.js';
import { createOrder, getMyOrders, getOrderById, cancelOrder, updateAddress } from '../controllers/order.controller.js';
const router = Router();

router.use(authenticate([ 'user' ]));

/* POST /api/orders */
router.post('/', addressValidator, createOrder);

/* GET /api/orders/me */
router.get('/me', getMyOrders);

/* GET /api/orders/${orderId} */
router.get('/:id', getOrderById);

/* POST /api/orders/${orderId}/cancel */
router.post('/:id/cancel', cancelOrder);

/* PATCH /api/orders/${orderId}/address */
router.patch('/:id/address', addressValidator, updateAddress);

export default router;