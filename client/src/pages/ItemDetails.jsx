import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShoppingBagIcon, ShareIcon, ArrowLeftIcon, StarIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { PRODUCTS } from '../api/products';
import { asyncfetchproductbyid } from '../store/actions/productActions';
import { useDispatch, useSelector } from 'react-redux';

const ItemDetails = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const product = useSelector((state) => state.products.selected);
  const dispatch = useDispatch();


  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (itemId) {
      dispatch(asyncfetchproductbyid(itemId));
    }
  }, [dispatch, itemId]);

  const handleAddToCart = () => {
    if (!product) return;

    try {
      // something
    } catch (error) {
      toast.error('Could not add to cart');
    }
  };

  const handleShare = async () => {
    if (!product) return;

    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: shareUrl,
        });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard');
      } else {
        toast.message('Share this link', {
          description: shareUrl,
        });
      }
    } catch {
      toast.error('Could not share this item');
    }
  };

  if (!product) {
    return (
      <section className="bg-zinc-950 text-zinc-100 min-h-[calc(100vh-4rem)] border-t border-zinc-900/80 flex items-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-100 mb-4"
          >
            <ArrowLeftIcon className="size-4" />
            Back to shop
          </button>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-6 py-8 text-center">
            <p className="text-sm font-semibold text-zinc-100 mb-1">Product not found</p>
            <p className="text-xs text-zinc-500 mb-4">
              This item may have been removed or is not available yet.
            </p>
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="inline-flex items-center justify-center rounded-full bg-cyan-500/90 px-4 py-1.5 text-xs font-medium text-zinc-950 hover:bg-cyan-400 transition-colors"
            >
              Browse other products
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-zinc-950 text-zinc-100 min-h-[calc(100vh-4rem)] border-t border-zinc-900/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-100 mb-4"
        >
          <ArrowLeftIcon className="size-4" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.3fr)] gap-6 sm:gap-8 items-start">
          <div className="space-y-4">
            <div className="relative w-full aspect-square rounded-3xl border border-zinc-800 overflow-hidden bg-zinc-900 flex items-center justify-center">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[Math.min(activeImageIndex, product.images.length - 1)]?.url}
                  alt={product.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black flex items-center justify-center">
                  <ShoppingBagIcon className="size-16 text-zinc-600" />
                </div>
              )}
              {product.tag && (
                <span className="absolute top-4 left-4 text-[10px] font-code uppercase tracking-[0.16em] px-2 py-1 rounded-full bg-zinc-900/90 border border-zinc-700 text-zinc-300">
                  {product.tag}
                </span>
              )}
              {product.badge && (
                <span className="absolute top-4 right-4 bg-cyan-400 text-black px-3 py-1 rounded-full text-[10px] font-semibold">
                  {product.badge}
                </span>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={image._id || image.id || index}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative aspect-square rounded-xl overflow-hidden border transition-colors ${
                      index === activeImageIndex
                        ? 'border-cyan-500/80'
                        : 'border-zinc-800 hover:border-cyan-500/60'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.title} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-[11px] text-zinc-400 space-y-1">
              <p>
                Category:{' '}
                <span className="text-zinc-100 font-medium">
                  {Array.isArray(product.category) ? product.category.join(', ') : product.category}
                </span>
              </p>
              <p>
                Ships in:{' '}
                <span className="text-zinc-100 font-medium">2–4 business days</span>
              </p>
              {typeof product.deliveryDays === 'number' && (
                <p>
                  Delivery in:{' '}
                  <span className="text-zinc-100 font-medium">
                    {product.deliveryDays} days
                  </span>
                </p>
              )}
              <p>
                Return policy:{' '}
                <span className="text-zinc-100 font-medium">30-day hassle-free returns</span>
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <p className="font-code text-[11px] uppercase tracking-[0.2em] text-cyan-400">
                Product
              </p>
              <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
                {product.title}
              </h1>
              {product.rating && (
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <StarIcon className="size-4 text-cyan-300" />
                  <span className="font-medium text-zinc-100">
                    {product.rating.toFixed(1)}
                  </span>
                  <span>•</span>
                  <span>In stock</span>
                </div>
              )}
            </div>

            <p className="text-sm text-zinc-300 max-w-xl">
              {product.description}
            </p>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 mb-1">
                  Price
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-white">
                    ${(product.price?.amount ?? 0).toFixed(2)}
                  </span>
                  <span className="text-[11px] text-zinc-500">incl. all taxes</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="inline-flex items-center justify-center rounded-full bg-cyan-500/90 px-4 py-2 text-xs font-medium text-zinc-950 hover:bg-cyan-400 transition-colors"
                >
                  <ShoppingBagIcon className="size-4 mr-2" />
                  Add to cart
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-200 hover:border-cyan-500 hover:text-cyan-200 transition-colors"
                >
                  <ShareIcon className="size-3.5 mr-1.5" />
                  Share
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-zinc-400">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-3">
                <p className="text-xs font-medium text-zinc-200 mb-0.5">Made for builders</p>
                <p>
                  Tuned for deep work sessions, shipping days and weekend resets.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-3">
                <p className="text-xs font-medium text-zinc-200 mb-0.5">Quality first</p>
                <p>
                  Thoughtfully selected materials with a focus on durability and comfort.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-3">
                <p className="text-xs font-medium text-zinc-200 mb-0.5">Fast support</p>
                <p>
                  Questions about fit or setup? Our team responds in under 24h.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ItemDetails;