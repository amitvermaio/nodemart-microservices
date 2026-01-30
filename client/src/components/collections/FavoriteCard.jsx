import { HeartIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const FavoriteCard = ({ item, onAddToCart }) => {
  const {
    name,
    price,
    tag,
    description,
    category,
  } = item;

  return (
    <article className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-cyan-500/50 transition-colors duration-300 flex flex-col overflow-hidden">
      <div className="relative mb-4 w-full aspect-square bg-gradient-to-br from-zinc-900 via-zinc-950 to-black flex items-center justify-center">
        <ShoppingBagIcon className="size-10 text-zinc-600 group-hover:text-cyan-300 transition-colors" />
        {tag && (
          <span className="absolute top-3 left-3 text-[10px] font-code uppercase tracking-[0.16em] px-2 py-1 rounded-full bg-zinc-900/80 border border-zinc-700 text-zinc-300">
            {tag}
          </span>
        )}
        <button
          type="button"
          className="absolute top-3 right-3 inline-flex items-center justify-center rounded-full bg-zinc-900/80 border border-zinc-800 p-1.5 text-zinc-400 group-hover:text-cyan-300"
        >
          <HeartIcon className="size-4" />
        </button>
      </div>
      <div className="px-4 pb-4 flex-1 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 font-code">
              {category}
            </p>
            <h3 className="font-body font-semibold text-white group-hover:text-cyan-200 transition-colors text-sm sm:text-base">
              {name}
            </h3>
          </div>
          <span className="font-heading text-lg font-bold text-white">
            ${price.toFixed(2)}
          </span>
        </div>
        {description && (
          <p className="text-xs text-zinc-400 line-clamp-2">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-1">
          <p className="text-[11px] text-zinc-500">
            Favorited item
          </p>
          <button
            type="button"
            onClick={() => onAddToCart(item)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-950 text-[11px] font-medium hover:bg-cyan-400 hover:text-zinc-950 transition-colors"
          >
            <span>Add to cart</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default FavoriteCard;
