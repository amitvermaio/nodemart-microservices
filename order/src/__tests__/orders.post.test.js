import request from 'supertest';
import app from '../app.js';

describe('POST /api/orders', () => {
  it('should create an order from the current cart and return 201', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({
        cartId: 'dummy-cart-id',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('order');

    const { order } = response.body;

    expect(order).toHaveProperty('id');
    expect(order).toHaveProperty('items');
    expect(Array.isArray(order.items)).toBe(true);

    expect(order).toHaveProperty('status', 'pending');
    expect(order).toHaveProperty('taxTotal');
    expect(order).toHaveProperty('shippingTotal');
    expect(order).toHaveProperty('grandTotal');

    // Inventory reservation could be reflected via a flag or field
    // Adjust as per implementation details later.
    expect(order).toHaveProperty('inventoryReserved', true);
  });

  it('should validate input and return 400 for missing cartId', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });
});
