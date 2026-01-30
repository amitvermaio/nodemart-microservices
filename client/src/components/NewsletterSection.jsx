import { CheckIcon } from '@heroicons/react/24/outline';

const NewsletterSection = () => {
  return (
    <section
      id="support"
      className="border-b border-zinc-800 flex items-center bg-zinc-950"
      style={{ minHeight: 'calc(100vh - 4rem)' }}
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 md:py-16">
        <p className="font-code text-xs uppercase tracking-[0.2em] text-cyan-400 mb-3">
          Stay in the loop
        </p>
        <h2 className="font-heading text-4xl font-bold text-white mb-4">
          Get drops before everyone else
        </h2>
        <p className="font-body text-zinc-400 mb-8">
          Be the first to know about limited drops, new collections and
          behind-the-scenes stories from the team.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 bg-zinc-900/70 p-2 rounded-lg border border-zinc-800">
          <input
            type="email"
            placeholder="Enter your best email"
            className="flex-1 bg-transparent px-4 py-2 font-body text-white placeholder:text-zinc-600 focus:outline-none"
          />
          <button className="px-6 py-2 bg-cyan-500 text-black rounded-lg font-body font-semibold hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2">
            Join newsletter
            <CheckIcon className="size-4" />
          </button>
        </div>
        <p className="mt-3 font-body text-xs text-zinc-500">
          No spam. Just thoughtful updates, once or twice a month.
        </p>
      </div>
    </section>
  );
};

export default NewsletterSection;
