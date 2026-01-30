import { ArrowTrendingUpIcon, CurrencyRupeeIcon, CubeIcon } from '@heroicons/react/24/outline';

const formatCurrency = (value) => {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value || 0);
  } catch {
    return `₹${Number(value || 0).toFixed(0)}`;
  }
};

const SellerMetrics = ({ metrics, products }) => {
  const sales = metrics?.sales ?? 0;
  const revenue = metrics?.revenue ?? 0;
  const topProductsCount = metrics?.topProducts?.length ?? 0;
  const productCount = products?.length ?? 0;

  const cards = [
    {
      label: 'Total sales',
      hint: 'Items sold across confirmed orders',
      value: sales.toLocaleString('en-IN'),
      icon: ArrowTrendingUpIcon,
    },
    {
      label: 'Revenue',
      hint: 'Approximate gross revenue',
      value: formatCurrency(revenue),
      icon: CurrencyRupeeIcon,
    },
    {
      label: 'Active products',
      hint: topProductsCount
        ? `${productCount} listed • Top ${topProductsCount} highlighted`
        : `${productCount} listed in catalog`,
      value: productCount.toString(),
      icon: CubeIcon,
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article
            key={card.label}
            className="rounded-2xl border border-zinc-800 bg-zinc-950/70 hover:bg-zinc-950 hover:border-cyan-500/50 transition-colors duration-300 p-4 sm:p-5 flex items-start gap-3"
          >
            <div className="size-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              <Icon className="size-5 text-cyan-300" />
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] font-code uppercase tracking-[0.18em] text-zinc-500">
                {card.label}
              </p>
              <p className="text-xl sm:text-2xl font-heading font-semibold text-zinc-100">
                {card.value}
              </p>
              <p className="text-[11px] text-zinc-500">{card.hint}</p>
            </div>
          </article>
        );
      })}
    </section>
  );
};

export default SellerMetrics;
