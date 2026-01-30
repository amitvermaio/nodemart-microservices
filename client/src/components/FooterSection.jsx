import { Link } from 'react-router-dom';

const FooterSection = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-900/80 bg-zinc-950/95 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 sm:gap-10 mb-8 sm:mb-10">
          <div className="space-y-3 max-w-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-950/80">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span className="font-code text-[10px] uppercase tracking-[0.22em] text-zinc-400">
                NodeMart
              </span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-semibold text-white">
              Commerce tooling for modern builders.
            </h3>
            <p className="font-body text-xs sm:text-sm text-zinc-500">
              A tiny commerce layer for teams shipping microservice-based products, with a focus on calm dashboards and fast checkouts.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 text-xs sm:text-sm">
            <div className="space-y-3">
              <p className="font-body text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                Product
              </p>
              <ul className="space-y-2 font-body">
                <li>
                  <Link to="/shop" className="hover:text-cyan-300 transition-colors">
                    Shop all
                  </Link>
                </li>
                <li>
                  <Link to="/collections" className="hover:text-cyan-300 transition-colors">
                    Collections
                  </Link>
                </li>
                <li>
                  <Link to="/blogs" className="hover:text-cyan-300 transition-colors">
                    Guides & stories
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="font-body text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                For sellers
              </p>
              <ul className="space-y-2 font-body">
                <li>
                  <Link to="/dashboard" className="hover:text-cyan-300 transition-colors">
                    Seller dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="hover:text-cyan-300 transition-colors">
                    Support
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    className="text-zinc-500 hover:text-cyan-300 transition-colors cursor-default"
                  >
                    Pricing (coming soon)
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="font-body text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                Company
              </p>
              <ul className="space-y-2 font-body">
                <li>
                  <Link to="/blogs" className="hover:text-cyan-300 transition-colors">
                    About NodeMart
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    className="text-zinc-500 hover:text-cyan-300 transition-colors cursor-default"
                  >
                    Careers (not hiring yet)
                  </button>
                </li>
                <li>
                  <Link to="/support" className="hover:text-cyan-300 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-5 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between text-[11px] text-zinc-500 font-body">
          <p>
            &copy; {year} NodeMart. Built for builders.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="hover:text-cyan-300 transition-colors cursor-default"
            >
              Privacy
            </button>
            <span className="h-1 w-1 rounded-full bg-zinc-700" />
            <button
              type="button"
              className="hover:text-cyan-300 transition-colors cursor-default"
            >
              Terms
            </button>
            <span className="h-1 w-1 rounded-full bg-zinc-700" />
            <button
              type="button"
              className="hover:text-cyan-300 transition-colors cursor-default"
            >
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
