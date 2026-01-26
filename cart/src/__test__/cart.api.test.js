import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const MOCK_USER_ID = '507f1f77bcf86cd799439011';
const PRODUCT_ID = new mongoose.Types.ObjectId().toString();

// Mock authentication middleware
jest.unstable_mockModule('../middlewares/auth.middleware.js', () => ({
  authenticate: () => (req, res, next) => {
    req.user = { id: MOCK_USER_ID, role: 'user' };
    next();
  },
}));

// Dynamic imports
const { default: app } = await import('../app.js');
const { default: connectDB } = await import('../config/db.js');
const { default: request } = await import('supertest');

describe('Cart API', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
    await connectDB();
  });

  afterEach(async () => {
    if (mongoose.connection.readyState !== 0) {
      const collections = mongoose.connection.collections;
      await Promise.all(
        Object.values(collections).map((collection) => collection.deleteMany({}))
      );
    }
  });

  afterAll(async () => {
    await mongoose.connection.close(true);
    await mongoServer.stop();
  });
  
  describe('GET /api/carts', () => {
    it('returns an empty cart when nothing was added yet', async () => {
      const response = await request(app).get('/api/carts');

      expect(response.statusCode).toBe(200);
      expect(response.body.cart.items).toHaveLength(0);
      expect(response.body.totals).toEqual({ itemCount: 0, totalQuantity: 0 });
    });

    it('returns the current cart with items', async () => {
      // Add an item first
      await request(app)
        .post('/api/carts/items')
        .send({ productId: PRODUCT_ID, quantity: 2 });
      
      const response = await request(app).get('/api/carts');

      expect(response.statusCode).toBe(200);
      expect(response.body.cart.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            productId: PRODUCT_ID,
            quantity: 2
          })
        ])
      );
      expect(response.body.totals).toEqual({ itemCount: 1, totalQuantity: 2 });
    });
  });

  describe('POST /api/carts/items', () => {
    it('adds a new item', async () => {
      const createResponse = await request(app)
        .post('/api/carts/items')
        .send({ productId: PRODUCT_ID, quantity: 2 });

      expect(createResponse.statusCode).toBe(200);
      expect(createResponse.body.cart.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            productId: PRODUCT_ID,
            quantity: 2,
          }),
        ])
      );
      expect(createResponse.body.totals).toEqual({ itemCount: 1, totalQuantity: 2 });
    });
  });

  describe('PATCH /api/carts/items/:productId', () => {
    it('updates an item quantity', async () => {
      // First create an item
      await request(app)
        .post('/api/carts/items')
        .send({ productId: PRODUCT_ID, quantity: 1 });

      const updateResponse = await request(app)
        .patch(`/api/carts/items/${PRODUCT_ID}`)
        .send({ quantity: 4 });

      expect(updateResponse.statusCode).toBe(200);
      expect(updateResponse.body.message).toBe('Cart item updated successfully');
      const updatedItem = updateResponse.body.cart.items.find(
        (item) => item.productId === PRODUCT_ID
      );
      expect(updatedItem).toBeDefined();
      expect(updatedItem.quantity).toBe(4);
      expect(updateResponse.body.totals).toEqual({ itemCount: 1, totalQuantity: 4 });
    });

    it('returns 404 if item not in cart', async () => {
        const OTHER_PRODUCT_ID = new mongoose.Types.ObjectId().toString();
        // Create cart with one item
        await request(app)
            .post('/api/carts/items')
            .send({ productId: PRODUCT_ID, quantity: 1 });

        const updateResponse = await request(app)
            .patch(`/api/carts/items/${OTHER_PRODUCT_ID}`)
            .send({ quantity: 4 });

        expect(updateResponse.statusCode).toBe(404);
        expect(updateResponse.body.message).toBe('Item not found in cart');
    });
  });
  
  describe('DELETE /api/carts/items/:productId', () => {
    it('removes an existing line item and recalculates totals', async () => {
      await request(app)
        .post('/api/carts/items')
        .send({ productId: PRODUCT_ID, quantity: 3 });

      const deleteResponse = await request(app).delete(`/api/carts/items/${PRODUCT_ID}`);

      expect(deleteResponse.statusCode).toBe(200);
      expect(deleteResponse.body.message).toBe('Cart item removed successfully');
      expect(deleteResponse.body.cart.items).toEqual([]);
      expect(deleteResponse.body.totals).toEqual({ itemCount: 0, totalQuantity: 0 });
    });

    it('returns 404 when the cart does not exist', async () => {
      const response = await request(app).delete(`/api/carts/items/${PRODUCT_ID}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Cart not found');
    });

    it('returns 404 when the item is absent from the cart', async () => {
      await request(app)
        .post('/api/carts/items')
        .send({ productId: PRODUCT_ID, quantity: 1 });

      const missingProductId = new mongoose.Types.ObjectId().toString();
      const response = await request(app).delete(`/api/carts/items/${missingProductId}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Item not found in cart');
    });
  });

  describe('DELETE /api/carts', () => {
    it('clears the cart and returns an empty representation', async () => {
      await request(app)
        .post('/api/carts/items')
        .send({ productId: PRODUCT_ID, quantity: 2 });

      const response = await request(app).delete('/api/carts');

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Cart cleared successfully');
      expect(response.body.cart.items).toHaveLength(0);
      expect(response.body.totals).toEqual({ itemCount: 0, totalQuantity: 0 });

      const fetchResponse = await request(app).get('/api/carts');
      expect(fetchResponse.body.cart.items).toHaveLength(0);
    });

    it('returns already empty response when no cart exists', async () => {
      const response = await request(app).delete('/api/carts');

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Cart already empty');
      expect(response.body.cart.items).toHaveLength(0);
      expect(response.body.totals).toEqual({ itemCount: 0, totalQuantity: 0 });
    });
  });
});
