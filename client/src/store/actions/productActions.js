import { productApi } from '../../api/axios';
import {
  setproductsloading,
  setproducts,
  setproduct,
  setproductserror,
} from '../reducers/productSlice';

const sanitizeNumber = (value) => (
  typeof value === 'number' && Number.isFinite(value)
    ? value
    : undefined
);

export const asyncfetchproducts = ({
  q,
  minprice,
  maxprice,
  categories,
  skip,
  limit,
  reset = true,
} = {}) => async (dispatch, getState) => {
  const state = getState().products;
  const currentFilters = state.filters || {};

  const effectiveFilters = {
    q: typeof q === 'string' ? q.trim() : currentFilters.q || '',
    minprice: minprice ?? currentFilters.minprice,
    maxprice: maxprice ?? currentFilters.maxprice,
    categories: Array.isArray(categories)
      ? categories
      : currentFilters.categories || [],
  };

  const resolvedLimit = sanitizeNumber(limit) ?? state.pagination.limit ?? 20;
  const fallbackSkip = state.pagination.skip ?? 0;
  const resolvedSkip = sanitizeNumber(skip);
  const applySkip = reset ? 0 : (resolvedSkip ?? fallbackSkip);
  const isAppend = !reset && applySkip > 0;

  dispatch(setproductsloading(isAppend ? 'append' : 'reset'));

  const params = {
    skip: applySkip,
    limit: resolvedLimit,
  };

  if (effectiveFilters.q) {
    params.q = effectiveFilters.q;
  }
  if (effectiveFilters.minprice !== undefined && effectiveFilters.minprice !== null) {
    params.minprice = effectiveFilters.minprice;
  }
  if (effectiveFilters.maxprice !== undefined && effectiveFilters.maxprice !== null) {
    params.maxprice = effectiveFilters.maxprice;
  }
  if (effectiveFilters.categories && effectiveFilters.categories.length > 0) {
    params.category = effectiveFilters.categories.join(',');
  }

  try {
    const { data } = await productApi.get('/', { params });
    const items = Array.isArray(data?.data) ? data.data : [];
    const pagination = data?.pagination || {};
    const meta = data?.meta || {};

    const total = typeof pagination.total === 'number'
      ? pagination.total
      : (reset ? items.length : state.pagination.total || 0);
    const nextSkip = typeof pagination.skip === 'number'
      ? pagination.skip
      : applySkip + items.length;
    const hasMore = typeof pagination.hasMore === 'boolean'
      ? pagination.hasMore
      : nextSkip < total;

    dispatch(
      setproducts({
        items,
        append: isAppend,
        skip: nextSkip,
        limit: resolvedLimit,
        hasMore,
        total,
        filters: {
          q: effectiveFilters.q,
          minprice: effectiveFilters.minprice ?? null,
          maxprice: effectiveFilters.maxprice ?? null,
          categories: effectiveFilters.categories,
        },
        meta,
      })
    );
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to load products';
    dispatch(setproductserror(message));
  }
};

export const asyncfetchproductbyid = (id) => async (dispatch) => {
  try {
    dispatch(setproductsloading());
    const { data } = await productApi.get(`/${id}`);
    dispatch(setproduct(data?.product || data || null));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to load product';
    dispatch(setproductserror(message));
  }
};
