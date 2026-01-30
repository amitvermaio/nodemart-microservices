import { useMemo, useState } from 'react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import OrderCard from '../components/orders/OrderCard';

const MOCK_ORDERS = [
  {
    id: 'NM-24389',
    title: 'Minimalist Standing Desk Setup',
    status: 'processing',
    placedAt: '2 hours ago',
    expectedDelivery: 'Feb 03',
    total: 329.99,
    address: 'Amit Verma, Bengaluru, India',
    tags: ['Desk', 'Accessories', 'Workspace'],
    items: [
      { name: 'Desk system' },
      { name: 'Cable management kit' },
    ],
  },
  {
    id: 'NM-24312',
    title: 'Soft Cotton Oversized Hoodie',
    status: 'shipped',
    placedAt: 'Yesterday',
    expectedDelivery: 'Jan 31',
    total: 79.0,
    address: 'Amit Verma, Bengaluru, India',
    tags: ['Clothing', 'Apparel'],
    items: [{ name: 'Hoodie' }],
  },
  {
    id: 'NM-24290',
    title: 'Creator Audio Bundle',
    status: 'delivered',
    placedAt: 'Jan 24',
    expectedDelivery: 'Jan 27',
    total: 219.0,
    address: 'Amit Verma, Bengaluru, India',
    tags: ['Audio', 'Bundle'],
    items: [{ name: 'Mic' }, { name: 'Arm' }, { name: 'Headphones' }],
  },
  {
    id: 'NM-24210',
    title: 'Weekend Comfort Set',
    status: 'cancelled',
    placedAt: 'Jan 10',
    expectedDelivery: 'Jan 14',
    total: 119.0,
    address: 'Amit Verma, Bengaluru, India',
    tags: ['Clothing'],
    items: [{ name: 'Joggers' }, { name: 'Tee' }],
  },
];

const Orders = () => {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  const handleCancel = (orderToCancel) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderToCancel.id ? { ...order, status: 'cancelled' } : order
      )
    );
  };

  const handleView = (order) => {
    // Placeholder for future modal/details view
    console.log('View order', order.id);
  };

  const statusTabs = [
    { id: 'all', label: 'All' },
    { id: 'processing', label: 'Processing' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <section className="bg-zinc-950 text-zinc-100 min-h-[calc(100vh-4rem)] border-t border-zinc-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="space-y-2">
            <p className="font-code text-[11px] uppercase tracking-[0.2em] text-cyan-400">
              Account
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Your orders
            </h1>
            <p className="font-body text-sm sm:text-base text-zinc-400 max-w-xl">
              Track, manage and revisit everything you&apos;ve ordered from NodeMart in one clean view.
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-2 text-[11px] text-zinc-400">
              <AdjustmentsHorizontalIcon className="size-4 text-zinc-500" />
              <span>
                {orders.filter((o) => o.status !== 'cancelled').length} active • {orders.length} total
              </span>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-4">
          <div className="inline-flex flex-wrap gap-2 rounded-full bg-zinc-950/80 border border-zinc-800 p-1 text-[11px] w-full sm:w-auto">
            {statusTabs.map((tab) => {
              const isActive = tab.id === statusFilter;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-100 text-zinc-950'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="mt-6 border border-dashed border-zinc-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-3 bg-zinc-950/60">
              <p className="text-sm font-semibold text-zinc-200">No orders in this view</p>
              <p className="text-xs text-zinc-500 max-w-sm">
                Switch to another status tab or head back to the shop to place your first order.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onCancel={handleCancel}
                  onView={handleView}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Orders;