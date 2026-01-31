import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import productsReducer from './reducers/productSlice';
import cartReducer from './reducers/cartSlice';
import ordersReducer from './reducers/orderSlice';
import paymentsReducer from './reducers/paymentSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
    payments: paymentsReducer,
  },
});

export default store;
