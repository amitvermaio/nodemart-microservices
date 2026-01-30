const FooterSection = () => {
  return (
    <section
      id="seller"
      className="py-12 bg-zinc-900/60 border-t border-zinc-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-heading text-white font-bold mb-4">
              &lt;node<span className="text-zinc-500">mart /&gt;</span>
            </h3>
            <p className="font-body text-sm text-zinc-500">
              Tools, products and stories designed for builders.
            </p>
          </div>
          <div>
            <h4 className="font-body font-semibold text-white mb-3">Shop</h4>
            <ul className="space-y-2 font-body text-sm text-zinc-400">
              <li><a href="#collections" className="hover:text-white transition-colors">Featured</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">All Products</a></li>
              <li><a href="#blog" className="hover:text-white transition-colors">Guides</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-body font-semibold text-white mb-3">For sellers</h4>
            <ul className="space-y-2 font-body text-sm text-zinc-400">
              <li><a href="#seller" className="hover:text-white transition-colors">Seller dashboard</a></li>
              <li><a href="#support" className="hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-body font-semibold text-white mb-3">Company</h4>
            <ul className="space-y-2 font-body text-sm text-zinc-400">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} NodeMart. All rights reserved.
          </p>
          <div className="flex items-center gap-4 font-body text-xs text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterSection;
