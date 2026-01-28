import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { createPayment, verifyPayment } from '../controllers/payment.controller.js';
const router = Router();

router.post('/create/:orderId', authenticate([ 'user' ]), createPayment);

router.post('/verify', authenticate([ 'user' ]), verifyPayment);

export default router;