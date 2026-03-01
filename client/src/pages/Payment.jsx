import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { ArrowLeftIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { asynccreatepayment, asyncverifypayment } from '../store/actions/paymentActions';
import { asyncfetchorderbyid } from '../store/actions/orderActions';
import Loader from '../components/Loader';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

/*  Inner form must be inside <Elements>*/
const PaymentForm = ({ orderId, amount, currency }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } =
        await stripe.confirmPayment({
          elements,
          redirect: 'if_required',
        });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        await dispatch(
          asyncverifypayment({ paymentIntentId: paymentIntent.id })
        );
        navigate(`/order-success/${orderId}`);
      } else {
        setError('Payment was not completed. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }

    setProcessing(false);
  };

  const sym = currency === 'INR' ? '₹' : '$';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-xs text-red-300">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors ${
          processing
            ? 'bg-zinc-800 text-zinc-500 cursor-wait'
            : 'bg-zinc-100 text-zinc-950 hover:bg-cyan-400 hover:text-zinc-950'
        }`}
      >
        {processing ? 'Processing payment…' : `Pay ${sym}${amount.toFixed(2)}`}
      </button>

      <div className="flex items-center gap-2 text-[11px] text-zinc-500 justify-center">
        <ShieldCheckIcon className="size-4 text-emerald-400" />
        <span>Payments securely processed by Stripe</span>
      </div>
    </form>
  );
};

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current: order, status: orderStatus } = useSelector((s) => s.orders);
  const { lastPayment, status: paymentStatus } = useSelector((s) => s.payments);
  const { isAuthenticated } = useSelector((s) => s.auth);
  const [clientSecret, setClientSecret] = useState(null);
  const creatingRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (orderId) {
      dispatch(asyncfetchorderbyid(orderId));
    }
  }, [dispatch, orderId]);

  useEffect(() => {
    if (order && order._id === orderId && !clientSecret && !creatingRef.current) {
      creatingRef.current = true;
      dispatch(asynccreatepayment(orderId))
        .then((data) => {
          if (data?.clientSecret) {
            setClientSecret(data.clientSecret);
          }
        })
        .catch(() => {})
        .finally(() => {
          creatingRef.current = false;
        });
    }
  }, [order, orderId, clientSecret, dispatch]);

  if (!isAuthenticated) return null;

  if (orderStatus === 'loading' || paymentStatus === 'loading' && !clientSecret) {
    return <Loader />;
  }

  if (!order) {
    return (
      <section className="bg-zinc-950 text-zinc-100 min-h-[calc(100vh-4rem)] border-t border-zinc-900/80 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-sm font-semibold text-zinc-200">Order not found</p>
          <button
            onClick={() => navigate('/orders')}
            className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
          >
            Go to orders
          </button>
        </div>
      </section>
    );
  }

  const amount = order.totalPrice?.amount ?? 0;
  const currency = order.totalPrice?.currency ?? 'INR';

  return (
    <section className="bg-zinc-950 text-zinc-100 min-h-[calc(100vh-4rem)] border-t border-zinc-900/80">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-100 mb-4"
        >
          <ArrowLeftIcon className="size-4" /> Back
        </button>

        <header className="space-y-2 mb-8">
          <p className="font-code text-[11px] uppercase tracking-[0.2em] text-cyan-400">
            Payment
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Complete Payment
          </h1>
          <p className="font-body text-sm text-zinc-400">
            Order #{orderId?.slice(-8).toUpperCase()} &mdash;{' '}
            {currency === 'INR' ? '₹' : '$'}
            {amount.toFixed(2)}
          </p>
        </header>

        {/* Order items quick view */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 mb-6">
          <h2 className="text-xs font-code uppercase tracking-[0.16em] text-zinc-500 mb-3">
            Order Summary
          </h2>
          <div className="space-y-2 text-xs">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-zinc-300">
                <span>
                  Item × {item.quantity}
                </span>
                <span className="text-zinc-100 font-medium">
                  {currency === 'INR' ? '₹' : '$'}
                  {item.price?.amount?.toFixed(2)}
                </span>
              </div>
            ))}
            <div className="h-px bg-zinc-800 my-2" />
            <div className="flex justify-between text-sm font-medium text-zinc-100">
              <span>Total</span>
              <span>
                {currency === 'INR' ? '₹' : '$'}
                {amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Stripe Payment Form */}
        {clientSecret ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'night',
                variables: {
                  colorPrimary: '#22d3ee',
                  colorBackground: '#18181b',
                  colorText: '#f4f4f5',
                  colorDanger: '#f87171',
                  borderRadius: '12px',
                  fontFamily: 'system-ui, sans-serif',
                },
              },
            }}
          >
            <PaymentForm
              orderId={orderId}
              amount={amount}
              currency={currency}
            />
          </Elements>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/60 p-10 text-center">
            <p className="text-sm text-zinc-400 animate-pulse">
              Initializing payment…
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Payment;
