import axios from 'axios';

const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_BASE_URL || 'http://localhost:4000/api/auth',
  withCredentials: true,
});

const productApi = axios.create({
  baseURL: import.meta.env.VITE_PRODUCTS_API_BASE_URL || 'http://localhost:4001/api/products',
  withCredentials: true,
});

const cartApi = axios.create({
  baseURL: import.meta.env.VITE_CART_API_BASE_URL || 'http://localhost:4002/api/cart',
  withCredentials: true,
});

const orderApi = axios.create({
  baseURL: import.meta.env.VITE_ORDERS_API_BASE_URL || 'http://localhost:4003/api/orders',
  withCredentials: true,
});

const paymentApi = axios.create({
  baseURL: import.meta.env.VITE_PAYMENTS_API_BASE_URL || 'http://localhost:4004/api/payments',
  withCredentials: true,
});

const aiApi = axios.create({
  baseURL: import.meta.env.VITE_AI_API_BASE_URL || 'http://localhost:4005',
  withCredentials: true,
});

const notificationApi = axios.create({
  baseURL: import.meta.env.VITE_NOTIFICATION_API_BASE_URL || 'http://localhost:4006/api/notifications',
  withCredentials: true,
});

const sellerApi = axios.create({
  baseURL: import.meta.env.VITE_SELLER_API_BASE_URL || 'http://localhost:4007/api/seller',
  withCredentials: true,
});

export {
  authApi,
  productApi,
  cartApi,
  orderApi,
  paymentApi,
  aiApi,
  notificationApi,
  sellerApi,
}