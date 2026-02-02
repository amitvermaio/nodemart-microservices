import { body, validationResult } from 'express-validator';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export const productsValidation = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string')
    .trim(),
  body('description')
    .notEmpty().withMessage('Description is required')
    .isString().withMessage('Description must be a string')
    .trim(),
  body('priceAmount')
    .notEmpty().withMessage('priceAmount is required'),
  body('priceCurrency')
    .optional()
    .isIn(['USD', 'INR']).withMessage('priceCurrency must be either USD or INR'),
  body('stock')
    .isInt({ min: 1 }).withMessage('Stock must be a non-negative integer'),
  body('category')
    .optional(),
  validate,
];