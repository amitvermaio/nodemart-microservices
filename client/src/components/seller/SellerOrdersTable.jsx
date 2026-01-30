const STATUS_STYLES = {
  PENDING: 'bg-zinc-900 border-zinc-700 text-zinc-300',
  CONFIRMED: 'bg-amber-500/10 border-amber-400/40 text-amber-200',
  SHIPPED: 'bg-cyan-500/10 border-cyan-400/40 text-cyan-200',
  DELIVERED: 'bg-emerald-500/10 border-emerald-400/40 text-emerald-200',
  CANCELLED: 'bg-red-500/10 border-red-400/40 text-red-200',
};

const SellerOrdersTable = ({ orders }) => {
  const limited = orders?.slice(0, 5) ?? [];

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 sm:p-5 flex flex-col gap-4">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-code uppercase tracking-[0.18em] text-zinc-500">
            Recent orders
          </p>
          <p className="text-xs text-zinc-500">
            Latest activity across all of your products.
          </p>
        </div>
        <p className="text-[11px] text-zinc-500">
          {orders?.length ?? 0} total
        </p>
      </header>

      {limited.length === 0 ? (
        <p className="text-xs text-zinc-500">No orders yet.</p>
      ) : (
        <div className="space-y-2 text-xs font-body">
          <div className="hidden sm:grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 pb-1 border-b border-zinc-800 text-zinc-500">
            <span>Customer</span>
            <span className="text-right">Items</span>
            <span className="text-right">Total</span>
            <span className="text-right">Status</span>
          </div>
          {limited.map((order) => {
            const itemsCount = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) ?? 0;
            const totalAmount = order.totalPrice?.amount ?? 0;
            const status = order.status || 'PENDING';
            const pillClass = STATUS_STYLES[status] || STATUS_STYLES.PENDING;
            const created = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                })
              : '';

            return (
              <article
                key={order._id}
                className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 items-center rounded-xl bg-zinc-950/70 hover:bg-zinc-900/80 border border-zinc-900/80 hover:border-cyan-500/40 px-3 py-2.5"
              >
                <div className="flex flex-col">
                  <span className="text-zinc-100 font-medium truncate">
                    {order.user?.name || 'Unnamed customer'}
                  </span>
                  <span className="text-[11px] text-zinc-500 truncate">
                    {order.user?.email || 'No email'}
                  </span>
                  {created && (
                    <span className="text-[11px] text-zinc-500">{created}</span>
                  )}
                </div>
                <span className="text-right text-zinc-100">{itemsCount}</span>
                <span className="text-right text-zinc-100">
                  ₹{totalAmount.toFixed(0)}
                </span>
                <span className="flex justify-end">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-medium ${pillClass}`}
                  >
                    {status}
                  </span>
                </span>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default SellerOrdersTable;
