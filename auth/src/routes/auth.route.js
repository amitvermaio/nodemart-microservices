import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  logout, 
  getUserAddresses, 
  addUserAddress,
  makeDefaultAddress,
  deleteUserAddress,
} from '../controllers/auth.controller.js';
import { registerValidator, loginValidator } from '../middlewares/validator.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', registerValidator, register);

// POST /api/auth/login
router.post('/login', loginValidator, login);

// GET /api/auth/me
router.get('/me', authenticate, getMe);

// GET /api/auth/logout
router.get('/logout', authenticate, logout);

// GET /api/auth/users/me/addresses
router.get('/users/me/addresses', authenticate, getUserAddresses);

// POST /api/auth/users/me/addresses
router.post('/users/me/addresses', authenticate, addUserAddress);

// PATCH /api/auth/users/me/addresses/:addressId
router.patch('/users/me/addresses/:addressId', authenticate, makeDefaultAddress);

// DELETE /api/auth/users/me/addresses/:addressId
router.delete('/users/me/addresses/:addressId', authenticate, deleteUserAddress);

export default router;