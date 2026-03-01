import { cartApi } from '../../api/axios';
import {
  setcartloading,
  setcart,
  setcarterror,
} from '../reducers/cartSlice';
import { toast } from 'sonner';

const extractCart = (data) => ({
  items: data?.cart?.items || [],
  totals: data?.totals || { itemCount: 0, totalQuantity: 0 },
});

export const asyncfetchcart = () => async (dispatch) => {
  try {
    dispatch(setcartloading());
    const { data } = await cartApi.get('/');
    dispatch(setcart(extractCart(data)));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to load cart';
    dispatch(setcarterror(message));
  }
};

export const asyncadditemtocart = (payload) => async (dispatch) => {
  try {
    dispatch(setcartloading());
    const { data } = await cartApi.post('/items', payload);
    dispatch(setcart(extractCart(data)));
    toast.success('Item added to cart');
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to add item';
    dispatch(setcarterror(message));
    toast.error(message);
  }
};

export const asyncupdatecartitem = ({ productId, ...body }) => async (dispatch) => {
  try {
    dispatch(setcartloading());
    const { data } = await cartApi.patch(`/items/${productId}`, body);
    dispatch(setcart(extractCart(data)));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update item';
    dispatch(setcarterror(message));
    toast.error(message);
  }
};

export const asyncdeletecartitem = (productId) => async (dispatch) => {
  try {
    dispatch(setcartloading());
    const { data } = await cartApi.delete(`/items/${productId}`);
    dispatch(setcart(extractCart(data)));
    toast.success('Item removed from cart');
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete item';
    dispatch(setcarterror(message));
    toast.error(message);
  }
};

export const asyncclearcart = () => async (dispatch) => {
  try {
    dispatch(setcartloading());
    const { data } = await cartApi.delete('/');
    dispatch(setcart(extractCart(data)));
    toast.success('Cart cleared');
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to clear cart';
    dispatch(setcarterror(message));
    toast.error(message);
  }
};
