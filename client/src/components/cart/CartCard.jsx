import { MinusSmallIcon, PlusSmallIcon, TrashIcon } from '@heroicons/react/24/outline';

const CartCard = ({ item, onIncrease, onDecrease, onRemove }) => {
  const canDecrease = item.quantity > 1;

  return (
    <article className="group rounded-2xl border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-950 hover:border-cyan-500/50 transition-colors duration-300 flex gap-4 p-4 sm:p-5">
      <div className="hidden sm:block w-24 h-24 rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800" />

      <div className="flex-1 flex flex-col gap-3">
        <header className="flex justify-between gap-3">
          <div>
            <p className="text-xs font-code uppercase tracking-[0.16em] text-zinc-500">
              {item.category}
            </p>
            <h3 className="text-sm sm:text-base font-medium text-zinc-100">
              {item.name}
            </h3>
            {item.variant && (
              <p className="text-xs text-zinc-500 mt-1">{item.variant}</p>
            )}
          </div>
          <div className="text-right space-y-1">
            <p className="text-sm font-heading font-semibold text-zinc-100">
              ${item.price.toFixed(2)}
            </p>
            <p className="text-[11px] text-zinc-500">In stock: {item.stock}</p>
          </div>
        </header>

        <footer className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900 px-1 py-1 w-max">
            <button
              type="button"
              onClick={() => canDecrease && onDecrease(item)}
              disabled={!canDecrease}
              className={`inline-flex items-center justify-center size-7 rounded-full text-zinc-300 transition-colors ${
                canDecrease
                  ? 'hover:bg-zinc-800'
                  : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <MinusSmallIcon className="size-4" />
            </button>
            <span className="px-3 text-xs font-medium text-zinc-100 min-w-[2.5rem] text-center">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onIncrease(item)}
              className="inline-flex items-center justify-center size-7 rounded-full text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              <PlusSmallIcon className="size-4" />
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
            <p className="text-zinc-500">
              Line total:{' '}
              <span className="font-medium text-zinc-100">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </p>
            <button
              type="button"
              onClick={() => onRemove(item)}
              className="inline-flex items-center gap-1 text-red-300 hover:text-red-200 text-[11px] font-medium"
            >
              <TrashIcon className="size-3.5" />
              Remove
            </button>
          </div>
        </footer>
      </div>
    </article>
  );
};

export default CartCard;
