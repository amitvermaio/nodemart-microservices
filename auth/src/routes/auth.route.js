import express from 'express';
import { register } from '../controllers/auth.controller.js';
import { registerValidator } from '../middlewares/validator.middleware.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', registerValidator, register);

export default router;