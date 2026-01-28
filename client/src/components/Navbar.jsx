import { 
  ShoppingBagIcon, 
  UserIcon, 
  MagnifyingGlassIcon,
  Bars3Icon 
} from '@heroicons/react/24/outline';

export default function Navbar() {
  return (
    <nav className="w-full bg-zinc-950 text-zinc-200 border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* 1. Logo Section */}
          <div className="flex items-center gap-8">
            <div className="flex items-center cursor-pointer">
              <span className="font-heading text-xl font-bold tracking-tighter text-white uppercase italic">
                &lt;node<span className="text-zinc-500">mart /&gt;</span>
              </span>
            </div>

            {/* 2. Primary Navigation (Standard E-com) */}
            <div className="hidden md:flex items-center gap-6 font-body text-[13px] font-medium tracking-wide">
              <a href="#" className="hover:text-white transition-colors">Marketplace</a>
              <a href="#" className="hover:text-white transition-colors">New Arrivals</a>
              <a href="#" className="hover:text-white transition-colors">Collections</a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors">Sale</a>
            </div>
          </div>

          {/* 3. Search Bar (Centered/Large) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="size-4 text-zinc-500 group-focus-within:text-zinc-300" />
              </div>
              <input 
                type="text" 
                placeholder="Search hardware, setups, books..." 
                className="block w-full bg-zinc-900 border border-zinc-800 rounded-md py-1.5 pl-10 pr-3 font-body text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 transition-all"
              />
            </div>
          </div>

          {/* 4. Functional Icons */}
          <div className="flex items-center gap-2">
            {/* Account - Using Inter */}
            <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-900 rounded-md transition-colors">
              <UserIcon className="size-5 text-zinc-400" />
              <span className="hidden sm:block font-body text-xs font-semibold">Account</span>
            </button>
    
            {/* Cart - Using JetBrains Mono for the count */}
            <button className="relative p-2 hover:bg-zinc-900 rounded-md transition-colors group">
              <ShoppingBagIcon className="size-5 text-zinc-400 group-hover:text-white" />
              <span className="absolute -top-1 -right-1 bg-white text-zinc-950 text-[10px] font-code font-bold px-1 rounded-sm min-w-[16px]">
                0
              </span>
            </button>

            {/* Mobile Menu */}
            <button className="md:hidden p-2">
              <Bars3Icon className="size-6 text-zinc-400" />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}