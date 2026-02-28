import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { asyncfetchproducts } from '../store/actions/productActions';
import { setproductmeta } from '../store/reducers/productSlice';
import ItemCard from '../components/shop/ItemCard';
import FilterSidebar from '../components/shop/FilterSidebar';
import InfiniteScroll from 'react-infinite-scroll-component';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('q') || '';

  const dispatch = useDispatch();
  const {
    items: products,
    status,
    pagination,
    meta,
  } = useSelector((state) => state.products);

  const minPrice = meta.priceRange.min ?? 0;
  const maxPrice = meta.priceRange.max ?? 1000;

  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const [prevBounds, setPrevBounds] = useState({ min: minPrice, max: maxPrice });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  if (meta.priceRange.min !== null && meta.priceRange.max !== null) {
    if (prevBounds.min !== meta.priceRange.min || prevBounds.max !== meta.priceRange.max) {
      setPrevBounds({ min: meta.priceRange.min, max: meta.priceRange.max });
      setPriceRange([meta.priceRange.min, meta.priceRange.max]);
    }
  }

  useEffect(() => {
    dispatch(setproductmeta({ q: search, minprice: null, maxprice: null, selectedCategories: [] }));
  }, [search]);

  useEffect(() => {
    dispatch(asyncfetchproducts());
  }, [meta.q, meta.minprice, meta.maxprice, meta.selectedCategories, dispatch]);

  const handlePriceChange = useCallback((newRange) => {
      setPriceRange(newRange);
      dispatch(
        setproductmeta({
          minprice: newRange[0] <= minPrice ? null : newRange[0],
          maxprice: newRange[1] >= maxPrice ? null : newRange[1],
        })
      );
    },
    [dispatch, minPrice, maxPrice]
  );

  const handleToggleCategory = useCallback((category) => {
      setSelectedCategories((prev) => {
        const next = prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category];
        dispatch(setproductmeta({ selectedCategories: next }));
        return next;
      });
    },
    [dispatch]
  );

  const handleClearFilters = useCallback(() => {
    setSelectedCategories([]);
    setPriceRange([minPrice, maxPrice]);
    dispatch(setproductmeta({ minprice: null, maxprice: null, selectedCategories: [] }));
  }, [dispatch, minPrice, maxPrice]);

  const handleLoadMore = useCallback(() => {
    if (pagination.hasMore && status !== 'loadingMore') {
      dispatch(asyncfetchproducts({ append: true }));
    }
  }, [dispatch, pagination.hasMore, status]);

  const loading = status === 'loading';

  return (
    <section className="bg-zinc-950 text-zinc-100 min-h-[calc(100vh-4rem)] border-t border-zinc-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="space-y-2">
            <p className="font-code text-[11px] uppercase tracking-[0.2em] text-cyan-400">
              Catalog
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Shop all products
            </h1>
            <p className="font-body text-sm sm:text-base text-zinc-400 max-w-xl">
              Explore every product available on NodeMart — curated accessories, clothing and desk gear built for focused builders.
            </p>
          </div>

          <div className="flex items-center gap-3 justify-between sm:justify-end">
            <p className="text-xs text-zinc-400 font-body">
              Showing <span className="text-zinc-100 font-semibold">{products.length}</span> of{' '}
              <span className="text-zinc-100 font-semibold">{pagination.total}</span> products
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-zinc-800 bg-zinc-900 text-xs font-medium text-zinc-200 hover:border-cyan-500/70 hover:text-cyan-200 sm:hidden"
              onClick={() => setIsMobileFiltersOpen(true)}
            >
              <AdjustmentsHorizontalIcon className="size-4" />
              Filters
            </button>
          </div>
        </header>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
          <div className="hidden sm:block w-64">
            <FilterSidebar
              categories={meta.categories}
              selectedCategories={selectedCategories}
              onToggleCategory={handleToggleCategory}
              minPrice={Math.floor(minPrice)}
              maxPrice={Math.ceil(maxPrice)}
              priceRange={priceRange}
              onPriceChange={handlePriceChange}
              onClear={handleClearFilters}
              isMobile={false}
            />
          </div>

          <div className="flex-1 w-full">
            {loading ? (
              <div className="border border-dashed border-zinc-800 rounded-2xl p-10 flex items-center justify-center">
                <p className="text-sm text-zinc-400 animate-pulse">Loading products…</p>
              </div>
            ) : products.length === 0 ? (
              <div className="border border-dashed border-zinc-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-3 bg-zinc-950/60">
                <p className="text-sm font-semibold text-zinc-200">No products match your filters</p>
                <p className="text-xs text-zinc-500 max-w-sm">
                  Try widening your price range or selecting different categories to see more items.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-2 text-xs text-cyan-300 hover:text-cyan-200 underline underline-offset-4"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <InfiniteScroll
                dataLength={products.length}
                next={handleLoadMore}
                hasMore={pagination.hasMore}
                loader={
                  <div className="flex justify-center mt-8">
                    <p className="text-sm text-zinc-400 animate-pulse">Loading more products…</p>
                  </div>
                }
                style={{ overflow: 'visible' }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <ItemCard key={product._id || product.id} product={product} />
                  ))}
                </div>
              </InfiniteScroll>
            )}
          </div>
        </div>

        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-40 sm:hidden flex">
            <div
              className="flex-1 bg-black/60"
              onClick={() => setIsMobileFiltersOpen(false)}
            />
            <div className="w-[80%] max-w-xs p-3 pr-4">
              <FilterSidebar
                categories={meta.categories}
                selectedCategories={selectedCategories}
                onToggleCategory={handleToggleCategory}
                minPrice={Math.floor(minPrice)}
                maxPrice={Math.ceil(maxPrice)}
                priceRange={priceRange}
                onPriceChange={handlePriceChange}
                onClear={handleClearFilters}
                isMobile
                onClose={() => setIsMobileFiltersOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Shop;