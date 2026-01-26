import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import connectDB from '../config/db.js';

const PRODUCT_ID = 'prod-1';

describe('Cart API', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
    await connectDB();
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    await Promise.all(
      Object.values(collections).map((collection) => collection.deleteMany({}))
    );
  });

  afterAll(async () => {
    await mongoose.connection.close(true);
    await mongoServer.stop();
  });

  describe('GET /api/cart', () => {
    it('returns an empty cart with recalculated totals when nothing was added yet', async () => {
      const response = await request(app).get('/api/cart');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          items: expect.any(Array),
          totals: expect.any(Object),
        })
      );
      expect(response.body.items).toHaveLength(0);
    });
  });

  describe('POST /api/cart/items', () => {
    it('adds a new item and returns the refreshed cart totals', async () => {
      const createResponse = await request(app)
        .post('/api/cart/items')
        .send({ productId: PRODUCT_ID, quantity: 2 });

      expect(createResponse.statusCode).toBe(201);
      expect(createResponse.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            productId: PRODUCT_ID,
            quantity: 2,
          }),
        ])
      );
      expect(createResponse.body).toHaveProperty('totals');
      expect(Object.values(createResponse.body.totals)).toEqual(
        expect.arrayContaining([expect.any(Number)])
      );

      const fetchResponse = await request(app).get('/api/cart');
      expect(fetchResponse.statusCode).toBe(200);
      const storedItem = fetchResponse.body.items.find(
        (item) => item.productId === PRODUCT_ID
      );
      expect(storedItem).toBeDefined();
      expect(storedItem.quantity).toBe(2);
    });
  });

  describe('PATCH /api/cart/items/:productId', () => {
    it('updates an item quantity and re-evaluates totals', async () => {
      await request(app)
        .post('/api/cart/items')
        .send({ productId: PRODUCT_ID, quantity: 1 });

      const updateResponse = await request(app)
        .patch(`/api/cart/items/${PRODUCT_ID}`)
        .send({ quantity: 4 });

      expect(updateResponse.statusCode).toBe(200);
      const updatedItem = updateResponse.body.items.find(
        (item) => item.productId === PRODUCT_ID
      );
      expect(updatedItem).toBeDefined();
      expect(updatedItem.quantity).toBe(4);
      expect(updateResponse.body).toHaveProperty('totals');

      const dropResponse = await request(app)
        .patch(`/api/cart/items/${PRODUCT_ID}`)
        .send({ quantity: 0 });

      expect(dropResponse.statusCode).toBe(200);
      const remaining = dropResponse.body.items.find(
        (item) => item.productId === PRODUCT_ID
      );
      expect(remaining).toBeUndefined();
    });
  });

  describe('DELETE /api/cart/items/:productId', () => {
    it('removes a line item and responds with the refreshed cart view', async () => {
      await request(app)
        .post('/api/cart/items')
        .send({ productId: PRODUCT_ID, quantity: 3 });

      const deleteResponse = await request(app).delete(
        `/api/cart/items/${PRODUCT_ID}`
      );

      expect(deleteResponse.statusCode).toBeGreaterThanOrEqual(200);
      expect(deleteResponse.statusCode).toBeLessThan(300);
      if (deleteResponse.statusCode === 204) {
        const fetchResponse = await request(app).get('/api/cart');
        const remainingItems = fetchResponse.body.items.filter(
          (item) => item.productId === PRODUCT_ID
        );
        expect(remainingItems).toHaveLength(0);
      } else {
        expect(deleteResponse.body.items).toEqual(expect.any(Array));
        const remainingItems = deleteResponse.body.items.filter(
          (item) => item.productId === PRODUCT_ID
        );
        expect(remainingItems).toHaveLength(0);
      }
    });
  });

  describe('DELETE /api/cart', () => {
    it('clears the cart and yields an empty result', async () => {
      await request(app)
        .post('/api/cart/items')
        .send({ productId: PRODUCT_ID, quantity: 2 });

      const clearResponse = await request(app).delete('/api/cart');

      expect(clearResponse.statusCode).toBeGreaterThanOrEqual(200);
      expect(clearResponse.statusCode).toBeLessThan(300);
      if (clearResponse.statusCode === 204) {
        const fetchResponse = await request(app).get('/api/cart');
        expect(fetchResponse.body.items).toHaveLength(0);
        expect(fetchResponse.body).toHaveProperty('totals');
      } else {
        expect(clearResponse.body.items).toHaveLength(0);
        expect(clearResponse.body).toHaveProperty('totals');
      }
    });
  });
});
