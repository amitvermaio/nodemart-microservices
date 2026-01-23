import request from 'supertest';
import express from 'express';
import bcrypt from 'bcryptjs';
import { login } from '../controllers/auth.controller.js';
import { loginValidator } from '../middlewares/validator.middleware.js';
import { connectDB, closeDB, clearDB } from './setup.js';
import User from '../models/user.model.js';

const app = express();
app.use(express.json());
app.post('/api/auth/login', loginValidator, login);

describe('Auth Login Endpoint', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  beforeEach(async () => {
    await clearDB();
  });

  describe('POST /api/auth/login', () => {
    it('should login a user successfully', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        username: 'testuser',
        fullname: 'Test User',
        email: 'test@example.com',
        password: hashedPassword
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('username', 'testuser');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.user).toHaveProperty('role', 'user');

      const cookies = response.headers['set-cookie'];
      expect(Array.isArray(cookies)).toBe(true);
      expect(cookies.some(cookie => cookie.startsWith('NodeMart_Token='))).toBe(true);
    });

    it('should login a user using username', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        username: 'testuser',
        fullname: 'Test User',
        email: 'test@example.com',
        password: hashedPassword
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'password123' })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');

      const cookies = response.headers['set-cookie'];
      expect(Array.isArray(cookies)).toBe(true);
      expect(cookies.some(cookie => cookie.startsWith('NodeMart_Token='))).toBe(true);
    });

    it('should return error for invalid password', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        username: 'testuser',
        fullname: 'Test User',
        email: 'test@example.com',
        password: hashedPassword
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' })
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid credentials');
      expect(response.headers['set-cookie']).toBeUndefined();
    });

    it('should return error if user does not exist', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'missing@example.com', password: 'password123' })
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return validation errors when password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
      expect(Array.isArray(response.body.errors)).toBe(true);
      expect(response.body.errors.some(err => err.path === 'password')).toBe(true);
    });

    it('should return error when identifier is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Either email or username is required');
    });
  });
});
