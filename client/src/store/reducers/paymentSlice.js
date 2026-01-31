import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lastPayment: null,
  status: 'idle',
  error: null,
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setpaymentsloading: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    setlastpayment: (state, action) => {
      state.status = 'succeeded';
      state.lastPayment = action.payload || null;
    },
    setpaymentserror: (state, action) => {
      state.status = 'failed';
      state.error = action.payload || null;
    },
  },
});
export const { setpaymentsloading, setlastpayment, setpaymentserror } = paymentSlice.actions;

export default paymentSlice.reducer;
