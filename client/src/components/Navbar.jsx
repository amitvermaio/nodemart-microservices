import { 
  ShoppingBagIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(null);

  const navItems = [
    { label: 'Shop', to: '/shop' },
    { label: 'Orders', to: '/orders' },
    { label: 'Seller Dashboard', to: '/dashboard' },
    { label: 'Support', to: '/support' }
  ];

  const capitalize = (str = '') => str.charAt(0).toUpperCase() + str.slice(1);


  useEffect(() => {
    const loadAddress = () => {
      try {
        const raw = window.localStorage.getItem('defaultAddress');
        if (!raw) return;
        const parsed = JSON.parse(raw);
        setDefaultAddress(parsed);
      } catch {
        // ignore
      }
    };

    loadAddress();

    const handler = () => loadAddress();
    window.addEventListener('default-address-updated', handler);
    return () => {
      window.removeEventListener('default-address-updated', handler);
    };
  }, []);

  return (
    <nav className="w-full bg-zinc-950/95 backdrop-blur border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center cursor-pointer">
              <span className="font-heading text-xl font-bold tracking-tighter text-white uppercase italic">
                &lt;node<span className="text-cyan-400">mart /&gt;</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-6 font-body text-[13px] font-medium tracking-wide">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `text-zinc-400 hover:text-cyan-400 transition-colors ${
                      isActive && item.to.startsWith('/') ? 'text-cyan-400' : ''
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="size-4 text-zinc-500 group-focus-within:text-zinc-300" />
              </div>
              <input
                type="text"
                placeholder="Search products, orders, sellers..."
                className="block w-full bg-zinc-900 border border-zinc-800 rounded-md py-1.5 pl-10 pr-3 font-body text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <Link to="/cart" className="relative p-2 hover:bg-zinc-900 rounded-md transition-colors group">
                <ShoppingBagIcon className="size-5 text-zinc-400 group-hover:text-cyan-400" />
                <span className="absolute -top-1 -right-1 bg-cyan-500 text-black text-[10px] font-code font-bold px-1 rounded-sm min-w-[16px]">
                  2
                </span>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-2 sm:px-3 py-1.5 hover:bg-zinc-900 rounded-full transition-colors"
                >
                  <div className="size-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-heading text-white">
                    {(user?.fullname || user?.username || 'N').charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="font-body text-xs font-semibold text-white">
                      {capitalize(user?.fullname || user?.username || 'Guest')}
                    </span>
                    <span className="font-body text-[10px] text-zinc-500">
                      {defaultAddress
                        ? `${defaultAddress.city}, ${defaultAddress.country}`
                        : 'No default address'}
                    </span>
                  </div>
                  <ChevronDownIcon className="size-4 text-zinc-500" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-zinc-950 border border-zinc-800 rounded-lg shadow-lg py-2 z-50">
                    <div className="flex items-center gap-3 px-3 py-2 border-b border-zinc-800">
                      <div className="size-9 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-heading text-white">
                        {(user?.fullname || user?.username || 'N').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-body text-xs font-semibold text-white">{user?.fullname || user?.username || 'Guest'}</p>
                        {user?.email && (
                          <p className="font-body text-[10px] text-zinc-500">{user.email}</p>
                        )}
                        {defaultAddress && (
                          <p className="font-body text-[10px] text-zinc-500">
                            {defaultAddress.city}, {defaultAddress.country}
                          </p>
                        )}
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="block w-full text-left px-4 py-2 font-body text-xs text-zinc-300 hover:bg-zinc-900"
                    >
                      Profile
                    </Link>
                    <button className="w-full text-left px-4 py-2 font-body text-xs text-zinc-300 hover:bg-zinc-900">
                      Orders
                    </button>
                    <button className="w-full text-left px-4 py-2 font-body text-xs text-zinc-300 hover:bg-zinc-900">
                      Seller Dashboard
                    </button>
                    <div className="border-t border-zinc-800 mt-1 pt-1">
                      <button className="w-full text-left px-4 py-2 font-body text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300">
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/signin"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/40 text-cyan-300 text-xs font-medium hover:bg-cyan-500/10 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="size-4" />
                <span>Sign in</span>
              </Link>
            )}

            <button
              className="lg:hidden p-2 ml-1 hover:bg-zinc-900 rounded-md"
              onClick={() => setIsMobileOpen((prev) => !prev)}
            >
              <Bars3Icon className="size-6 text-zinc-400" />
            </button>
          </div>
        </div>
        {isMobileOpen && (
          <div className="lg:hidden pb-4 border-t border-zinc-800">
            <div className="pt-3 flex flex-col gap-1 font-body text-sm">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onClick={() => setIsMobileOpen(false)}
                  className="block px-1 py-2 text-zinc-300 hover:text-cyan-400 hover:bg-zinc-900 rounded-md transition-colors"
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}