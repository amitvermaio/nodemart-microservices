import request from 'supertest';
import app from '../src/app.js';

describe('Order API contract', () => {
  describe('POST /api/orders', () => {
    it('creates a pending order snapshot from the active cart', async () => {
      const payload = {
        shippingAddress: {
          street: '221B Baker Street',
          city: 'London',
          state: 'LDN',
          zip: 'NW16XE',
          country: 'UK'
        },
        deliveryInstructions: 'Leave at the reception'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', 'Bearer fake-user-token')
        .send(payload);

      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          status: 'pending',
          items: expect.any(Array),
          totals: {
            currency: expect.any(String),
            subtotal: expect.any(Number),
            tax: expect.any(Number),
            shipping: expect.any(Number),
            grandTotal: expect.any(Number)
          },
          timeline: expect.arrayContaining([
            expect.objectContaining({
              status: 'pending',
              at: expect.any(String)
            })
          ])
        }
      });

      const createdOrder = response.body.data;
      expect(createdOrder.items.every(item => Object.prototype.hasOwnProperty.call(item, 'priceSnapshot'))).toBe(true);
      expect(createdOrder).toHaveProperty('reservation', expect.objectContaining({
        inventoryReserved: true
      }));
    });
  });

  describe('GET /api/orders/:id', () => {
    it('returns an order with timeline and payment summary', async () => {
      const orderId = 'order-test-id';
      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', 'Bearer fake-user-token');

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          id: orderId,
          timeline: expect.arrayContaining([
            expect.objectContaining({ status: expect.any(String), at: expect.any(String) })
          ]),
          paymentSummary: expect.objectContaining({
            currency: expect.any(String),
            net: expect.any(Number),
            method: expect.any(String),
            captured: expect.any(Boolean)
          })
        }
      });
    });
  });

  describe('GET /api/orders/me', () => {
    it('returns a paginated view of the customer orders', async () => {
      const response = await request(app)
        .get('/api/orders/me?page=1&limit=5')
        .set('Authorization', 'Bearer fake-user-token');

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          results: expect.any(Array),
          meta: {
            page: 1,
            limit: 5,
            total: expect.any(Number),
            hasNextPage: expect.any(Boolean)
          }
        }
      });
    });
  });

  describe('GET /api/orders/seller', () => {
    it('returns seller scoped orders honoring filters', async () => {
      const response = await request(app)
        .get('/api/orders/seller?status=pending&from=2024-01-01&to=2024-12-31')
        .set('Authorization', 'Bearer fake-seller-token');

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          results: expect.arrayContaining([
            expect.objectContaining({
              sellerId: expect.any(String),
              items: expect.arrayContaining([
                expect.objectContaining({ sellerId: expect.any(String) })
              ])
            })
          ])
        }
      });

      if (response.body.data.results.length > 0) {
        const sellerOrder = response.body.data.results[0];
        expect(sellerOrder.items.every(item => item.sellerId === sellerOrder.sellerId)).toBe(true);
      }
    });
  });

  describe('POST /api/orders/:id/cancel', () => {
    it('allows buyer initiated cancellation when pending or paid', async () => {
      const orderId = 'order-test-id';
      const response = await request(app)
        .post(`/api/orders/${orderId}/cancel`)
        .set('Authorization', 'Bearer fake-user-token')
        .send({ reason: 'Changed my mind' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          id: orderId,
          status: 'cancelled',
          cancellation: {
            reason: 'Changed my mind',
            initiatedBy: 'buyer'
          },
          timeline: expect.arrayContaining([
            expect.objectContaining({ status: 'cancelled', at: expect.any(String) })
          ])
        }
      });
    });
  });

  describe('POST /api/orders/:id/address', () => {
    it('updates the delivery address before payment capture', async () => {
      const orderId = 'order-test-id';
      const payload = {
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'NT',
        zip: '49007',
        country: 'USA'
      };

      const response = await request(app)
        .post(`/api/orders/${orderId}/address`)
        .set('Authorization', 'Bearer fake-user-token')
        .send(payload);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          id: orderId,
          shippingAddress: payload,
          timeline: expect.arrayContaining([
            expect.objectContaining({ status: 'address-updated', at: expect.any(String) })
          ])
        }
      });
    });
  });
});
