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
    categories: [],
  },
  pagination: {
    skip: 0,
    limit: 20,
    hasMore: true,
    total: 0,
  },
  meta: {
    priceRange: {
      min: null,
      max: null,
    },
    categories: [],
  },
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setproductsloading: (state, action) => {
      state.status = action.payload === 'append' ? 'loadingMore' : 'loading';
      state.error = null;
    },
    setproducts: (state, action) => {
      state.status = 'succeeded';
      const {
        items = [],
        skip,
        limit,
        hasMore,
        total,
        filters,
        meta,
        append,
      } = action.payload || {};

      if (append) {
        const existingIds = new Set(
          state.items.map((item) => (item?._id || item?.id || '').toString())
        );
        const merged = items.filter((item) => {
          const id = (item?._id || item?.id || '').toString();
          if (!id) {
            return true;
          }
          if (existingIds.has(id)) {
            return false;
          }
          existingIds.add(id);
          return true;
        });
        state.items = [...state.items, ...merged];
      } else {
        state.items = items;
      }

      if (typeof skip === 'number') {
        state.pagination.skip = skip;
      }
      if (typeof limit === 'number') {
        state.pagination.limit = limit;
      }
      if (typeof hasMore === 'boolean') {
        state.pagination.hasMore = hasMore;
      }
      if (typeof total === 'number') {
        state.pagination.total = total;
      }
      if (filters) {
        state.filters = {
          ...state.filters,
          ...filters,
        };
      }
      if (meta) {
        state.meta = {
          ...state.meta,
          ...meta,
          priceRange: {
            ...state.meta.priceRange,
            ...meta.priceRange,
          },
          categories: Array.isArray(meta.categories)
            ? meta.categories.filter(Boolean)
            : state.meta.categories,
        };
      }
    },
    setproduct: (state, action) => {
      state.status = 'succeeded';
      state.selected = action.payload || null;
      state.error = null;
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
