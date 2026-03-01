import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export const validateAddItemToCart = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid Product ID'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ gt: 0, lt: 6 })
    .withMessage('Quantity must be between 1 and 5'),
  validate
]

export const validateUpdateCartItem = [
  param('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid Product ID'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ gt: 0, lt: 6 })
    .withMessage('Quantity must be between 1 and 5'),
  validate
]

export const validateCartItemParam = [
  param('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid Product ID'),
  validate
]