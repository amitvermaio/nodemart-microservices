import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { login, getMe } from '../controllers/auth.controller.js';
import { loginValidator } from '../middlewares/validator.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { connectDB, closeDB, clearDB } from './setup.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.post('/api/auth/login', loginValidator, login);
app.get('/api/auth/me', authenticate, getMe);

describe('Auth Me Endpoint', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  beforeEach(async () => {
    await clearDB();
  });

  describe('GET /api/auth/me', () => {
    it('should return the authenticated user', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        username: 'testuser',
        fullname: 'Test User',
        email: 'test@example.com',
        password: hashedPassword
      });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' })
        .expect(200);

      const cookies = loginResponse.headers['set-cookie'];
      expect(Array.isArray(cookies)).toBe(true);
      const tokenCookie = cookies.find(cookie => cookie.startsWith('NodeMart_Token='));
      expect(tokenCookie).toBeDefined();

      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', tokenCookie)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('username', 'testuser');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.user).toHaveProperty('role', 'user');
    });

    it('should return 401 when token is missing', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Authentication required');
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', 'NodeMart_Token=invalidtoken')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid token');
    });

    it('should return 404 when user is not found', async () => {
      const fakeUserId = new mongoose.Types.ObjectId().toString();
      const token = jwt.sign({ id: fakeUserId, role: 'user' }, process.env.JWT_SECRET || 'test-secret', {
        expiresIn: '7d'
      });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', `NodeMart_Token=${token}`)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });
});
