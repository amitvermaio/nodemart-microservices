const SellerProductsTable = ({ products }) => {
  const list = products?.slice(0, 5) ?? [];

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 sm:p-5 flex flex-col gap-4">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-code uppercase tracking-[0.18em] text-zinc-500">
            Your products
          </p>
          <p className="text-xs text-zinc-500">
            Snapshot of your latest listings.
          </p>
        </div>
        <p className="text-[11px] text-zinc-500">
          {products?.length ?? 0} total
        </p>
      </header>

      {list.length === 0 ? (
        <p className="text-xs text-zinc-500">No products listed yet.</p>
      ) : (
        <div className="space-y-2 text-xs font-body">
          <div className="hidden sm:grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 pb-1 border-b border-zinc-800 text-zinc-500">
            <span>Product</span>
            <span className="text-right">Price</span>
            <span className="text-right">Stock</span>
          </div>

          {list.map((product) => {
            const price = product.price?.amount ?? 0;
            const currency = product.price?.currency || 'INR';

            return (
              <article
                key={product._id}
                className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 items-center rounded-xl bg-zinc-950/70 hover:bg-zinc-900/80 border border-zinc-900/80 hover:border-cyan-500/40 px-3 py-2.5"
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-zinc-100 font-medium truncate">
                    {product.title || 'Untitled product'}
                  </span>
                  {product.description && (
                    <span className="text-[11px] text-zinc-500 truncate">
                      {product.description}
                    </span>
                  )}
                </div>
                <span className="text-right text-zinc-100">
                  {currency === 'INR' ? '₹' : '$'}
                  {price.toFixed(0)}
                </span>
                <span className="text-right text-zinc-100">
                  {product.stock ?? 0}
                </span>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default SellerProductsTable;
