import { body, validationResult } from 'express-validator';

export const validationResultHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const registerValidator = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters long')
    .notEmpty()
    .withMessage('Username is required'),
  body('fullname')
    .isLength({ min: 3, max: 100 })
    .withMessage('Fullname must be between 3 and 100 characters long')
    .notEmpty()
    .withMessage('Fullname is required'),
  body('email')
    .isEmail()
    .withMessage('Invalid email address')
    .notEmpty()
    .withMessage('Email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['user', 'seller'])
    .withMessage('Role must be either user or seller'),
  validationResultHandler
]

export const loginValidator = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email address'),
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters long'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  (req, res, next) => {
    if (!req.body.email && !req.body.username) {
      return res.status(400).json({ message: 'Either email or username is required' });
    }
    validationResultHandler(req, res, next);
  }
];

export const addressValidator = [
  body('street')
    .notEmpty()
    .withMessage('Street is required'),
  body('city')
    .notEmpty()
    .withMessage('City is required'),
  body('state')
    .notEmpty()
    .withMessage('State is required'),
  body('pincode')
    .notEmpty()
    .withMessage('Pincode is required'),
  body('country')
    .notEmpty()
    .withMessage('Country is required'),
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required'),
  validationResultHandler
];