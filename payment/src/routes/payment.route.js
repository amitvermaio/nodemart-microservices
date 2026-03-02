import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { createPaymentRateLimit } from '../middlewares/rateLimit.middleware.js';
import { createPayment, verifyPayment, getPaymentStatus } from '../controllers/payment.controller.js';
const router = Router();

/* Middleware to authenticate user */
router.use(authenticate(['user']));

/* POST /api/payments/create/:orderId */
router.post(
  '/create/:orderId',
  createPaymentRateLimit,
  createPayment
);

/* POST /api/payments/verify */
router.post('/verify', verifyPayment);

/* GET /api/payments/status/:orderId */
router.get('/status/:orderId', getPaymentStatus);

export default router;