import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/user.model.js';
import { connectDB, closeDB, clearDB } from './setup.js';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const createAuthCookie = (userId, role = 'user') => {
  const token = jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  return `NodeMart_Token=${token}`;
};

const createUser = async (overrides = {}) => {
  const suffix = new mongoose.Types.ObjectId().toString().slice(-6);
  const baseUser = {
    username: `addressUser${suffix}`,
    fullname: 'Address Test User',
    email: `address${suffix}@example.com`,
    password: 'hashed-password',
    addresses: [],
    ...overrides
  };

  return User.create(baseUser);
};

describe('User Address Endpoints', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  beforeEach(async () => {
    await clearDB();
  });

  describe('GET /api/auth/users/me/addresses', () => {
    it('returns the saved addresses with a single default selection', async () => {
      const user = await createUser({
        addresses: [
          {
            street: '123 Default St',
            city: 'Metropolis',
            state: 'Metro State',
            country: 'USA',
            zip: '123456',
            isDefault: true
          },
          {
            street: '789 Side St',
            city: 'Gotham',
            state: 'Gotham State',
            country: 'USA',
            zip: '654321',
            isDefault: false
          }
        ]
      });

      const cookie = createAuthCookie(user._id);

      const response = await request(app)
        .get('/api/auth/users/me/addresses')
        .set('Cookie', cookie)
        .expect(200);

      expect(Array.isArray(response.body.addresses)).toBe(true);
      expect(response.body.addresses).toHaveLength(2);

      const defaults = response.body.addresses.filter((address) => address.isDefault);
      expect(defaults).toHaveLength(1);
      expect(defaults[0].street).toBe('123 Default St');
    });

    it('requires authentication', async () => {
      await request(app)
        .get('/api/auth/users/me/addresses')
        .expect(401);
    });
  });

  describe('POST /api/auth/users/me/addresses', () => {
    const validPayload = {
      street: '456 New Ave',
      city: 'Star City',
      state: 'Star State',
      country: 'USA',
      zip: '110011',
      isDefault: true
    };

    it('adds a new address and marks it as the sole default', async () => {
      const user = await createUser({
        addresses: [
          {
            street: '135 Old Ln',
            city: 'Central City',
            state: 'Central State',
            country: 'USA',
            zip: '445566',
            isDefault: true
          }
        ]
      });

      const cookie = createAuthCookie(user._id);

      const response = await request(app)
        .post('/api/auth/users/me/addresses')
        .set('Cookie', cookie)
        .send(validPayload)
        .expect(201);

      expect(Array.isArray(response.body.addresses)).toBe(true);
      expect(response.body.addresses).toHaveLength(2);

      const savedAddress = response.body.addresses.find((address) => address.zip === validPayload.zip);
      expect(savedAddress).toMatchObject({
        street: validPayload.street,
        city: validPayload.city,
        state: validPayload.state,
        country: validPayload.country,
        zip: validPayload.zip,
        isDefault: true
      });

      const updatedUser = await User.findById(user._id).lean();
      expect(updatedUser.addresses).toHaveLength(2);

      const defaultAddresses = updatedUser.addresses.filter((address) => address.isDefault);
      expect(defaultAddresses).toHaveLength(1);
      expect(defaultAddresses[0].zip).toBe(validPayload.zip);
    });

    it('persists the provided zip value on the stored address', async () => {
      const user = await createUser();
      const cookie = createAuthCookie(user._id);

      const customPayload = { ...validPayload, zip: '778899' };

      const response = await request(app)
        .post('/api/auth/users/me/addresses')
        .set('Cookie', cookie)
        .send(customPayload)
        .expect(201);

      const persistedZip = response.body.addresses.find((address) => address.zip === customPayload.zip);
      expect(persistedZip).toBeDefined();
      expect(persistedZip.zip).toBe(customPayload.zip);
    });
  });

  describe('DELETE /api/auth/users/me/addresses/:addressId', () => {
    it('removes the specified address', async () => {
      const user = await createUser({
        addresses: [
          {
            street: '246 Remove Rd',
            city: 'Coast City',
            state: 'Coast State',
            country: 'USA',
            zip: '778899',
            isDefault: true
          },
          {
            street: '357 Keep Ln',
            city: 'Bludhaven',
            state: 'Blud State',
            country: 'USA',
            zip: '667788',
            isDefault: false
          }
        ]
      });

      const addressToRemove = user.addresses[1]._id.toString();
      const cookie = createAuthCookie(user._id);

      const response = await request(app)
        .delete(`/api/auth/users/me/addresses/${addressToRemove}`)
        .set('Cookie', cookie)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Address deleted successfully');
      expect(Array.isArray(response.body.addresses)).toBe(true);
      expect(response.body.addresses).toHaveLength(1);

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.addresses).toHaveLength(1);
      expect(updatedUser.addresses[0]._id.toString()).not.toBe(addressToRemove);
    });

    it('returns an error when the address does not exist', async () => {
      const user = await createUser({
        addresses: [
          {
            street: '999 Missing St',
            city: 'Fictional City',
            state: 'Fictional State',
            country: 'USA',
            zip: '112233',
            isDefault: true
          }
        ]
      });

      const cookie = createAuthCookie(user._id);
      const fakeAddressId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .delete(`/api/auth/users/me/addresses/${fakeAddressId}`)
        .set('Cookie', cookie)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Address not found');
    });
  });
});