import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  current: null,
  status: 'idle',
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setordersloading: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    setorders: (state, action) => {
      state.status = 'succeeded';
      state.list = action.payload || [];
    },
    setcurrentorder: (state, action) => {
      state.status = 'succeeded';
      state.current = action.payload || null;
    },
    setorderserror: (state, action) => {
      state.status = 'failed';
      state.error = action.payload || null;
    },
  },
});
export const { setordersloading, setorders, setcurrentorder, setorderserror } = orderSlice.actions;

export default orderSlice.reducer;
