'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, MapPin, Search, Menu, X, ChevronRight, LogOut, User } from 'lucide-react';
import axios from 'axios';

const sidebarSections = [
  {
    heading: 'Trending',
    links: [
      { label: 'Bestsellers', href: '/' },
      { label: 'New Releases', href: '/' },
      { label: "Today's Deals", href: '/' },
    ],
  },
  {
    heading: 'Shop by Category',
    links: [
      { label: 'Mobiles & Computers', href: '/search?category=Electronics' },
      { label: 'TV & Electronics', href: '/search?category=Deals' },
      { label: 'Home & Kitchen', href: '/search?category=HomeStyle' },
      { label: 'Fashion & Apparel', href: '/search?category=Fashion' },
    ],
  },
  {
    heading: 'Help & Settings',
    links: [
      { label: 'Your Account', href: '#' },
      { label: 'Customer Service', href: '#' },
    ],
  },
];

const languages = [
  { code: 'EN', name: 'English - EN' },
  { code: 'HI', name: 'हिन्दी - HI' },
  { code: 'TA', name: 'தமிழ் - TA' },
  { code: 'TE', name: 'తెలుగు - TE' },
  { code: 'KN', name: 'ಕನ್ನಡ - KN' },
  { code: 'ML', name: 'മലയാളം - ML' },
  { code: 'BN', name: 'বাংলা - BN' },
  { code: 'MR', name: 'मराठी - MR' }
];

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem('amazon_user');
    if (name) {
      setTimeout(() => {
        setUser(name);
      }, 0);
    }

    const updateCartCount = () => {
      const token = localStorage.getItem('amazon_token');
      if (token) {
        axios.get('/api/cart', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(res => {
          const data = res.data;
          if (data.success && data.cart) {
            const totalQty = data.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            setCartCount(totalQty);
          }
        })
        .catch(err => console.error("Error fetching cart count:", err));
      } else {
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const cartId = params.get('id');
          if (cartId) {
            setCartCount(1);
          } else {
            setCartCount(0);
          }
        }
      }
    };

    updateCartCount();

    window.addEventListener('cart-updated', updateCartCount);
    return () => {
      window.removeEventListener('cart-updated', updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('amazon_token');
    localStorage.removeItem('amazon_user');
    setUser(null);
    setSidebarOpen(false);
    router.push('/');
  };

  return (
    <>
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Slide-out Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-[300px] max-w-[80vw] bg-white z-55 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center gap-3 bg-[#232F3E] text-white px-5 py-4 shrink-0">
          <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center border border-white/20">
            <User size={20} className="text-gray-200" />
          </div>
          <span className="text-base font-bold tracking-tight">
            {user ? `Hello, ${user}` : 'Hello, sign in'}
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto py-4 px-2">
          {sidebarSections.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                {section.heading}
              </h3>
              <ul className="space-y-1">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <button
                      onClick={() => {
                        setSidebarOpen(false);
                        if (link.href !== '#') router.push(link.href);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors text-left font-medium cursor-pointer"
                    >
                      <span>{link.label}</span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  </li>
                ))}
              </ul>
              {idx < sidebarSections.length - 1 && (
                <div className="border-t border-gray-100 my-4 mx-4" />
              )}
            </div>
          ))}

          <div className="px-4 pt-4 border-t border-gray-100 mt-4">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-105 text-red-650 rounded-lg text-sm font-semibold transition-all border border-red-100 cursor-pointer"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  router.push('/login');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 hover:bg-amber-105 text-amber-800 rounded-lg text-sm font-semibold transition-all border border-amber-100 cursor-pointer"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-[#131921] text-white sticky top-0 z-40 select-none shadow-md">
        <div className="flex flex-col md:flex-row md:items-center px-4 md:px-6 py-2.5 gap-3 md:gap-4 max-w-[1500px] mx-auto">

          {/* Logo & Mobile Menu Trigger */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3 shrink-0">
            <div className="flex items-center gap-2">

              <div
                onClick={() => router.push('/')}
                className="cursor-pointer flex items-baseline hover:ring-1 hover:ring-white p-1 rounded-sm transition-all"
              >
                <span className="text-xl md:text-2xl font-bold tracking-tight">amazon</span>
                <span className="text-sm font-bold text-[#FF9900]">.in</span>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 md:hidden">
              <div
                onClick={() => router.push(user ? '#' : '/login')}
                className="text-gray-305 hover:text-white p-2 text-xs flex items-center gap-1 cursor-pointer font-medium"
              >
                <User size={18} />
                <span className="max-w-[70px] truncate">{user || 'Sign in'}</span>
              </div>
              <div
                onClick={() => router.push('/cart')}
                className="relative p-2 flex items-center cursor-pointer hover:bg-white/10 rounded-lg transition-all"
              >
                <ShoppingCart size={22} className="text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF9900] text-[#111] rounded-full text-[10px] font-bold w-5 h-5 flex items-center justify-center animate-bounce shadow">
                    {cartCount}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div
            onClick={() => { }}
            className="hidden md:flex items-center gap-2 cursor-pointer hover:ring-1 hover:ring-white px-2 py-1 rounded-sm shrink-0 transition-all"
          >
            <MapPin size={18} className="text-gray-300 mt-1" />
            <div className="text-left leading-tight">
              <div className="text-[11px] text-gray-300 font-semibold">Delivering to Madurai 625009</div>
              <div className="text-xs font-extrabold text-white">Update location</div>
            </div>
          </div>

          {/* Search bar */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-1 items-stretch h-10 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#FF9900] transition-shadow shadow-sm"
          >
            <select className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 text-xs outline-none cursor-pointer border-r border-gray-200 font-semibold transition-colors">
              <option>All</option>
              <option>Deals</option>
              <option>Appliances</option>
              <option>Kitchen</option>
            </select>
            <input
              type="text"
              placeholder="Search Amazon.in"
              className="flex-grow px-4 text-sm text-gray-900 outline-none w-full placeholder-gray-400 font-semibold"
            />
            <button
              type="submit"
              className="bg-[#FF9900] hover:bg-[#e68a00] active:bg-[#cc7a00] px-5 flex items-center justify-center cursor-pointer transition-colors border-none outline-none text-[#111]"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Language Selector */}
          <div 
            className="relative hidden lg:block shrink-0"
            onMouseEnter={() => setLangOpen(true)}
            onMouseLeave={() => setLangOpen(false)}
          >
            <div className="flex items-center gap-1 cursor-pointer hover:ring-1 hover:ring-white px-2 py-1.5 rounded-sm transition-all font-bold text-xs h-full">
              <span className="text-base">🇮🇳</span>
              <span>{selectedLang}</span>
              <span className="text-[8px] text-gray-400">▼</span>
            </div>

            {langOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-60 bg-white text-gray-900 border border-gray-200 rounded-lg shadow-xl py-4 px-4 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                {/* Arrow up pointing to language button */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-[8px] border-transparent border-b-white drop-shadow-[0_-1px_1px_rgba(0,0,0,0.05)]"></div>
                
                <div className="text-xs font-bold text-gray-800 mb-3">Change Language</div>
                
                <div className="space-y-2.5">
                  {languages.map((lang, index) => (
                    <div key={lang.code}>
                      <label 
                        className="flex items-center gap-2.5 text-xs text-gray-700 font-medium hover:text-[#C45500] cursor-pointer"
                      >
                        <input 
                          type="radio" 
                          name="language" 
                          checked={selectedLang === lang.code}
                          onChange={() => setSelectedLang(lang.code)}
                          className="w-4 h-4 text-[#FF9900] focus:ring-[#FF9900] border-gray-300 accent-[#FF9900]"
                        />
                        <span>{lang.name}</span>
                      </label>
                      {index === 0 && (
                        <div className="border-t border-gray-100 my-2"></div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 my-3"></div>

                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                  <span className="text-base">🇮🇳</span>
                  <span>You are shopping on Amazon.in</span>
                </div>

                <div className="mt-2.5 text-center">
                  <span className="text-[11px] text-[#0066c0] hover:text-[#c45500] hover:underline cursor-pointer font-semibold block">
                    Change country/region
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Account Details */}
          <div
            onClick={() => !user && router.push('/login')}
            className="hidden md:block cursor-pointer hover:ring-1 hover:ring-white px-2 py-1 rounded-sm shrink-0 transition-all text-left leading-tight"
          >
            <div className="text-[11px] text-gray-300 font-semibold">Hello, {user || 'sign in'}</div>
            <div className="text-xs font-extrabold text-white flex items-center gap-1">
              <span>Account & Lists</span>
              <span className="text-[8px] text-gray-400">▼</span>
            </div>
          </div>

          {/* Returns & Orders */}
          <div 
            onClick={() => router.push('/orders')}
            className="hidden md:block cursor-pointer hover:ring-1 hover:ring-white px-2 py-1 rounded-sm shrink-0 transition-all text-left leading-tight"
          >
            <div className="text-[11px] text-gray-300 font-semibold">Returns</div>
            <div className="text-xs font-extrabold text-white">& Orders</div>
          </div>

          {user && (
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1 bg-transparent border border-white/30 hover:border-white px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all"
            >
              <LogOut size={13} />
              Logout
            </button>
          )}

          {/* Cart */}
          <div
            onClick={() => router.push('/cart')}
            className="hidden md:flex items-end gap-1 cursor-pointer hover:ring-1 hover:ring-white px-2 py-1 rounded-sm shrink-0 transition-all relative"
          >
            <div className="relative flex items-center">
              <ShoppingCart size={28} />
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-[#FF9900] text-[#111] rounded-full text-xs font-extrabold w-5 h-5 flex items-center justify-center shadow">
                {cartCount}
              </span>
            </div>
            <span className="text-xs font-extrabold mb-0.5">Cart</span>
          </div>

        </div>

        {/* Bottom bar links */}
        <div className="bg-[#232f3e] border-t border-white/5">
          <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-1 flex items-center gap-3 text-xs font-semibold overflow-x-auto whitespace-nowrap scrollbar-none select-none">

            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-1 font-extrabold cursor-pointer hover:ring-1 hover:ring-white px-2 py-1 rounded-sm transition-all"
            >
              <Menu size={15} />
              All
            </button>

            {['MX Player', 'Sell', 'Bestsellers', "Today's Deals", 'Mobiles', 'Prime', 'New Releases', 'Customer Service', 'Electronics', 'Amazon Pay', 'Fashion', 'Home & Kitchen'].map((item) => (
              <span
                key={item}
                onClick={() => {
                  if (item === 'Bestsellers') router.push('/');
                  else if (item === 'Electronics') router.push('/search?category=Deals');
                  else if (item === 'Home & Kitchen') router.push('/search?category=HomeStyle');
                  else if (item === 'Fashion') router.push('/search?category=Fashion');
                  else if (item === 'Mobiles') router.push('/search?category=Electronics');
                }}
                className="cursor-pointer hover:ring-1 hover:ring-white px-2 py-1 rounded-sm transition-all text-gray-200 hover:text-white"
              >
                {item === 'Prime' ? (
                  <span className="flex items-center gap-0.5">Prime <span className="text-[7px] text-gray-400">▼</span></span>
                ) : item}
              </span>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}