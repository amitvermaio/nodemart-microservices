import { ArrowRightIcon } from '@heroicons/react/24/outline';

const CheckoutCard = ({ subtotal, itemsCount, onCheckout }) => {
  const shipping = subtotal > 0 ? 9.99 : 0;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  return (
    <aside className="w-full sm:w-80 shrink-0 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 sm:p-5 flex flex-col gap-4 h-max">
      <header>
        <p className="text-xs font-code uppercase tracking-[0.18em] text-cyan-400 mb-1">
          Summary
        </p>
        <h2 className="text-lg font-heading font-semibold text-zinc-100">
          Checkout
        </h2>
        <p className="text-xs text-zinc-500 mt-1">
          {itemsCount > 0
            ? `${itemsCount} item${itemsCount > 1 ? 's' : ''} in cart`
            : 'Your cart is empty right now.'}
        </p>
      </header>

      <div className="space-y-2 text-xs text-zinc-400">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-zinc-100 font-medium">
            ${subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? '—' : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between">
          <span>Estimated tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="h-px bg-zinc-800 my-2" />
        <div className="flex justify-between text-sm font-medium text-zinc-100">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        disabled={itemsCount === 0}
        className={`mt-2 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
          itemsCount === 0
            ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
            : 'bg-zinc-100 text-zinc-950 hover:bg-cyan-400 hover:text-zinc-950'
        }`}
      >
        <span>{itemsCount === 0 ? 'Cart is empty' : 'Proceed to checkout'}</span>
        {itemsCount > 0 && <ArrowRightIcon className="size-4" />}
      </button>

      <p className="text-[11px] text-zinc-500 mt-1">
        No real payments here — this is just a demo experience.
      </p>
    </aside>
  );
};

export default CheckoutCard;
