import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { createPayment, verifyPayment } from '../controllers/payment.controller.js';
const router = Router();

/* Middleware to authenticate user */
router.use(authenticate([ 'user' ]));

/* POST /api/payments/create/:orderId */
router.post('/create/:orderId', createPayment);

/* POST /api/payments/verify */
router.post('/verify', verifyPayment);

export default router;