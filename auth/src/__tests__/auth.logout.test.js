import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import { jest } from '@jest/globals';
import redisClient from '../config/redis.js';
import { login, logout } from '../controllers/auth.controller.js';
import { loginValidator } from '../middlewares/validator.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { connectDB, closeDB, clearDB } from './setup.js';
import User from '../models/user.model.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.post('/api/auth/login', loginValidator, login);
app.get('/api/auth/logout', authenticate, logout);

const redisSetSpy = jest.spyOn(redisClient, 'set').mockResolvedValue('OK');

describe('Auth Logout Endpoint', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    redisSetSpy.mockRestore();
    await closeDB();
  });

  beforeEach(async () => {
    redisSetSpy.mockClear();
    await clearDB();
  });

  describe('GET /api/auth/logout', () => {
    it('should revoke token and clear cookie', async () => {
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
        .get('/api/auth/logout')
        .set('Cookie', tokenCookie)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Logged out successfully');

      const clearedCookies = response.headers['set-cookie'];
      expect(Array.isArray(clearedCookies)).toBe(true);
      expect(clearedCookies.some(cookie => cookie.startsWith('NodeMart_Token=;'))).toBe(true);

      expect(redisSetSpy).toHaveBeenCalledTimes(1);
      const [key, value, exFlag, ttl] = redisSetSpy.mock.calls[0];
      expect(key).toMatch(/^blacklist:/);
      expect(value).toBe('true');
      expect(exFlag).toBe('EX');
      expect(ttl).toBe(7 * 24 * 60 * 60);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/auth/logout')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Authentication required');
      expect(redisSetSpy).not.toHaveBeenCalled();
    });
  });
});
