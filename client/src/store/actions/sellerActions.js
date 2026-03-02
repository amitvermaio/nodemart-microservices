import { toast } from 'sonner';
import { sellerApi } from '../../api/axios';
import {
  setsellerloading,
  setsellererror,
  setsellermetrics,
  setsellerorders,
  setsellerproducts,
  setsellerdatasuccess,
} from '../reducers/sellerSlice';

export const asyncfetchsellermetrics = () => async (dispatch) => {
  try {
    const { data } = await sellerApi.get('/dashboard/metrics');
    dispatch(setsellermetrics(data));
    return true;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch metrics';
    dispatch(setsellererror(message));
    return false;
  }
};

export const asyncfetchsellerorders = () => async (dispatch) => {
  try {
    const { data } = await sellerApi.get('/dashboard/orders');
    dispatch(setsellerorders(data?.orders || []));
    return true;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch orders';
    dispatch(setsellererror(message));
    return false;
  }
};

export const asyncfetchsellerproducts = () => async (dispatch) => {
  try {
    const { data } = await sellerApi.get('/dashboard/products');
    dispatch(setsellerproducts(data));
    return true;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch products';
    dispatch(setsellererror(message));
    return false;
  }
};

export const asyncfetchsellerdashboard = () => async (dispatch) => {
  try {
    dispatch(setsellerloading());

    const [metricsRes, ordersRes, productsRes] = await Promise.all([
      sellerApi.get('/dashboard/metrics'),
      sellerApi.get('/dashboard/orders'),
      sellerApi.get('/dashboard/products'),
    ]);

    dispatch(setsellermetrics(metricsRes.data));
    dispatch(setsellerorders(ordersRes.data?.orders || []));
    dispatch(setsellerproducts(productsRes.data));
    dispatch(setsellerdatasuccess());
    return true;
  } catch (error) {
    const message = error.response?.data?.message || 'Unable to load dashboard data';
    dispatch(setsellererror(message));
    toast.error(message);
    return false;
  }
};
