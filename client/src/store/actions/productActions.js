import { productApi } from '../../api/axios';
import {
  setproductsloading,
  setproducts,
  setproduct,
  setproductserror,
} from '../reducers/productSlice';

export const asyncfetchproducts = ({ q, minprice, maxprice, skip = 0, limit = 20 } = {}) => async (dispatch) => {
  try {
    dispatch(setproductsloading());
    const params = {};
    if (q) params.q = q;
    if (minprice !== undefined && minprice !== null) params.minprice = minprice;
    if (maxprice !== undefined && maxprice !== null) params.maxprice = maxprice;
    params.skip = skip;
    params.limit = limit;

    const { data } = await productApi.get('/', { params });
    const items = data?.data || [];
    const hasMore = Array.isArray(items) && items.length === limit;

    dispatch(
      setproducts({
        items,
        skip,
        limit,
        hasMore,
        filters: {
          q: q || '',
          minprice: minprice ?? null,
          maxprice: maxprice ?? null,
        },
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
