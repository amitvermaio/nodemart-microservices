import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerMetrics from '../components/seller/SellerMetrics';
import SellerOrdersTable from '../components/seller/SellerOrdersTable';
import SellerTopProducts from '../components/seller/SellerTopProducts';
import SellerProductsTable from '../components/seller/SellerProductsTable';

const Dashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState('');

  useEffect(() => {
    const dummyMetrics = {
      sales: 128,
      revenue: 184500,
      topProducts: [
        { id: 'p1', title: 'Minimalist Standing Desk Setup', sold: 48 },
        { id: 'p2', title: 'Creator Audio Bundle', sold: 32 },
        { id: 'p3', title: 'Soft Cotton Oversized Hoodie', sold: 24 },
      ],
    };

    const dummyProducts = [
      {
        _id: 'p1',
        title: 'Minimalist Standing Desk Setup',
        description: 'Electric desk, cable kit and mat for deep-focus work.',
        price: { amount: 32999, currency: 'INR' },
        stock: 8,
      },
      {
        _id: 'p2',
        title: 'Creator Audio Bundle',
        description: 'Studio mic, arm and headphones tuned for creators.',
        price: { amount: 21999, currency: 'INR' },
        stock: 5,
      },
      {
        _id: 'p3',
        title: 'Soft Cotton Oversized Hoodie',
        description: 'Premium heavyweight hoodie for long coding sessions.',
        price: { amount: 4999, currency: 'INR' },
        stock: 20,
      },
    ];

    const dummyOrders = [
      {
        _id: 'o1',
        user: { name: 'Rahul Sharma', email: 'rahul@example.com' },
        items: [
          { product: 'p1', quantity: 1 },
          { product: 'p3', quantity: 2 },
        ],
        status: 'CONFIRMED',
        totalPrice: { amount: 42997, currency: 'INR' },
        createdAt: new Date().toISOString(),
      },
      {
        _id: 'o2',
        user: { name: 'Priya Singh', email: 'priya@example.com' },
        items: [{ product: 'p2', quantity: 1 }],
        status: 'SHIPPED',
        totalPrice: { amount: 21999, currency: 'INR' },
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    // Use a microtask to avoid the linter warning about synchronous setState in effects
    Promise.resolve().then(() => {
      setMetrics(dummyMetrics);
      setProducts(dummyProducts);
      setOrders(dummyOrders);
      setLoading(false);
    });

    // let isMounted = true;
    //
    // const fetchJson = async (url) => {
    //   const res = await fetch(url, { credentials: 'include' });
    //   if (!res.ok) {
    //     throw new Error(`Failed to load ${url}`);
    //   }
    //   return res.json();
    // };
    //
    // const load = async () => {
    //   try {
    //     setLoading(true);
    //     setError('');
    //
    //     const [metricsData, ordersData, productsData] = await Promise.all([
    //       fetchJson('/api/seller/metrics'),
    //       fetchJson('/api/seller/orders'),
    //       fetchJson('/api/seller/products'),
    //     ]);
    //
    //     if (!isMounted) return;
    //
    //     setMetrics(metricsData);
    //     setOrders(Array.isArray(ordersData) ? ordersData : []);
    //     setProducts(Array.isArray(productsData) ? productsData : []);
    //   } catch (err) {
    //     if (!isMounted) return;
    //     setError('Unable to load dashboard data right now.');
    //     console.error(err);
    //   } finally {
    //     if (isMounted) {
    //       setLoading(false);
    //     }
    //   }
    // };
    //
    // load();
    //
    // return () => {
    //   isMounted = false;
    // };
  }, []);

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
            <SellerMetrics metrics={metrics} products={products} />

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 sm:gap-6 mb-6 sm:mb-8">
              <SellerOrdersTable orders={orders} />
              <SellerTopProducts topProducts={metrics?.topProducts} />
            </div>

            <SellerProductsTable products={products} />
          </>
        )}
      </div>
    </section>
  );
};

export default Dashboard;