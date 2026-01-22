import request from 'supertest';
import express from 'express';
import { register } from '../controllers/auth.controller.js';
import { connectDB, closeDB, clearDB } from './setup.js';
import User from '../models/user.model.js';

const app = express();
app.use(express.json());
app.post('/auth/register', register);

describe('Auth Register Endpoint', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  beforeEach(async () => {
    await clearDB();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const newUser = {
        username: 'testuser',
        fullname: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('username', 'testuser');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.user).toHaveProperty('role', 'user');
    });

    it('should register a user with seller role', async () => {
      const newUser = {
        username: 'seller123',
        fullname: 'Test Seller',
        email: 'seller@example.com',
        password: 'password123',
        role: 'seller'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(newUser)
        .expect(201);

      expect(response.body.user).toHaveProperty('role', 'seller');
    });

    it('should hash the password', async () => {
      const newUser = {
        username: 'testuser',
        fullname: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      await request(app)
        .post('/auth/register')
        .send(newUser)
        .expect(201);

      const savedUser = await User.findOne({ email: 'test@example.com' });
      expect(savedUser.password).not.toBe('password123');
      expect(savedUser.password).toMatch(/^\$2[aby]/); // bcrypt hash pattern
    });

    it('should return error if required fields are missing', async () => {
      const incompleteUser = {
        username: 'testuser',
        email: 'test@example.com'
        // missing fullname and password
      };

      const response = await request(app)
        .post('/auth/register')
        .send(incompleteUser)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Missing required fields');
    });

    it('should return error if username already exists', async () => {
      const user1 = {
        username: 'testuser',
        fullname: 'Test User 1',
        email: 'test1@example.com',
        password: 'password123'
      };

      const user2 = {
        username: 'testuser', // same username
        fullname: 'Test User 2',
        email: 'test2@example.com',
        password: 'password123'
      };

      await request(app)
        .post('/auth/register')
        .send(user1)
        .expect(201);

      const response = await request(app)
        .post('/auth/register')
        .send(user2)
        .expect(409);

      expect(response.body).toHaveProperty('message', 'User already exists');
    });

    it('should return error if email already exists', async () => {
      const user1 = {
        username: 'user1',
        fullname: 'Test User 1',
        email: 'test@example.com',
        password: 'password123'
      };

      const user2 = {
        username: 'user2',
        fullname: 'Test User 2',
        email: 'test@example.com', // same email
        password: 'password123'
      };

      await request(app)
        .post('/auth/register')
        .send(user1)
        .expect(201);

      const response = await request(app)
        .post('/auth/register')
        .send(user2)
        .expect(409);

      expect(response.body).toHaveProperty('message', 'User already exists');
    });

    it('should save user to database', async () => {
      const newUser = {
        username: 'dbtest',
        fullname: 'DB Test User',
        email: 'dbtest@example.com',
        password: 'password123'
      };

      await request(app)
        .post('/auth/register')
        .send(newUser)
        .expect(201);

      const savedUser = await User.findOne({ email: 'dbtest@example.com' });
      expect(savedUser).toBeDefined();
      expect(savedUser.username).toBe('dbtest');
      expect(savedUser.fullname).toBe('DB Test User');
    });

    it('should generate valid JWT token', async () => {
      const newUser = {
        username: 'tokentest',
        fullname: 'Token Test User',
        email: 'token@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(newUser)
        .expect(201);

      const token = response.body.token;
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT format: header.payload.signature
    });

    it('should return 400 if only username is provided', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ username: 'testuser' })
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Missing required fields');
    });

    it('should handle empty request body', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Missing required fields');
    });
  });
});
