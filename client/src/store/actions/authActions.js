import apiClient from '../apiClient';
import {
  setauthloading,
  setauthsuccess,
  setautherror,
  clearuser,
} from '../reducers/authSlice';

export const asyncregisteruser = (payload) => async (dispatch) => {
  try {
    dispatch(setauthloading());
    const { data } = await apiClient.post('/api/auth/register', payload);
    dispatch(setauthsuccess(data?.user || data));
  } catch (error) {
    const message = error.response?.data?.message || 'Registration failed';
    dispatch(setautherror(message));
  }
};

export const asyncloginuser = (payload) => async (dispatch) => {
  try {
    dispatch(setauthloading());
    const { data } = await apiClient.post('/api/auth/login', payload);
    dispatch(setauthsuccess(data?.user || data));
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed';
    dispatch(setautherror(message));
  }
};

export const asyncloaduser = () => async (dispatch) => {
  try {
    dispatch(setauthloading());
    const { data } = await apiClient.get('/api/auth/me');
    dispatch(setauthsuccess(data?.user || data));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to load user';
    dispatch(setautherror(message));
  }
};

export const asynclogoutuser = () => async (dispatch) => {
  try {
    dispatch(setauthloading());
    await apiClient.get('/api/auth/logout');
    dispatch(clearuser());
  } catch (error) {
    const message = error.response?.data?.message || 'Logout failed';
    dispatch(setautherror(message));
  }
};
