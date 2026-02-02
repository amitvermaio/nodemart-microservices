import { toast } from 'sonner';
import { authApi } from '../../api/axios';
import {
  setauthloading,
  setauthsuccess,
  setautherror,
  clearuser,
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
    const message = error.response?.data?.message || 'Failed to load user';
    toast.error(message);
    dispatch(setautherror(message));
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
