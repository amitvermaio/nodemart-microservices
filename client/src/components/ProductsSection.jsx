import { ArrowRightIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const products = [
  {
    name: 'Developer Setup Kit',
    price: '$149.99',
    badge: 'Popular',
    tag: 'Desk',
  },
  {
    name: 'Node.js Starter Pack',
    price: '$89.99',
    badge: 'New',
    tag: 'Software',
  },
  {
    name: 'Premium Bundle',
    price: '$299.99',
    badge: 'Best Deal',
    tag: 'Bundle',
  },
  {
    name: 'Essentials Collection',
    price: '$59.99',
    badge: 'Limited',
    tag: 'Essentials',
  },
];

const ProductsSection = () => {
  return (
    <section
      id="collections"
      className="border-b border-zinc-800 flex items-center bg-zinc-950"
      style={{ minHeight: 'calc(100vh - 4rem)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="font-code text-xs uppercase tracking-[0.2em] text-cyan-400 mb-3">
              Featured
            </p>
            <h2 className="font-heading text-4xl font-bold text-white mb-2">
              Curated for builders
            </h2>
            <p className="font-body text-zinc-400">
              Pre-configured bundles and tools loved by the community.
            </p>
          </div>
          <button className="hidden sm:inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors group font-body text-sm">
            View all products
            <ArrowRightIcon className="size-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {products.map((product) => (
            <article
              key={product.name}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-cyan-500/50 transition-colors duration-300 flex flex-col overflow-hidden"
            >
              <div className="relative mb-4 w-full aspect-square bg-gradient-to-br from-zinc-900 via-zinc-950 to-black flex items-center justify-center">
                <ShoppingBagIcon className="size-12 text-zinc-600 group-hover:text-cyan-300 transition-colors" />
                <span className="absolute top-3 left-3 text-[10px] font-code uppercase tracking-[0.16em] px-2 py-1 rounded-full bg-zinc-900/80 border border-zinc-700 text-zinc-300">
                  {product.tag}
                </span>
                <span className="absolute top-3 right-3 bg-cyan-400 text-black px-2 py-1 rounded-full text-[10px] font-semibold">
                  {product.badge}
                </span>
              </div>
              <div className="px-4 pb-4 flex-1 flex flex-col gap-3">
                <h3 className="font-body font-semibold text-white group-hover:text-cyan-200 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-heading text-lg font-bold text-white">
                    {product.price}
                  </span>
                  <button className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-cyan-400 hover:text-black transition-colors">
                    <ArrowRightIcon className="size-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
