const SellerTopProducts = ({ topProducts }) => {
  const list = topProducts ?? [];

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 sm:p-5 flex flex-col gap-4">
      <header>
        <p className="text-[11px] font-code uppercase tracking-[0.18em] text-zinc-500">
          Top products
        </p>
        <p className="text-xs text-zinc-500">
          Based on quantity sold across confirmed orders.
        </p>
      </header>

      {list.length === 0 ? (
        <p className="text-xs text-zinc-500">No sales yet to rank products.</p>
      ) : (
        <ul className="space-y-2 text-xs">
          {list.map((prod, index) => (
            <li
              key={prod.id || index}
              className="flex items-center justify-between gap-3 rounded-xl bg-zinc-950/70 hover:bg-zinc-900/80 border border-zinc-900/80 hover:border-cyan-500/40 px-3 py-2"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[11px] text-zinc-500 w-5">#{index + 1}</span>
                <span className="text-zinc-100 font-medium truncate">
                  {prod.title || 'Untitled product'}
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 whitespace-nowrap">
                {prod.sold} sold
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default SellerTopProducts;
