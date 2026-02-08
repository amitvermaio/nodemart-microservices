import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import ItemCard from '../components/shop/ItemCard';
import FilterSidebar from '../components/shop/FilterSidebar';
import { asyncfetchproducts } from '../store/actions/productActions';

const Shop = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const searchTerm = (searchParams.get('q') ?? '').trim();

  const { items, status, error, pagination, meta, filters } = useSelector(
    (state) => state.products
  );

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(
    filters?.categories || []
  );
  const [priceRange, setPriceRange] = useState(null);
  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 0 });
  const [debouncedPriceRange, setDebouncedPriceRange] = useState(priceRange);

  const filterSignatureRef = useRef(null);
  const userAdjustedPriceRef = useRef(false);

  const currency = useMemo(() => {
    const detected = items.find((product) => product?.price?.currency);
    return detected?.price?.currency || 'INR';
  }, [items]);

  useEffect(() => {
    const min = Number(meta?.priceRange?.min);
    const max = Number(meta?.priceRange?.max);

    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      return;
    }

    const normalized = {
      min: Math.floor(min),
      max: Math.ceil(max),
    };

    startTransition(() => {
      setPriceBounds((prev) => {
        if (prev.min === normalized.min && prev.max === normalized.max) {
          return prev;
        }
        return normalized;
      });

      if (!userAdjustedPriceRef.current) {
        setPriceRange((prev) => {
          if (
            Array.isArray(prev) &&
            prev[0] === normalized.min &&
            prev[1] === normalized.max
          ) {
            return prev;
          }
          return [normalized.min, normalized.max];
        });
      }
    });
  }, [meta]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, 250);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [priceRange]);

  useEffect(() => {
    if (!Array.isArray(filters?.categories)) {
      return;
    }
    startTransition(() => {
      setSelectedCategories((prev) => {
        const prevKey = (prev || []).join('|');
        const nextKey = filters.categories.join('|');

        if (prevKey === nextKey) {
          return prev;
        }

        return [...filters.categories];
      });
    });
  }, [filters?.categories]);

  const computeFilterSignature = useCallback((payload) => {
    const sortedCategories = [...(payload.categories || [])].sort();
    return JSON.stringify({
      ...payload,
      categories: sortedCategories,
    });
  }, []);

  const toNumberOrNull = useCallback((value) => (
    typeof value === 'number' && Number.isFinite(value) ? value : null
  ), []);

  useEffect(() => {
    const payload = {
      q: searchTerm,
      minprice: toNumberOrNull(debouncedPriceRange?.[0]),
      maxprice: toNumberOrNull(debouncedPriceRange?.[1]),
      categories: selectedCategories,
    };

    const signature = computeFilterSignature(payload);
    if (filterSignatureRef.current === signature) {
      return;
    }

    filterSignatureRef.current = signature;

    dispatch(
      asyncfetchproducts({
        ...payload,
        reset: true,
      })
    );
  }, [
    dispatch,
    searchTerm,
    selectedCategories,
    debouncedPriceRange,
    computeFilterSignature,
    toNumberOrNull,
  ]);

  const handleToggleCategory = useCallback((category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((item) => item !== category);
      }
      return [...prev, category];
    });
  }, []);

  const handlePriceChange = useCallback((range) => {
    if (!Array.isArray(range) || range.length < 2) {
      return;
    }
    userAdjustedPriceRef.current = true;
    setPriceRange(range);
  }, []);

  const handleClearFilters = useCallback(() => {
    userAdjustedPriceRef.current = false;
    setSelectedCategories([]);
    if (Number.isFinite(priceBounds.min) && Number.isFinite(priceBounds.max)) {
      setPriceRange([priceBounds.min, priceBounds.max]);
    } else {
      setPriceRange(null);
    }
    setIsMobileFiltersOpen(false);
  }, [priceBounds]);

  const handleLoadMore = useCallback(() => {
    if (!pagination?.hasMore || status === 'loadingMore' || status === 'loading') {
      return;
    }
    dispatch(asyncfetchproducts({ reset: false }));
  }, [dispatch, pagination?.hasMore, status]);

  const availableCategories = useMemo(() => {
    if (Array.isArray(meta?.categories) && meta.categories.length > 0) {
      return meta.categories;
    }

    const derived = new Set();
    items.forEach((product) => {
      if (Array.isArray(product?.category)) {
        product.category.forEach((cat) => {
          if (cat) derived.add(cat);
        });
      } else if (product?.category) {
        derived.add(product.category);
      }
    });
    return Array.from(derived).sort();
  }, [items, meta?.categories]);

  const minPrice = Number.isFinite(priceBounds.min) ? priceBounds.min : 0;
  const maxPrice = Number.isFinite(priceBounds.max) ? priceBounds.max : 0;
  const activePriceRange = Array.isArray(priceRange)
    ? priceRange
    : [minPrice, maxPrice];

  const totalProducts = pagination?.total ?? items.length;
  const isInitialLoading = status === 'loading' && items.length === 0;

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
              Showing <span className="text-zinc-100 font-semibold">{items.length}</span> of{' '}
              <span className="text-zinc-100 font-semibold">{totalProducts}</span> products
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
              categories={availableCategories}
              selectedCategories={selectedCategories}
              onToggleCategory={handleToggleCategory}
              minPrice={minPrice}
              maxPrice={maxPrice}
              priceRange={activePriceRange}
              onPriceChange={handlePriceChange}
              onClear={handleClearFilters}
              isMobile={false}
            />
          </div>

          <div className="flex-1 w-full">
            {error && (
              <div className="border border-dashed border-red-500/40 rounded-2xl p-6 mb-4 text-sm text-red-200 bg-red-500/10">
                {error}
              </div>
            )}

            {isInitialLoading ? (
              <div className="border border-dashed border-zinc-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-3 bg-zinc-950/60">
                <p className="text-sm font-semibold text-zinc-200">Loading products…</p>
                <p className="text-xs text-zinc-500 max-w-sm">
                  Please hold on while we fetch the latest catalog.
                </p>
              </div>
            ) : items.length === 0 ? (
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
                dataLength={items.length}
                next={handleLoadMore}
                hasMore={Boolean(pagination?.hasMore)}
                loader={(
                  <div className="mt-6 text-xs text-zinc-500 text-center">
                    Loading more products…
                  </div>
                )}
                scrollThreshold={0.85}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {items.map((product) => (
                    <ItemCard key={product?._id || product?.id} product={product} currency={currency} />
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
                categories={availableCategories}
                selectedCategories={selectedCategories}
                onToggleCategory={handleToggleCategory}
                minPrice={minPrice}
                maxPrice={maxPrice}
                priceRange={activePriceRange}
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