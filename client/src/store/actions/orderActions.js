import apiClient from '../apiClient';
import {
  setordersloading,
  setorders,
  setcurrentorder,
  setorderserror,
} from '../reducers/orderSlice';

export const asynccreateorder = (payload) => async (dispatch) => {
  try {
    dispatch(setordersloading());
    const { data } = await apiClient.post('/api/orders', payload);
    const order = data?.order || data;
    if (order) {
      dispatch(setcurrentorder(order));
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create order';
    dispatch(setorderserror(message));
  }
};

export const asyncfetchmyorders = () => async (dispatch) => {
  try {
    dispatch(setordersloading());
    const { data } = await apiClient.get('/api/orders/me');
    dispatch(setorders(data?.orders || data || []));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to load orders';
    dispatch(setorderserror(message));
  }
};

export const asyncfetchorderbyid = (id) => async (dispatch) => {
  try {
    dispatch(setordersloading());
    const { data } = await apiClient.get(`/api/orders/${id}`);
    dispatch(setcurrentorder(data?.order || data || null));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to load order';
    dispatch(setorderserror(message));
  }
};

export const asynccancelorder = (id) => async (dispatch) => {
  try {
    dispatch(setordersloading());
    const { data } = await apiClient.post(`/api/orders/${id}/cancel`);
    const order = data?.order || data;
    if (order) {
      dispatch(setcurrentorder(order));
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to cancel order';
    dispatch(setorderserror(message));
  }
};
