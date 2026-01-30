import { Link } from 'react-router-dom';
import FooterSection from '../components/FooterSection';

const NotFound = () => {
  return (
    <div>
      <section className="bg-zinc-950 text-zinc-100 min-h-[100vh] border-t border-zinc-900/80 flex items-center">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-zinc-800/80 bg-zinc-900/60 px-4 py-1.5 text-[11px] text-zinc-400">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-cyan-400">
                404
              </span>
              <span>Route not wired in this workspace</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
                Page not found
              </h1>
              <p className="font-body text-sm sm:text-base text-zinc-400 max-w-xl">
                The URL you requested doesn&apos;t map to any NodeMart view yet. Double-check the address, or jump back into the storefront.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full bg-cyan-500/90 px-5 py-2.5 text-xs font-medium text-zinc-950 shadow-sm hover:bg-cyan-400 transition-colors"
              >
                Back to home
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/60 px-5 py-2.5 text-xs font-medium text-zinc-100 hover:border-cyan-500/70 hover:text-cyan-200 transition-colors"
              >
                Browse products
              </Link>
            </div>
          </div>
        </div>
      </section>
      <FooterSection />
    </div>
  );
};

export default NotFound;