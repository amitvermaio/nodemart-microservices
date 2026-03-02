import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncfetchsellerdashboard } from '../store/actions/sellerActions';
import SellerMetrics from '../components/seller/SellerMetrics';
import SellerOrdersTable from '../components/seller/SellerOrdersTable';
import SellerTopProducts from '../components/seller/SellerTopProducts';
import SellerProductsTable from '../components/seller/SellerProductsTable';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { metrics, orders, products, inventory, lowStock, status, error } = useSelector((state) => state.seller);
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  const loading = status === 'loading';

  useEffect(() => {
    if (isAuthenticated && role === 'seller' && status === 'idle') {
      dispatch(asyncfetchsellerdashboard());
    }
  }, [dispatch, isAuthenticated, role, status]);

  return (
    <section className="bg-zinc-950 text-zinc-100 min-h-[calc(100vh-4rem)] border-t border-zinc-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="space-y-2">
            <p className="font-code text-[11px] uppercase tracking-[0.2em] text-cyan-400">
              Seller
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Seller dashboard
            </h1>
            <p className="font-body text-sm sm:text-base text-zinc-400 max-w-xl">
              A focused view of your sales, orders and products — built for fast checks between shipping and coding.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/dashboard/add-product')}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-100 text-zinc-950 px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-cyan-400 hover:text-zinc-950 transition-colors"
          >
            <span className="text-base leading-none">+</span>
            <span>Add product</span>
          </button>
        </header>

        {loading && (
          <div className="space-y-4">
            <div className="h-24 rounded-2xl bg-zinc-900/70 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-64 rounded-2xl bg-zinc-900/70 animate-pulse" />
              <div className="h-64 rounded-2xl bg-zinc-900/70 animate-pulse" />
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-xs text-red-200 mb-6">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <SellerMetrics metrics={metrics} inventory={inventory} lowStock={lowStock} />

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 sm:gap-6 mb-6 sm:mb-8">
              <SellerOrdersTable orders={orders} />
              <SellerTopProducts topProducts={metrics?.topProducts} />
            </div>

            <SellerProductsTable products={products} lowStock={lowStock} />
          </>
        )}
      </div>
    </section>
  );
};

export default Dashboard;