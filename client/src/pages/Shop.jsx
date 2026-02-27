import { useMemo, useState } from 'react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import ItemCard from '../components/shop/ItemCard';
import FilterSidebar from '../components/shop/FilterSidebar';
import { PRODUCTS } from '../api/products';

const Shop = () => {
  const prices = PRODUCTS.map((p) => p.price);
  const minPrice = Math.floor(Math.min(...prices));
  const maxPrice = Math.ceil(Math.max(...prices));

  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(PRODUCTS.map((p) => p.category))).sort(),
    []
  );

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const inPriceRange =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      const inCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);

      return inPriceRange && inCategory;
    });
  }, [priceRange, selectedCategories]);

  const handleToggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([minPrice, maxPrice]);
  };

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
              Showing <span className="text-zinc-100 font-semibold">{filteredProducts.length}</span> of{' '}
              <span className="text-zinc-100 font-semibold">{PRODUCTS.length}</span> products
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
              categories={categories}
              selectedCategories={selectedCategories}
              onToggleCategory={handleToggleCategory}
              minPrice={minPrice}
              maxPrice={maxPrice}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              onClear={handleClearFilters}
              isMobile={false}
            />
          </div>

          <div className="flex-1 w-full">
            {filteredProducts.length === 0 ? (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ItemCard key={product.id} product={product} />
                ))}
              </div>
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
                categories={categories}
                selectedCategories={selectedCategories}
                onToggleCategory={handleToggleCategory}
                minPrice={minPrice}
                maxPrice={maxPrice}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
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