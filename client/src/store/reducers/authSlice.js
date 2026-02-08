import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  status: 'idle',
  error: null,
  isAuthenticated: false,
  role: null,
  socketConnected: false,
  addresses: []
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setauthloading: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    setauthsuccess: (state, action) => {
      state.status = 'succeeded';
      state.user = action.payload || null;
      state.isAuthenticated = true;
      state.role = action.payload?.role || null;
      if (Array.isArray(action.payload?.addresses)) {
        state.addresses = action.payload.addresses;
      }
      state.error = null;
    },
    setautherror: (state, action) => {
      state.status = 'failed';
      state.error = action.payload || null;
    },
    setsocketconnected: (state, action) => {
      state.socketConnected = action.payload;
    },
    clearuser: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
      state.isAuthenticated = false;
      state.role = null;
      state.addresses = [];
    },
    setaddresses: (state, action) => {
      state.addresses = Array.isArray(action.payload) ? action.payload : [];
    },
    setdefaultaddress: (state, action) => {
      const addressId = action.payload;
      state.addresses = state.addresses.map(address => ({
        ...address,
        isDefault: (address._id || address.id) === addressId,
      }));
    },
    deleteaddress: (state, action) => {
      state.addresses = state.addresses.filter(address => (address._id || address.id) !== action.payload);
    },
  },
});

export const { 
  setauthloading, 
  setauthsuccess, 
  setautherror, 
  clearuser, 
  setsocketconnected, 
  setaddresses, 
  setdefaultaddress,
  deleteaddress 
} = authSlice.actions;
export default authSlice.reducer;
