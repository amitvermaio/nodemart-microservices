import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

const FilterSidebar = ({
  categories,
  selectedCategories,
  onToggleCategory,
  minPrice,
  maxPrice,
  priceRange,
  onPriceChange,
  onClear,
  isMobile,
  onClose,
}) => {
  return (
    <aside
      className="w-full sm:w-64 shrink-0 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex flex-col gap-5"
    >
      <header className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <FunnelIcon className="size-4 text-cyan-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Filters</p>
            <p className="text-[11px] text-zinc-500">Refine products</p>
          </div>
        </div>
        {isMobile && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          >
            <XMarkIcon className="size-4" />
          </button>
        )}
      </header>

      <div className="space-y-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400">Price range</span>
          <span className="font-medium text-zinc-200">
            {`$${priceRange[0]} - $${priceRange[1]}`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={priceRange[0]}
            onChange={(e) =>
              onPriceChange([Number(e.target.value), Math.max(priceRange[1], Number(e.target.value))])
            }
            className="w-full accent-cyan-500"
          />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={priceRange[1]}
            onChange={(e) =>
              onPriceChange([Math.min(priceRange[0], Number(e.target.value)), Number(e.target.value)])
            }
            className="w-full accent-cyan-500 hidden sm:block"
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-zinc-500">
          <span>Min: {`$${minPrice}`}</span>
          <span>Max: {`$${maxPrice}`}</span>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-[0.16em]">
          Categories
        </p>
        <div className="flex flex-wrap sm:flex-col gap-2">
          {categories.map((category) => {
            const active = selectedCategories.includes(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => onToggleCategory(category)}
                className={`flex items-center justify-between w-full sm:w-auto sm:justify-start gap-2 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  active
                    ? 'bg-cyan-500/10 border-cyan-500/70 text-cyan-200'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                }`}
              >
                <span>{category}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="mt-auto text-xs text-zinc-400 hover:text-zinc-200 underline underline-offset-4 decoration-dotted self-start"
      >
        Clear all filters
      </button>
    </aside>
  );
};

export default FilterSidebar;
