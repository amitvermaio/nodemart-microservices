import { ShieldCheckIcon, TruckIcon, StarIcon } from '@heroicons/react/24/outline';

const features = [
  {
    icon: ShieldCheckIcon,
    title: 'Secure Checkout',
    badge: 'PCI-DSS',
    description: 'Industry-grade encryption and security on every transaction.',
  },
  {
    icon: TruckIcon,
    title: 'Fast Delivery',
    badge: '48h',
    description: 'Priority shipping options for creators in major cities.',
  },
  {
    icon: StarIcon,
    title: 'Curated Quality',
    badge: 'Verified',
    description: 'Every product is reviewed and quality-checked by our team.',
  },
];

const FeaturesSection = () => {
  return (
    <section
      id="orders"
      className="border-b border-zinc-800 flex items-center bg-zinc-950"
      style={{ minHeight: 'calc(100vh - 4rem)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        <div className="text-center mb-16">
          <p className="font-code text-xs uppercase tracking-[0.2em] text-cyan-400 mb-3">
            Why NodeMart
          </p>
          <h2 className="font-heading text-4xl font-bold text-white mb-4">
            Everything you need to ship
          </h2>
          <p className="font-body text-zinc-400 max-w-2xl mx-auto">
            From gear to digital tools, NodeMart removes the friction between your ideas
            and real-world execution.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="group relative p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 hover:border-cyan-500/40 transition-colors duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_55%)]" />
                <div className="relative flex flex-col gap-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700/80">
                    <Icon className="size-4 text-cyan-400" />
                    <span className="font-body text-xs text-zinc-300">{feature.badge}</span>
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="font-body text-sm text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
