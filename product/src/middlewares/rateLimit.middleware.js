import rateLimit from 'express-rate-limit';

export const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 100, 
  message: { message: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
});

export default apiRateLimiter;