import FavoriteCard from '../components/collections/FavoriteCard';
import { toast } from 'sonner';

const DUMMY_FAVORITES = [
  {
    id: 101,
    name: 'Minimalist Standing Desk Setup',
    category: 'Accessories',
    tag: 'Desk',
    price: 299.99,
    description: 'Electric desk, cable kit and mat configured for deep-focus work.',
    stock: 5,
  },
  {
    id: 102,
    name: 'Soft Cotton Oversized Hoodie',
    category: 'Clothing',
    tag: 'Clothing',
    price: 79.0,
    description: 'Premium heavyweight hoodie, ideal for long coding sessions.',
    stock: 10,
  },
  {
    id: 103,
    name: 'Creator Audio Bundle',
    category: 'Accessories',
    tag: 'Audio',
    price: 219.0,
    description: 'Studio mic, arm and headphones tuned for creators and calls.',
    stock: 4,
  },
];

const Collections = () => {
  const addItemToCart = (item) => {
    try {
      const raw = window.localStorage.getItem('cartItems');
      const existing = raw ? JSON.parse(raw) : [];

      const updated = [...existing];
      const index = updated.findIndex((row) => row.id === item.id);

      if (index >= 0) {
        const current = updated[index];
        const nextQty = Math.min((current.quantity || 1) + 1, item.stock ?? 99);
        updated[index] = { ...current, quantity: nextQty };
      } else {
        updated.push({
          id: item.id,
          name: item.name,
          category: item.category,
          variant: item.tag,
          price: item.price,
          stock: item.stock ?? 99,
          quantity: 1,
        });
      }

      window.localStorage.setItem('cartItems', JSON.stringify(updated));

      toast.success('Added to cart', {
        description: `${item.name} is now in your cart.`,
      });
    } catch (err) {
      console.error('Failed to update cart from collections', err);
      toast.error('Could not add to cart');
    }
  };

  return (
    <section className="bg-zinc-950 text-zinc-100 min-h-[calc(100vh-4rem)] border-t border-zinc-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="space-y-2">
            <p className="font-code text-[11px] uppercase tracking-[0.2em] text-cyan-400">
              Collections
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Your favorites
            </h1>
            <p className="font-body text-sm sm:text-base text-zinc-400 max-w-xl">
              A curated list of products you&apos;ve starred. Add them to your cart whenever you&apos;re ready.
            </p>
          </div>
          <p className="text-xs text-zinc-500 font-body">
            Saved items: <span className="text-zinc-100 font-semibold">{DUMMY_FAVORITES.length}</span>
          </p>
        </header>

        {DUMMY_FAVORITES.length === 0 ? (
          <div className="mt-6 border border-dashed border-zinc-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-3 bg-zinc-950/60">
            <p className="text-sm font-semibold text-zinc-200">No favorites yet</p>
            <p className="text-xs text-zinc-500 max-w-sm">
              Browse the shop and tap the heart on products you love — they&apos;ll show up here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {DUMMY_FAVORITES.map((item) => (
              <FavoriteCard key={item.id} item={item} onAddToCart={addItemToCart} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Collections;