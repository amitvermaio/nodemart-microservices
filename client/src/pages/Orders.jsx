import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import OrderCard from '../components/orders/OrderCard';
import Loader from '../components/Loader';
import { asyncfetchmyorders, asynccancelorder } from '../store/actions/orderActions';

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: orders, status } = useSelector((s) => s.orders);
  const { isAuthenticated } = useSelector((s) => s.auth);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    dispatch(asyncfetchmyorders());
  }, [dispatch, isAuthenticated, navigate]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter(
      (order) => order.status?.toUpperCase() === statusFilter.toUpperCase()
    );
  }, [orders, statusFilter]);

  const handleCancel = (order) => {
    dispatch(asynccancelorder(order._id)).then(() => {
      dispatch(asyncfetchmyorders());
    });
  };

  const handleView = (order) => {
    navigate(`/checkout/payment/${order._id}`);
  };

  const statusTabs = [
    { id: 'all', label: 'All' },
    { id: 'PENDING', label: 'Pending' },
    { id: 'CONFIRMED', label: 'Confirmed' },
    { id: 'SHIPPED', label: 'Shipped' },
    { id: 'DELIVERED', label: 'Delivered' },
    { id: 'CANCELLED', label: 'Cancelled' },
  ];

  if (status === 'loading' && orders.length === 0) return <Loader />;

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
                {orders.filter((o) => o.status !== 'CANCELLED').length} active • {orders.length} total
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
                  key={order._id}
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