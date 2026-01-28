import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { createPayment } from '../controllers/payment.controller.js';
const router = Router();

router.post('/create/:orderId', authenticate([ 'user' ]), createPayment);

export default router;