import { TruckIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const statusConfig = {
  processing: {
    label: 'Processing',
    icon: ClockIcon,
    color: 'text-amber-300',
    pill: 'bg-amber-500/10 border-amber-400/40 text-amber-200',
  },
  shipped: {
    label: 'Shipped',
    icon: TruckIcon,
    color: 'text-cyan-300',
    pill: 'bg-cyan-500/10 border-cyan-400/40 text-cyan-200',
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircleIcon,
    color: 'text-emerald-300',
    pill: 'bg-emerald-500/10 border-emerald-400/40 text-emerald-200',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircleIcon,
    color: 'text-red-300',
    pill: 'bg-red-500/10 border-red-400/40 text-red-200',
  },
};

const OrderCard = ({ order, onCancel }) => {
  const config = statusConfig[order.status] ?? statusConfig.processing;
  const StatusIcon = config.icon;

  const isCancellable = ['processing', 'shipped'].includes(order.status);

  return (
    <article className="group rounded-2xl border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-950 hover:border-cyan-500/50 transition-colors duration-300 flex flex-col gap-4 p-4 sm:p-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <StatusIcon className={`size-5 ${config.color}`} />
          </div>
          <div>
            <p className="text-xs font-code uppercase tracking-[0.18em] text-zinc-500">
              Order #{order.id}
            </p>
            <p className="text-sm font-medium text-zinc-100">
              {order.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${config.pill}`}>
            <span className="inline-block size-1.5 rounded-full bg-current" />
            {config.label}
          </span>
          <span className="text-xs text-zinc-500 font-mono">
            Placed {order.placedAt}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-body">
        <div className="space-y-1">
          <p className="text-zinc-500">Items</p>
          <p className="text-zinc-100 font-medium">{order.items.length}</p>
        </div>
        <div className="space-y-1">
          <p className="text-zinc-500">Total</p>
          <p className="text-zinc-100 font-medium">${order.total.toFixed(2)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-zinc-500">Expected</p>
          <p className="text-zinc-100 font-medium">{order.expectedDelivery}</p>
        </div>
        <div className="space-y-1">
          <p className="text-zinc-500">Destination</p>
          <p className="text-zinc-100 font-medium truncate" title={order.address}>
            {order.address}
          </p>
        </div>
      </div>

      <footer className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-zinc-800 mt-1">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
          {order.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={() => isCancellable && onCancel(order)}
            disabled={!isCancellable}
            className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-colors ${
              isCancellable
                ? 'border-red-500/60 text-red-300 hover:bg-red-950/50'
                : 'border-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {order.status === 'cancelled' ? 'Cancelled' : 'Cancel order'}
          </button>
        </div>
      </footer>
    </article>
  );
};

export default OrderCard;
