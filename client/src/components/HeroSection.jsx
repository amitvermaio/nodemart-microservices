import {
  ArrowRightIcon,
  SparklesIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';

const HIGHLIGHT_IMAGE_URL =
  'https://images.unsplash.com/photo-1755436613066-066d20f6445a?w=1200&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8TWluaW1hbGlzdCUyMERlc2slMjBTZXR1cCUyMGZvciUyMGNvZGVyc3xlbnwwfHwwfHx8MA%3D%3D';

const HighlightSection = () => {
  const handleGetStarted = () => {
    toast.success('Welcome to NodeMart! Explore our collection now.');
  };

  return (
    <section
      id="highlight"
      className="bg-zinc-950 border-b border-zinc-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 backdrop-blur">
                <SparklesIcon className="size-4 text-cyan-400" />
                <span className="font-body text-xs font-semibold tracking-wide text-zinc-300">
                  Built for modern developers
                </span>
              </div>

              <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Everything developers need — in one place
              </h2>

              <p className="font-body text-base md:text-lg text-zinc-400 leading-relaxed max-w-lg">
                Premium gear, clean setups and developer-first tools designed
                to improve focus, speed and execution.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center gap-2 bg-white text-black px-7 py-3 rounded-lg font-body font-semibold tracking-wide hover:bg-zinc-200 transition-colors group"
              >
                Start exploring
                <ArrowRightIcon className="size-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="inline-flex items-center justify-center gap-2 border border-zinc-700 text-white px-7 py-3 rounded-lg font-body font-semibold tracking-wide hover:bg-zinc-900 hover:border-cyan-500/70 transition-colors">
                <ShoppingBagIcon className="size-5 text-cyan-400" />
                Browse catalog
              </button>
            </div>

            <div className="flex gap-10 pt-6 border-t border-zinc-800">
              <div>
                <div className="font-heading text-2xl font-bold text-white">
                  50K+
                </div>
                <div className="font-body text-sm text-zinc-500">
                  Developers served
                </div>
              </div>
              <div>
                <div className="font-heading text-2xl font-bold text-white">
                  5K+
                </div>
                <div className="font-body text-sm text-zinc-500">
                  Curated products
                </div>
              </div>
            </div>
          </div>

          {/* Right image card */}
          <div className="hidden md:block relative">
            <div className="relative w-full aspect-[4/3] rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-900">
              <img
                src={HIGHLIGHT_IMAGE_URL}
                alt="Minimalist desk setup for coders"
                className="h-full w-full object-cover object-center opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div>
                  <p className="font-body text-xs text-zinc-300 uppercase tracking-[0.18em]">
                    Featured bundle
                  </p>
                  <p className="font-body text-sm text-white mt-1">
                    Minimalist desk setup for coders
                  </p>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-cyan-500 text-black font-body text-xs font-semibold hover:bg-cyan-400 transition-colors inline-flex items-center gap-1">
                  <ShoppingBagIcon className="size-4" />
                  View bundle
                </button>
              </div>
            </div>
          </div>
          {/* End right image card */}
        </div>
      </div>
    </section>
  );
};

export default HighlightSection;
