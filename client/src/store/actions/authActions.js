import { toast } from 'sonner';
import { authApi } from '../../api/axios';
import {
  setauthloading,
  setauthsuccess,
  setautherror,
  clearuser,
  setaddresses
} from '../reducers/authSlice';

export const asyncregisteruser = (payload) => async (dispatch) => {
  try {
    dispatch(setauthloading());
    const { data } = await authApi.post('/register', payload);
    dispatch(setauthsuccess(data?.user));
    toast.success('Registration successful');
    return true;
  } catch (error) {
    const message = error.response?.data?.message || 'Registration failed';
    toast.error(message);
    dispatch(setautherror(message));
    return false;
  }
};

export const asyncloginuser = (payload) => async (dispatch) => {
  try {
    dispatch(setauthloading());
    const { data } = await authApi.post('/login', payload);
    dispatch(setauthsuccess(data?.user));
    toast.success('Login successfully');
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed';
    dispatch(setautherror(message));
    toast.error(message);
    return false;
  }
};

export const asyncloaduser = () => async (dispatch) => {
  try {
    dispatch(setauthloading());
    const { data } = await authApi.get('/me');
    dispatch(setauthsuccess(data?.user));
  } catch (error) {
    dispatch(setautherror(error.response?.data?.message || 'Failed to load user'));
  }
};

export const asynclogoutuser = () => async (dispatch) => {
  try {
    dispatch(setauthloading());
    await authApi.get('/logout');
    dispatch(clearuser());
    return true;
  } catch (error) {
    const message = error.response?.data?.message || 'Logout failed';
    toast.error(message);
    dispatch(setautherror(message));
    return false;
  }
};

export const asyncnewaddress = (payload) => async (dispatch) => {
  try {
    const { data } = await authApi.post('/users/me/addresses', payload);
    dispatch(setaddresses(data?.addresses || []));
    toast.success('New address added successfully');
    return true;
  } catch (error) {
    toast.error('Failed to add new address');
    const message = error.response?.data?.message || 'Failed to add new address';
    dispatch(setautherror(message));
    return false;
  }
};

export const asyncfetchaddresses = () => async (dispatch) => {
  try {
    const { data } = await authApi.get('/users/me/addresses');
    dispatch(setaddresses(data?.addresses || []));
    return true;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch addresses';
    dispatch(setautherror(message));
    toast.error(message);
    return false;
  }
};

export const asyncmakedefaultaddress = (addressId) => async (dispatch) => {
  try {
    const { data } = await authApi.patch(`/users/me/addresses/${addressId}`);
    dispatch(setaddresses(data?.addresses || []));
    toast.success('Default address updated successfully');
    return true;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update default address';
    toast.error(message);
    dispatch(setautherror(message));
    return false;
  }
};

export const asyncdeleteaddress = (addressId) => async (dispatch) => {
  try {
    const { data } = await authApi.delete(`/users/me/addresses/${addressId}`);
    dispatch(setaddresses(data?.addresses || []));
    toast.success('Address deleted successfully');
    return true;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete address';
    toast.error(message);
    dispatch(setautherror(message));
    return false;
  }
};