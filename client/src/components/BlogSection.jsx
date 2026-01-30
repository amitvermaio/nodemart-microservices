import { ArrowRightIcon } from '@heroicons/react/24/outline';

const posts = [
  {
    title: 'Designing the perfect dev workspace',
    category: 'Workflows',
    readingTime: '6 min read',
    date: 'Jan 18, 2026',
  },
  {
    title: '5 Node.js tools we swear by',
    category: 'Engineering',
    readingTime: '4 min read',
    date: 'Jan 10, 2026',
  },
  {
    title: 'From idea to product in a weekend',
    category: 'Makers',
    readingTime: '7 min read',
    date: 'Dec 29, 2025',
  },
];

const BlogSection = () => {
  return (
    <section
      id="blog"
      className="border-b border-zinc-800 flex items-center bg-zinc-950"
      style={{ minHeight: 'calc(100vh - 4rem)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="font-code text-xs uppercase tracking-[0.2em] text-cyan-400 mb-3">
              Journal
            </p>
            <h2 className="font-heading text-4xl font-bold text-white mb-2">
              Stories from the NodeMart team
            </h2>
            <p className="font-body text-zinc-400 max-w-xl">
              Learn how other builders, founders and indie hackers set up their workflows
              and ship meaningful products.
            </p>
          </div>
          <button className="hidden sm:inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors group font-body text-sm">
            Visit blog
            <ArrowRightIcon className="size-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.title}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-cyan-500/60 transition-colors duration-300 p-6 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-body text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                    {post.category}
                  </span>
                  <span className="font-body text-[11px] text-zinc-500">
                    {post.date}
                  </span>
                </div>
                <h3 className="font-heading text-lg font-semibold text-white group-hover:text-cyan-200">
                  {post.title}
                </h3>
                <p className="font-body text-xs text-zinc-500">{post.readingTime}</p>
              </div>
              <button className="mt-4 inline-flex items-center gap-1 text-xs font-body text-zinc-300 group-hover:text-cyan-300">
                Read story
                <ArrowRightIcon className="size-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
