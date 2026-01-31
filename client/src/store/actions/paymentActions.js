import apiClient from '../apiClient';
import {
  setpaymentsloading,
  setlastpayment,
  setpaymentserror,
} from '../reducers/paymentSlice';

export const asynccreatepayment = ({ orderId, ...body }) => async (dispatch) => {
  try {
    dispatch(setpaymentsloading());
    const { data } = await apiClient.post(`/api/payments/create/${orderId}`, body);
    dispatch(setlastpayment(data?.payment || data || null));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create payment';
    dispatch(setpaymentserror(message));
  }
};

export const asyncverifypayment = (payload) => async (dispatch) => {
  try {
    dispatch(setpaymentsloading());
    const { data } = await apiClient.post('/api/payments/verify', payload);
    dispatch(setlastpayment(data?.payment || data || null));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to verify payment';
    dispatch(setpaymentserror(message));
  }
};
