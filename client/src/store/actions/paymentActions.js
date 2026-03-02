import { paymentApi } from '../../api/axios';
import {
  setpaymentsloading,
  setlastpayment,
  setpaymentserror,
} from '../reducers/paymentSlice';
import { toast } from 'sonner';

export const asynccreatepayment = (orderId) => async (dispatch) => {
  try {
    dispatch(setpaymentsloading());
    const { data } = await paymentApi.post(`/create/${orderId}`);
    dispatch(setlastpayment(data || null));
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create payment';
    dispatch(setpaymentserror(message));
    toast.error(message);
    throw error;
  }
};

export const asyncverifypayment = (payload) => async (dispatch) => {
  try {
    dispatch(setpaymentsloading());
    const { data } = await paymentApi.post('/verify', payload);
    dispatch(setlastpayment(data || null));
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to verify payment';
    dispatch(setpaymentserror(message));
    toast.error(message);
    throw error;
  }
};

export const asyncfetchpaymentstatus = (orderId) => async (dispatch) => {
  try {
    dispatch(setpaymentsloading());
    const { data } = await paymentApi.get(`/status/${orderId}`);
    dispatch(setlastpayment(data || null));
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch payment status';
    dispatch(setpaymentserror(message));
    toast.error(message);
    throw error;
  }
};