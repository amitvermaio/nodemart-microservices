import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  CheckCircleIcon,
  ShoppingBagIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { asyncfetchorderbyid } from '../store/actions/orderActions';
import { setcart } from '../store/reducers/cartSlice';
import Loader from '../components/Loader';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current: order, status } = useSelector((s) => s.orders);

  useEffect(() => {
    if (orderId) {
      dispatch(asyncfetchorderbyid(orderId));
    }
    // Clear local cart state after successful payment
    dispatch(
      setcart({
        items: [],
        totals: { itemCount: 0, totalQuantity: 0, subtotal: 0 },
      })
    );
  }, [dispatch, orderId]);

  if (status === 'loading') return <Loader />;

  const sym = order?.totalPrice?.currency === 'INR' ? '₹' : '$';

  return (
    <section className="bg-zinc-950 text-zinc-100 min-h-[calc(100vh-4rem)] border-t border-zinc-900/80 flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 py-10 text-center space-y-6">
        {/* Success icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <CheckCircleIcon className="size-10 text-emerald-400" />
        </div>

        <div className="space-y-2">
          <p className="font-code text-[11px] uppercase tracking-[0.2em] text-emerald-400">
            Payment Successful
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Thank you for your order!
          </h1>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Your order has been confirmed and is being processed. You&apos;ll
            receive updates as it moves through the shipping pipeline.
          </p>
        </div>

        {/* Order Details Card */}
        {order && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 text-left space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-code uppercase tracking-[0.16em] text-zinc-500">
                Order ID
              </p>
              <p className="text-xs font-mono text-zinc-100">
                {order._id?.slice(-8).toUpperCase()}
              </p>
            </div>

            <div className="h-px bg-zinc-800" />

            <div className="space-y-2">
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-zinc-400">
                    Item × {item.quantity}
                  </span>
                  <span className="text-zinc-100 font-medium">
                    {sym}
                    {item.price?.amount?.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-px bg-zinc-800" />

            <div className="flex justify-between text-sm font-medium text-zinc-100">
              <span>Total Paid</span>
              <span>
                {sym}
                {order.totalPrice?.amount?.toFixed(2)}
              </span>
            </div>

            {order.shippingAddress && (
              <>
                <div className="h-px bg-zinc-800" />
                <div className="flex items-start gap-2 text-xs">
                  <TruckIcon className="size-4 text-cyan-400 mt-0.5 shrink-0" />
                  <div className="text-zinc-400">
                    <p className="text-zinc-100 font-medium mb-0.5">
                      Shipping to
                    </p>
                    <p>
                      {order.shippingAddress.street},{' '}
                      {order.shippingAddress.city},{' '}
                      {order.shippingAddress.state}{' '}
                      {order.shippingAddress.zip} —{' '}
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span
                className={`inline-block size-2 rounded-full ${
                  order.status === 'PENDING'
                    ? 'bg-amber-400'
                    : order.status === 'CONFIRMED'
                    ? 'bg-cyan-400'
                    : 'bg-emerald-400'
                }`}
              />
              <span>Status: {order.status}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/orders')}
            className="inline-flex items-center gap-2 rounded-full bg-zinc-100 text-zinc-950 px-5 py-2.5 text-sm font-medium hover:bg-cyan-400 transition-colors"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-700 text-zinc-200 px-5 py-2.5 text-sm font-medium hover:border-cyan-500 hover:text-cyan-200 transition-colors"
          >
            <ShoppingBagIcon className="size-4" />
            Continue Shopping
          </button>
        </div>
      </div>
    </section>
  );
};

export default OrderSuccess;
