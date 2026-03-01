import { productApi } from '../../api/axios';
import {
  setproductsloading,
  setproducts,
  setproduct,
  setproductserror,
  setlastfetchkey,
} from '../reducers/productSlice';

export const asyncfetchproducts = ({ append = false } = {}) => async (dispatch, getState) => {
  try {
    const { meta, pagination, items, _lastFetchKey } = getState().products;

    const fetchKey = JSON.stringify({
      q: meta.q,
      minprice: meta.minprice,
      maxprice: meta.maxprice,
      selectedCategories: meta.selectedCategories,
    });

    if (!append && items.length > 0 && _lastFetchKey === fetchKey) {
      return;
    }

    dispatch(setproductsloading(append ? 'append' : undefined));

    const params = {
      skip: append ? pagination.skip : 0,
      limit: pagination.limit,
    };

    if (meta.q) params.q = meta.q;
    if (Number.isFinite(meta.minprice)) params.minprice = meta.minprice;
    if (Number.isFinite(meta.maxprice)) params.maxprice = meta.maxprice;
    if (meta.selectedCategories?.length) {
      params.category = meta.selectedCategories.join(',');
    }

    const { data } = await productApi.get('/', { params });

    dispatch(
      setproducts({
        items: data?.data || [],
        skip: data?.pagination?.skip,
        limit: data?.pagination?.limit,
        hasMore: data?.pagination?.hasMore,
        total: data?.pagination?.total,
        meta: data?.meta,
        append,
      })
    );
    dispatch(setlastfetchkey(fetchKey));
  } catch (error) {
    const message =
      error.response?.data?.message || 'Failed to load products';
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
