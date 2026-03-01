import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartCard from '../components/cart/CartCard';
import CheckoutCard from '../components/cart/CheckoutCard';
import Loader from '../components/Loader';
import {
  asyncfetchcart,
  asyncupdatecartitem,
  asyncdeletecartitem,
} from '../store/actions/cartActions';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems, totals, status } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(asyncfetchcart());
  }, [dispatch]);

  const subtotal = totals?.subtotal ?? 0;

  const itemsCount = totals?.totalQuantity ?? 0;

  const handleIncrease = (item) => {
    const maxQty = Math.min(item.product?.stock || 5, 5);
    if (item.quantity >= maxQty) return;
    dispatch(
      asyncupdatecartitem({
        productId: item.productId,
        quantity: item.quantity + 1,
      })
    );
  };

  const handleDecrease = (item) => {
    if (item.quantity <= 1) return;
    dispatch(
      asyncupdatecartitem({
        productId: item.productId,
        quantity: item.quantity - 1,
      })
    );
  };

  const handleRemove = (item) => {
    dispatch(asyncdeletecartitem(item.productId));
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (status === 'loading' && cartItems.length === 0) {
    return <Loader />;
  }

  return (
    <section className="bg-zinc-950 text-zinc-100 min-h-[calc(100vh-4rem)] border-t border-zinc-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="space-y-2">
            <p className="font-code text-[11px] uppercase tracking-[0.2em] text-cyan-400">
              Cart
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Your cart
            </h1>
            <p className="font-body text-sm sm:text-base text-zinc-400 max-w-xl">
              Review your picks, tweak quantities and get ready to check out.
            </p>
          </div>
          <div className="text-xs text-zinc-500 font-body">
            Items: <span className="text-zinc-100 font-semibold">{itemsCount}</span>
          </div>
        </header>

        {cartItems.length === 0 ? (
          <div className="mt-6 border border-dashed border-zinc-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-3 bg-zinc-950/60">
            <p className="text-sm font-semibold text-zinc-200">Your cart is empty</p>
            <p className="text-xs text-zinc-500 max-w-sm">
              Head back to the shop to add products you love. They&apos;ll appear here whenever you&apos;re ready to check out.
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1 w-full space-y-4">
              {cartItems.map((item) => (
                <CartCard
                  key={item._id}
                  item={item}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            <CheckoutCard
              subtotal={subtotal}
              itemsCount={itemsCount}
              onCheckout={handleCheckout}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;