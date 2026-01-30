import BlogCard from '../components/blog/BlogCard';

const POSTS = [
  {
    id: 1,
    title: 'What we’re building with NodeMart',
    category: 'Product updates',
    readingTime: '5 min read',
    date: 'Jan 20, 2026',
    badge: 'New',
    excerpt:
      'A quick look at why we created NodeMart, how it fits into a modern microservice stack, and what is coming next for builders.',
  },
  {
    id: 2,
    title: 'Designing a calm checkout for busy teams',
    category: 'Design',
    readingTime: '7 min read',
    date: 'Jan 11, 2026',
    excerpt:
      'How we approached the cart and checkout experience in NodeMart so teams can review, edit and confirm orders without friction.',
  },
  {
    id: 3,
    title: 'Seller dashboards that actually feel useful',
    category: 'Seller stories',
    readingTime: '6 min read',
    date: 'Jan 3, 2026',
    excerpt:
      'Behind the scenes of the NodeMart seller dashboard: which metrics we surface, how we think about states and why clarity beats charts.',
  },
  {
    id: 4,
    title: 'From API schema to UI in a weekend',
    category: 'Engineering',
    readingTime: '8 min read',
    date: 'Dec 27, 2025',
    excerpt:
      'Walking through the early NodeMart architecture: the services we picked, how we structured contracts and what we learned shipping fast.',
  },
  {
    id: 5,
    title: 'Keeping NodeMart fast as catalog grows',
    category: 'Performance',
    readingTime: '5 min read',
    date: 'Dec 15, 2025',
    excerpt:
      'Strategies we use to keep browsing, search and favorites responsive even as the number of products and sellers increases.',
  },
  {
    id: 6,
    title: 'Support, but with the right defaults',
    category: 'Support',
    readingTime: '4 min read',
    date: 'Dec 5, 2025',
    excerpt:
      'How the NodeMart support flow is designed to answer common questions quickly while keeping room for high-touch requests.',
  },
];

const Blogs = () => {
  return (
    <section className="bg-zinc-950 text-zinc-100 min-h-[calc(100vh-4rem)] border-t border-zinc-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
          <div className="space-y-2">
            <p className="font-code text-[11px] uppercase tracking-[0.2em] text-cyan-400">
              Journal
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Stories from NodeMart
            </h1>
            <p className="font-body text-sm sm:text-base text-zinc-400 max-w-xl">
              Deep dives, product updates and workflows from the team building NodeMart and the people using it in their everyday stacks.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-[11px] text-zinc-400 max-w-xs">
            <p className="font-medium text-zinc-200 mb-1">About the blog</p>
            <p>
              All posts are written for builders: engineers, founders and operators who care about thoughtful commerce experiences.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {POSTS.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blogs;