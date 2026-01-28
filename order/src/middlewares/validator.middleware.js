import { body, validationResult } from 'express-validator';

const validationResultHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export const addressValidator = [
  body('shippingAddress.street')
    .notEmpty()
    .withMessage('Street is required'),
  body('shippingAddress.city')
    .notEmpty()
    .withMessage('City is required'),
  body('shippingAddress.state')
    .notEmpty()
    .withMessage('State is required'),
  body('shippingAddress.zip')
    .notEmpty()
    .withMessage('Zip code is required'),
  body('shippingAddress.country')
    .notEmpty()
    .withMessage('Country is required'),
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required'),
  validationResultHandler
];

export const updateStatusValidator = [
  body('status')
    .isIn(['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
    .withMessage('Invalid status value'),
  validationResultHandler
]