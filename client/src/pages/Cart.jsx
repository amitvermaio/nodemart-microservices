import { useMemo, useState } from 'react';
import CartCard from '../components/cart/CartCard';
import CheckoutCard from '../components/cart/CheckoutCard';
import { toast } from 'sonner';

const INITIAL_CART = [
  {
    id: 1,
    name: 'Minimalist Standing Desk Setup',
    category: 'Accessories',
    variant: 'Walnut • 120cm',
    price: 299.99,
    stock: 5,
    quantity: 1,
  },
  {
    id: 2,
    name: 'Soft Cotton Oversized Hoodie',
    category: 'Clothing',
    variant: 'Black • L',
    price: 79.0,
    stock: 8,
    quantity: 2,
  },
  {
    id: 3,
    name: 'Focus Accessories Pack',
    category: 'Accessories',
    variant: 'Matte black',
    price: 59.0,
    stock: 12,
    quantity: 1,
  },
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = window.localStorage.getItem('cartItems');
      if (raw) {
        return JSON.parse(raw);
      }
      window.localStorage.setItem('cartItems', JSON.stringify(INITIAL_CART));
      return INITIAL_CART;
    } catch {
      return INITIAL_CART;
    }
  });

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const itemsCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const handleIncrease = (target) => {
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.id === target.id && item.quantity < item.stock
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      window.localStorage.setItem('cartItems', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDecrease = (target) => {
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.id === target.id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      window.localStorage.setItem('cartItems', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemove = (target) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== target.id);
      window.localStorage.setItem('cartItems', JSON.stringify(updated));
      return updated;
    });
  };

  const handleCheckout = () => {
    toast.success('Checkout successful!', {
      description: `You have purchased ${itemsCount} items for $${subtotal.toFixed(2)}.`
    });
    console.log('Checkout with items:', cartItems);
  };

  return (
    <section className="bg-zinc-950 text-zinc-100 min-h-[calc(100vh-4rem)] border-t border-zinc-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="space-y-2">
            <p className="font-code text-[11px] uppercase tracking-[0.2em] text-cyan-400">
              Cart
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Your cart
            </h1>
            <p className="font-body text-sm sm:text-base text-zinc-400 max-w-xl">
              Review your picks, tweak quantities and get ready to check out.
            </p>
          </div>
          <div className="text-xs text-zinc-500 font-body">
            Items: <span className="text-zinc-100 font-semibold">{itemsCount}</span>
          </div>
        </header>

        {cartItems.length === 0 ? (
          <div className="mt-6 border border-dashed border-zinc-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-3 bg-zinc-950/60">
            <p className="text-sm font-semibold text-zinc-200">Your cart is empty</p>
            <p className="text-xs text-zinc-500 max-w-sm">
              Head back to the shop to add products you love. They&apos;ll appear here whenever you&apos;re ready to check out.
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1 w-full space-y-4">
              {cartItems.map((item) => (
                <CartCard
                  key={item.id}
                  item={item}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            <CheckoutCard
              subtotal={subtotal}
              itemsCount={itemsCount}
              onCheckout={handleCheckout}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;