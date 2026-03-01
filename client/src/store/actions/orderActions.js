import { orderApi } from '../../api/axios';
import {
  setordersloading,
  setorders,
  setcurrentorder,
  setorderserror,
} from '../reducers/orderSlice';
import { toast } from 'sonner';

export const asynccreateorder = (payload) => async (dispatch) => {
  try {
    dispatch(setordersloading());
    const { data } = await orderApi.post('/', payload);
    const order = data?.order || data;
    if (order) {
      dispatch(setcurrentorder(order));
    }
    toast.success('Order placed successfully!');
    return order;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create order';
    dispatch(setorderserror(message));
    toast.error(message);
    throw error;
  }
};

export const asyncfetchmyorders = (params = {}) => async (dispatch) => {
  try {
    dispatch(setordersloading());
    const { data } = await orderApi.get('/me', { params });
    dispatch(setorders(data?.orders || data || []));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to load orders';
    dispatch(setorderserror(message));
  }
};

export const asyncfetchorderbyid = (id) => async (dispatch) => {
  try {
    dispatch(setordersloading());
    const { data } = await orderApi.get(`/${id}`);
    dispatch(setcurrentorder(data?.order || data || null));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to load order';
    dispatch(setorderserror(message));
  }
};

export const asynccancelorder = (id) => async (dispatch) => {
  try {
    dispatch(setordersloading());
    const { data } = await orderApi.post(`/${id}/cancel`);
    const order = data?.order || data;
    if (order) {
      dispatch(setcurrentorder(order));
    }
    toast.success('Order cancelled');
    return order;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to cancel order';
    dispatch(setorderserror(message));
    toast.error(message);
  }
};
