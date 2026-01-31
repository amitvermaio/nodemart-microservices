import {
  ArrowRightIcon,
  BoltIcon,
  BookmarkSquareIcon,
  CommandLineIcon,
  SparklesIcon,
  SwatchIcon,
} from '@heroicons/react/24/outline';

const categories = [
  {
    id: 'accessories',
    label: 'Accessories',
    description: 'Keycaps, cable organizers, mounts and little upgrades that make a big difference.',
    icon: SparklesIcon,
    accent: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
  },
  {
    id: 'clothing',
    label: 'Clothing',
    description: 'Comfortable, minimal merch for devs — hoodies, tees and more.',
    icon: SwatchIcon,
    accent: 'from-fuchsia-500/20 via-fuchsia-500/5 to-transparent',
  },
  {
    id: 'lighting',
    label: 'Lighting',
    description: 'Ambient and task lighting to keep your workspace calm and focused.',
    icon: BoltIcon,
    accent: 'from-amber-400/25 via-amber-400/5 to-transparent',
  },
  {
    id: 'coding-learning',
    label: 'Coding & Learning Resources',
    description: 'Courses, guides and digital tools that help you ship better software.',
    icon: CommandLineIcon,
    accent: 'from-emerald-400/25 via-emerald-400/5 to-transparent',
  },
  {
    id: 'productivity-setup',
    label: 'Productivity & Desktop Setup',
    description: 'Monitor stands, trays, organizers and workflow essentials for deep work.',
    icon: BookmarkSquareIcon,
    accent: 'from-sky-400/25 via-sky-400/5 to-transparent',
  },
  {
    id: 'stickers-posters',
    label: 'Stickers, Posters & Wall Arts',
    description: 'Make your space feel like yours with character-filled visuals.',
    icon: SwatchIcon,
    accent: 'from-rose-400/25 via-rose-400/5 to-transparent',
  },
];

const CategoriesSection = () => {
  return (
    <section
      id="categories"
      className="border-b border-zinc-800 flex items-center bg-zinc-950"
      style={{ minHeight: 'calc(100vh - 4rem)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-xl">
            <p className="font-code text-xs uppercase tracking-[0.2em] text-cyan-400">
              Browse by category
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
              See what you can build with
            </h2>
            <p className="font-body text-sm sm:text-base text-zinc-400">
              From accessories to full desk setups, explore the collections that match
              how you work, learn and create.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs sm:text-sm font-body text-zinc-300">
            {categories.map((category) => (
              <span
                key={category.id}
                className="px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 hover:border-cyan-500/60 hover:text-white transition-colors"
              >
                {category.label}
              </span>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <article
                key={category.id}
                className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 hover:border-cyan-500/50 transition-colors duration-300 flex flex-col p-6"
              >
                <div
                  className={`pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${category.accent}`}
                />

                <div className="relative flex flex-col gap-4 flex-1">
                  <div className="inline-flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 border border-zinc-700/80 group-hover:border-cyan-400/60 transition-colors">
                      <Icon className="size-4 text-cyan-400" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-heading text-base sm:text-lg font-semibold text-white">
                        {category.label}
                      </h3>
                      <p className="font-code text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                        Category
                      </p>
                    </div>
                  </div>

                  <p className="font-body text-sm text-zinc-400 leading-relaxed flex-1">
                    {category.description}
                  </p>

                  <button className="mt-2 inline-flex items-center gap-2 text-xs font-semibold font-body text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    Shop this category
                    <ArrowRightIcon className="size-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;