import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  metrics: null,
  orders: [],
  products: [],
  inventory: null,
  lowStock: null,
  status: 'idle',
  error: null,
};

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    setsellerloading: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    setsellererror: (state, action) => {
      state.status = 'failed';
      state.error = action.payload || null;
    },
    setsellermetrics: (state, action) => {
      state.metrics = action.payload || null;
      state.status = 'succeeded';
      state.error = null;
    },
    setsellerorders: (state, action) => {
      state.orders = Array.isArray(action.payload) ? action.payload : [];
    },
    setsellerproducts: (state, action) => {
      state.products = action.payload?.products || [];
      state.inventory = action.payload?.inventory || null;
      state.lowStock = action.payload?.lowStock || null;
    },
    setsellerdatasuccess: (state) => {
      state.status = 'succeeded';
      state.error = null;
    },
    clearseller: () => initialState,
  },
});

export const {
  setsellerloading,
  setsellererror,
  setsellermetrics,
  setsellerorders,
  setsellerproducts,
  setsellerdatasuccess,
  clearseller,
} = sellerSlice.actions;

export default sellerSlice.reducer;
