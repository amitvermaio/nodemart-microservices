import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setcartloading: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    setcart: (state, action) => {
      state.status = 'succeeded';
      state.items = action.payload || [];
    },
    setcarterror: (state, action) => {
      state.status = 'failed';
      state.error = action.payload || null;
    },
  },
});
export const { setcartloading, setcart, setcarterror } = cartSlice.actions;

export default cartSlice.reducer;
