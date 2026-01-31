import apiClient from '../apiClient';
import {
  setcartloading,
  setcart,
  setcarterror,
} from '../reducers/cartSlice';

export const asyncfetchcart = () => async (dispatch) => {
  try {
    dispatch(setcartloading());
    const { data } = await apiClient.get('/api/carts');
    dispatch(setcart(data?.items || data?.cart?.items || []));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to load cart';
    dispatch(setcarterror(message));
  }
};

export const asyncadditemtocart = (payload) => async (dispatch) => {
  try {
    dispatch(setcartloading());
    const { data } = await apiClient.post('/api/carts/items', payload);
    dispatch(setcart(data?.items || data?.cart?.items || []));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to add item';
    dispatch(setcarterror(message));
  }
};

export const asyncupdatecartitem = ({ productId, ...body }) => async (dispatch) => {
  try {
    dispatch(setcartloading());
    const { data } = await apiClient.patch(`/api/carts/items/${productId}`, body);
    dispatch(setcart(data?.items || data?.cart?.items || []));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update item';
    dispatch(setcarterror(message));
  }
};

export const asyncdeletecartitem = (productId) => async (dispatch) => {
  try {
    dispatch(setcartloading());
    const { data } = await apiClient.delete(`/api/carts/items/${productId}`);
    dispatch(setcart(data?.items || data?.cart?.items || []));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete item';
    dispatch(setcarterror(message));
  }
};

export const asyncclearcart = () => async (dispatch) => {
  try {
    dispatch(setcartloading());
    const { data } = await apiClient.delete('/api/carts');
    dispatch(setcart(data?.items || data?.cart?.items || []));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to clear cart';
    dispatch(setcarterror(message));
  }
};
