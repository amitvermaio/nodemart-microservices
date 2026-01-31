import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
  filters: {
    q: '',
    minprice: null,
    maxprice: null,
  },
  pagination: {
    skip: 0,
    limit: 20,
    hasMore: true,
  },
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setproductsloading: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    setproducts: (state, action) => {
      state.status = 'succeeded';
      const { items, skip, limit, hasMore, filters } = action.payload || {};
      state.items = items || [];
      if (typeof skip === 'number') {
        state.pagination.skip = skip;
      }
      if (typeof limit === 'number') {
        state.pagination.limit = limit;
      }
      if (typeof hasMore === 'boolean') {
        state.pagination.hasMore = hasMore;
      }
      if (filters) {
        state.filters = {
          ...state.filters,
          ...filters,
        };
      }
    },
    setproduct: (state, action) => {
      state.status = 'succeeded';
      state.selected = action.payload || null;
    },
    setproductserror: (state, action) => {
      state.status = 'failed';
      state.error = action.payload || null;
    },
    setproductfilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
      state.pagination.skip = 0;
      state.pagination.hasMore = true;
    },
  },
});
export const { setproductsloading, setproducts, setproduct, setproductserror, setproductfilters } = productSlice.actions;

export default productSlice.reducer;
