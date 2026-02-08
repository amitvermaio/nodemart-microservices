import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const formatPrice = (amount, currency) => {
  if (!Number.isFinite(amount)) {
    return '—';
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency || 'INR'} ${amount.toFixed(2)}`;
  }
};

const ItemCard = ({ product, currency }) => {
  const productId = product?._id || product?.id || '';
  const title = product?.title || product?.name || 'Product';
  const description = product?.description;
  const badge = product?.badge;

  const categories = Array.isArray(product?.category)
    ? product.category.filter(Boolean)
    : product?.category
      ? [product.category]
      : [];

  const tag = product?.tag || categories[0] || null;

  const priceAmount = Number(product?.price?.amount ?? product?.price ?? NaN);
  const priceCurrency = product?.price?.currency || currency || 'INR';

  const formattedPrice = useMemo(
    () => formatPrice(priceAmount, priceCurrency),
    [priceAmount, priceCurrency]
  );

  const primaryImage = useMemo(() => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
      const image = product.images[0];
      if (typeof image === 'string') {
        return image;
      }
      if (image?.thumbnail) {
        return image.thumbnail;
      }
      if (image?.url) {
        return image.url;
      }
    }
    return null;
  }, [product]);

  const productLink = productId ? `/shop/${productId}` : '#';

  return (
    <Link to={productLink} className="block h-full" tabIndex={productId ? 0 : -1}>
      <article className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-cyan-500/50 transition-colors duration-300 flex flex-col overflow-hidden h-full">
        <div className="relative mb-4 w-full aspect-square bg-gradient-to-br from-zinc-900 via-zinc-950 to-black flex items-center justify-center overflow-hidden">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <ShoppingBagIcon className="size-12 text-zinc-600 group-hover:text-cyan-300 transition-colors" />
          )}
          {tag && (
            <span className="absolute top-3 left-3 text-[10px] font-code uppercase tracking-[0.16em] px-2 py-1 rounded-full bg-zinc-900/80 border border-zinc-700 text-zinc-300">
              {tag}
            </span>
          )}
          {badge && (
            <span className="absolute top-3 right-3 bg-cyan-400 text-black px-2 py-1 rounded-full text-[10px] font-semibold">
              {badge}
            </span>
          )}
        </div>
        <div className="px-4 pb-4 flex-1 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-body font-semibold text-white group-hover:text-cyan-200 transition-colors text-sm sm:text-base line-clamp-2">
              {title}
            </h3>
          </div>
          {description && (
            <p className="text-xs text-zinc-400 line-clamp-2">
              {description}
            </p>
          )}
          <div className="flex items-center justify-between mt-auto">
            <span className="font-heading text-lg font-bold text-white">
              {formattedPrice}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:bg-cyan-400 group-hover:text-black transition-colors text-xs font-medium">
              <span>View</span>
              <ArrowRightIcon className="size-3.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default React.memo(ItemCard);
