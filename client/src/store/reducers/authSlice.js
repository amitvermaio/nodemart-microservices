import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  status: 'idle',
  error: null,
  isAuthenticated: false,
  role: null,
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
    },
    setautherror: (state, action) => {
      state.status = 'failed';
      state.error = action.payload || null;
    },
    clearuser: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
      state.isAuthenticated = false;
      state.role = null;
    },
  },
});
export const { setauthloading, setauthsuccess, setautherror, clearuser } = authSlice.actions;

export default authSlice.reducer;
