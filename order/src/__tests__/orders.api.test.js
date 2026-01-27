import request from 'supertest';
import app from '../app.js';

describe('Order APIs', () => {
  describe('GET /api/orders/:id', () => {
    it('should return order details with timeline and payment summary', async () => {
      const orderId = 'sample-order-id';

      const response = await request(app).get(`/api/orders/${orderId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('order');
      expect(response.body.order).toHaveProperty('id');
      expect(response.body.order).toHaveProperty('items');
      expect(Array.isArray(response.body.order.items)).toBe(true);

      expect(response.body).toHaveProperty('timeline');
      expect(Array.isArray(response.body.timeline)).toBe(true);

      expect(response.body).toHaveProperty('paymentSummary');
      expect(response.body.paymentSummary).toHaveProperty('itemsTotal');
      expect(response.body.paymentSummary).toHaveProperty('shippingTotal');
      expect(response.body.paymentSummary).toHaveProperty('taxTotal');
      expect(response.body.paymentSummary).toHaveProperty('grandTotal');
      expect(response.body.paymentSummary).toHaveProperty('currency');
    });
  });

  describe('GET /api/orders/me', () => {
    it('should return a paginated list of customer orders', async () => {
      const response = await request(app).get('/api/orders/me');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('orders');
      expect(Array.isArray(response.body.orders)).toBe(true);

      expect(response.body).toHaveProperty('meta');
      expect(response.body.meta).toHaveProperty('page');
      expect(response.body.meta).toHaveProperty('limit');
      expect(response.body.meta).toHaveProperty('total');
      expect(response.body.meta).toHaveProperty('hasNextPage');
    });

    it('should support explicit pagination parameters', async () => {
      const response = await request(app).get('/api/orders/me?page=2&limit=5');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('orders');
      expect(Array.isArray(response.body.orders)).toBe(true);

      expect(response.body).toHaveProperty('meta');
      expect(response.body.meta).toMatchObject({
        page: 2,
        limit: 5,
      });
    });
  });

  describe('GET /api/orders/seller', () => {
    it('should return seller orders and support status/date filters', async () => {
      const response = await request(app).get(
        '/api/orders/seller?status=shipped&from=2025-01-01&to=2025-12-31',
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('orders');
      expect(Array.isArray(response.body.orders)).toBe(true);

      expect(response.body).toHaveProperty('meta');
      expect(response.body.meta).toHaveProperty('filters');
      expect(response.body.meta.filters).toMatchObject({
        status: 'shipped',
      });
    });
  });

  describe('POST /api/orders/:id/cancel', () => {
    it('should cancel an order when it is in a cancellable state', async () => {
      const orderId = 'cancellable-order-id';

      const response = await request(app)
        .post(`/api/orders/${orderId}/cancel`)
        .send({ reason: 'Changed my mind' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('order');
      expect(response.body.order).toHaveProperty('id');
      expect(response.body.order).toHaveProperty('status', 'cancelled');

      // Optional: refund information when applicable
      if (response.body.refund) {
        expect(response.body.refund).toHaveProperty('amount');
        expect(response.body.refund).toHaveProperty('currency');
        expect(response.body.refund).toHaveProperty('status');
      }
    });

    it('should reject cancellation when order is not in a cancellable state', async () => {
      const orderId = 'non-cancellable-order-id';

      const response = await request(app)
        .post(`/api/orders/${orderId}/cancel`)
        .send({ reason: 'Too late to cancel' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/orders/:id/address', () => {
    it('should attach or update the delivery address before payment capture', async () => {
      const orderId = 'address-order-id';
      const newAddress = {
        street: '123 Test Street',
        city: 'Testville',
        state: 'TS',
        zip: '12345',
        country: 'Testland',
      };

      const response = await request(app)
        .post(`/api/orders/${orderId}/address`)
        .send({ shippingAddress: newAddress });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('order');
      expect(response.body.order).toHaveProperty('id');
      expect(response.body.order).toHaveProperty('shippingAddress');
      expect(response.body.order.shippingAddress).toMatchObject(newAddress);
    });

    it('should validate delivery address payload', async () => {
      const orderId = 'invalid-address-order-id';

      const response = await request(app)
        .post(`/api/orders/${orderId}/address`)
        .send({ shippingAddress: { city: 'Only City' } });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });
});
