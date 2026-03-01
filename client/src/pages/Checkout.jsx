import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  ArrowLeftIcon,
  MapPinIcon,
  TruckIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { asynccreateorder } from '../store/actions/orderActions';
import { asyncfetchcart } from '../store/actions/cartActions';
import Loader from '../components/Loader';

const CURRENCY_SYMBOLS = { USD: '$', INR: '₹' };

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems, totals, status: cartStatus } = useSelector((s) => s.cart);
  const { isAuthenticated, addresses } = useSelector((s) => s.auth);
  const { status: orderStatus } = useSelector((s) => s.orders);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    if (cartItems.length === 0 && cartStatus === 'idle') {
      dispatch(asyncfetchcart());
    }
  }, [isAuthenticated, cartItems.length, cartStatus, dispatch, navigate]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const def = addresses.find((a) => a.isDefault);
      setSelectedAddressId(def?._id || def?.id || addresses[0]._id || addresses[0].id);
    }
    if (addresses.length === 0) {
      setUseNewAddress(true);
    }
  }, [addresses, selectedAddressId]);

  const subtotal = totals?.subtotal ?? 0;
  const shipping = subtotal > 0 ? 2.99 : 0;
  const tax = subtotal * 0.007;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async (formData) => {
    let shippingAddress;

    if (useNewAddress) {
      shippingAddress = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
      };
    } else {
      const addr = addresses.find(
        (a) => (a._id || a.id) === selectedAddressId
      );
      if (!addr) return;
      shippingAddress = {
        street: addr.street,
        city: addr.city,
        state: addr.state,
        zip: addr.zip || addr.zipCode,
        country: addr.country,
      };
    }

    try {
      const order = await dispatch(
        asynccreateorder({ shippingAddress, phone: formData.phone || '0000000000' })
      );
      if (order?._id) {
        navigate(`/checkout/payment/${order._id}`);
      }
    } catch {
      // error handled by action
    }
  };

  if (cartStatus === 'loading' && cartItems.length === 0) return <Loader />;

  if (cartItems.length === 0 && cartStatus === 'succeeded') {
    return (
      <section className="bg-zinc-950 text-zinc-100 min-h-[calc(100vh-4rem)] border-t border-zinc-900/80 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <p className="text-lg font-semibold text-zinc-100">Your cart is empty</p>
          <p className="text-sm text-zinc-500">
            Add items to your cart before checking out.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-cyan-500/90 px-5 py-2.5 text-sm font-medium text-zinc-950 hover:bg-cyan-400"
          >
            Browse products
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-zinc-950 text-zinc-100 min-h-[calc(100vh-4rem)] border-t border-zinc-900/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Header */}
        <button
          onClick={() => navigate('/cart')}
          className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-100 mb-4"
        >
          <ArrowLeftIcon className="size-4" /> Back to cart
        </button>

        <header className="space-y-2 mb-8">
          <p className="font-code text-[11px] uppercase tracking-[0.2em] text-cyan-400">
            Checkout
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Complete your order
          </h1>
          <p className="font-body text-sm text-zinc-400">
            Review your items, choose a shipping address, and place your order.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Left — Shipping Address */}
          <div className="space-y-6">
            {/* Order Items Summary */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
              <h2 className="text-sm font-medium text-zinc-100 mb-4 flex items-center gap-2">
                <TruckIcon className="size-4 text-cyan-400" /> Order Items
              </h2>
              <div className="space-y-3">
                {cartItems.map((item) => {
                  const product = item.product || {};
                  const price = product.price?.amount || 0;
                  const currency =
                    CURRENCY_SYMBOLS[product.price?.currency] || '₹';
                  return (
                    <div
                      key={item._id}
                      className="flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.title}
                            className="w-10 h-10 rounded-lg object-cover border border-zinc-800"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800" />
                        )}
                        <div>
                          <p className="text-zinc-100 font-medium">
                            {product.title || 'Product'}
                          </p>
                          <p className="text-zinc-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-zinc-100 font-medium">
                        {currency}
                        {(price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping Address */}
            <form
              onSubmit={handleSubmit(handlePlaceOrder)}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-5"
            >
              <h2 className="text-sm font-medium text-zinc-100 flex items-center gap-2">
                <MapPinIcon className="size-4 text-cyan-400" /> Shipping Address
              </h2>

              {/* Saved Addresses */}
              {addresses.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs text-zinc-400">Saved addresses</p>
                  <div className="grid gap-2">
                    {addresses.map((addr) => {
                      const id = addr._id || addr.id;
                      const isSelected = !useNewAddress && selectedAddressId === id;
                      return (
                        <label
                          key={id}
                          className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-cyan-500/60 bg-cyan-500/5'
                              : 'border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name="addressChoice"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedAddressId(id);
                              setUseNewAddress(false);
                            }}
                            className="mt-0.5 accent-cyan-400"
                          />
                          <div className="text-xs">
                            <p className="text-zinc-100 font-medium">
                              {addr.street}, {addr.city}
                            </p>
                            <p className="text-zinc-500">
                              {addr.state}, {addr.zip || addr.zipCode} — {addr.country}
                            </p>
                            {addr.isDefault && (
                              <span className="inline-block mt-1 text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-2 py-0.5">
                                Default
                              </span>
                            )}
                          </div>
                        </label>
                      );
                    })}

                    <label
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                        useNewAddress
                          ? 'border-cyan-500/60 bg-cyan-500/5'
                          : 'border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="addressChoice"
                        checked={useNewAddress}
                        onChange={() => setUseNewAddress(true)}
                        className="accent-cyan-400"
                      />
                      <span className="text-xs text-zinc-300">
                        Use a new address
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* New Address Form */}
              {useNewAddress && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-zinc-500 mb-1">
                      Street
                    </label>
                    <input
                      {...register('street', { required: useNewAddress })}
                      placeholder="123 Main St"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/60"
                    />
                    {errors.street && (
                      <p className="text-[10px] text-red-400 mt-1">
                        Street is required
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-500 mb-1">
                      City
                    </label>
                    <input
                      {...register('city', { required: useNewAddress })}
                      placeholder="Bengaluru"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/60"
                    />
                    {errors.city && (
                      <p className="text-[10px] text-red-400 mt-1">
                        City is required
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-500 mb-1">
                      State
                    </label>
                    <input
                      {...register('state', { required: useNewAddress })}
                      placeholder="Karnataka"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/60"
                    />
                    {errors.state && (
                      <p className="text-[10px] text-red-400 mt-1">
                        State is required
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-500 mb-1">
                      ZIP Code
                    </label>
                    <input
                      {...register('zip', { required: useNewAddress })}
                      placeholder="560001"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/60"
                    />
                    {errors.zip && (
                      <p className="text-[10px] text-red-400 mt-1">
                        ZIP is required
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-500 mb-1">
                      Country
                    </label>
                    <input
                      {...register('country', { required: useNewAddress })}
                      placeholder="India"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/60"
                    />
                    {errors.country && (
                      <p className="text-[10px] text-red-400 mt-1">
                        Country is required
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Phone */}
              <div>
                <label className="block text-[11px] text-zinc-500 mb-1">
                  Phone Number
                </label>
                <input
                  {...register('phone', {
                    required: 'Phone is required',
                    pattern: {
                      value: /^\d{10}$/,
                      message: 'Must be 10 digits',
                    },
                  })}
                  placeholder="9876543210"
                  className="w-full sm:w-64 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/60"
                />
                {errors.phone && (
                  <p className="text-[10px] text-red-400 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={orderStatus === 'loading'}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors ${
                  orderStatus === 'loading'
                    ? 'bg-zinc-800 text-zinc-500 cursor-wait'
                    : 'bg-zinc-100 text-zinc-950 hover:bg-cyan-400 hover:text-zinc-950'
                }`}
              >
                {orderStatus === 'loading' ? 'Placing order…' : 'Place Order & Pay'}
              </button>
            </form>
          </div>

          {/* Right — Order Summary */}
          <aside className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 space-y-4 h-max lg:sticky lg:top-24">
            <header>
              <p className="text-xs font-code uppercase tracking-[0.18em] text-cyan-400 mb-1">
                Summary
              </p>
              <h2 className="text-lg font-heading font-semibold text-zinc-100">
                Order Total
              </h2>
            </header>

            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal ({totals?.totalQuantity || 0} items)</span>
                <span className="text-zinc-100 font-medium">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? '—' : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="h-px bg-zinc-800 my-2" />
              <div className="flex justify-between text-sm font-medium text-zinc-100">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-zinc-500 pt-2 border-t border-zinc-800">
              <ShieldCheckIcon className="size-4 text-emerald-400" />
              <span>Secure checkout — your data is encrypted</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
