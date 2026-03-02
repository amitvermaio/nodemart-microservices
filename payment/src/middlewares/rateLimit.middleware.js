import RateLimit from 'express-rate-limit';

export const createPaymentRateLimit = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 8,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

