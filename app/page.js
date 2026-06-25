import pool from '../lib/db';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import Footer from '../components/Footer';
import { getProductImage } from '../lib/utils';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products = [];
  try {
    const [rows] = await pool.execute('SELECT * FROM products');
    products = rows;
  } catch (err) {
    console.error('Error fetching products from database in HomePage:', err);
  }

  // Group products by correct seeded categories in database
  const deals = products.filter(p => p.category === 'Deals').slice(0, 4);
  const appliances = products.filter(p => p.category === 'Appliances').slice(0, 4);
  const homestyle = products.filter(p => p.category === 'HomeStyle').slice(0, 4);

  const featuredProduct1 = products.find(p => p.id === 3) || products[0];
  const featuredProduct2 = products.find(p => p.id === 2) || products[0];
  const featuredProduct3 = products.find(p => p.id === 5) || products[0];

  return (
    <div className="bg-[#EAEDED] min-h-screen select-none">
      <Navbar />
      <HeroBanner />

      {/* Category Cards Section - Overlaps Hero Banner */}
      <div className="max-w-[1500px] mx-auto px-4 md:px-6 -mt-16 md:-mt-36 relative z-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Card 1: Continue shopping deals */}
        <div className="bg-white p-5 rounded-xs border border-gray-200/60 shadow-xs flex flex-col justify-between min-h-[420px] transition-all hover:-translate-y-0.5 duration-200">
          <div>
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3.5 tracking-tight leading-tight">Continue shopping deals</h2>
            {deals.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {deals.map((item) => (
                  <Link key={item.id} href={`/search?category=Deals`} className="group cursor-pointer block">
                    <div className="h-28 bg-[#f3f3f3]/60 flex items-center justify-center p-3 rounded-xs border border-gray-100/50 group-hover:shadow-2xs transition-shadow">
                      <img
                        src={getProductImage(item)}
                        alt={item.title}
                        className="max-h-full max-w-full object-contain group-hover:scale-102 transition-transform duration-200"
                      />
                    </div>
                    <p className="text-[11px] text-gray-550 font-semibold mt-1 leading-tight group-hover:text-amber-600 line-clamp-1">
                      {item.title.split(' ')[0]} {item.title.split(' ')[1] || ''}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 font-medium">No deals available</p>
            )}
          </div>
          <Link href={`/search?category=Deals`} className="text-xs text-[#007185] hover:text-[#C45500] hover:underline mt-4 inline-block font-semibold">
            See more deals
          </Link>
        </div>

        {/* Card 2: Appliances for your home */}
        <div className="bg-white p-5 rounded-xs border border-gray-200/60 shadow-xs flex flex-col justify-between min-h-[420px] transition-all hover:-translate-y-0.5 duration-200">
          <div>
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3.5 tracking-tight leading-tight">Appliances for your home | Up to 55% off</h2>
            {appliances.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {appliances.map((item) => {
                  let shortLabel = 'Appliance';
                  if (item.title.includes('AC')) shortLabel = 'Air conditioners';
                  else if (item.title.includes('Refrigerator')) shortLabel = 'Refrigerators';
                  else if (item.title.includes('Microwave')) shortLabel = 'Microwaves';
                  else if (item.title.includes('Washing')) shortLabel = 'Washing machines';

                  return (
                    <Link key={item.id} href={`/search?category=Appliances`} className="group cursor-pointer block">
                      <div className="h-28 bg-[#f3f3f3]/60 flex items-center justify-center p-3 rounded-xs border border-gray-100/50 group-hover:shadow-2xs transition-shadow">
                        <img
                          src={getProductImage(item)}
                          alt={item.title}
                          className="max-h-full max-w-full object-contain group-hover:scale-102 transition-transform duration-200"
                        />
                      </div>
                      <p className="text-[11px] text-gray-550 font-semibold mt-1 leading-tight group-hover:text-amber-600 line-clamp-1">
                        {shortLabel}
                      </p>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-400 font-medium">No appliances available</p>
            )}
          </div>
          <Link href={`/search?category=Appliances`} className="text-xs text-[#007185] hover:text-[#C45500] hover:underline mt-4 inline-block font-semibold">
            See more
          </Link>
        </div>

        {/* Card 3: Revamp your home in style */}
        <div className="bg-white p-5 rounded-xs border border-gray-200/60 shadow-xs flex flex-col justify-between min-h-[420px] transition-all hover:-translate-y-0.5 duration-200">
          <div>
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3.5 tracking-tight leading-tight">Revamp your home in style</h2>
            {homestyle.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {homestyle.map((item) => {
                  let shortLabel = 'Decor';
                  if (item.title.toLowerCase().includes('cushion')) shortLabel = 'Cushion covers, bedsheets';
                  else if (item.title.toLowerCase().includes('figurines')) shortLabel = 'Figurines & vases';
                  else if (item.title.toLowerCase().includes('storage')) shortLabel = 'Home storage';
                  else if (item.title.toLowerCase().includes('lighting')) shortLabel = 'Lighting solutions';

                  return (
                    <Link key={item.id} href={`/search?category=HomeStyle`} className="group cursor-pointer block">
                      <div className="h-28 bg-[#f3f3f3]/60 flex items-center justify-center p-3 rounded-xs border border-gray-100/50 group-hover:shadow-2xs transition-shadow">
                        <img
                          src={getProductImage(item)}
                          alt={item.title}
                          className="max-h-full max-w-full object-contain group-hover:scale-102 transition-transform duration-200"
                        />
                      </div>
                      <p className="text-[11px] text-gray-550 font-semibold mt-1 leading-tight group-hover:text-amber-600 line-clamp-1">
                        {shortLabel}
                      </p>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-400 font-medium">No products available</p>
            )}
          </div>
          <Link href={`/search?category=HomeStyle`} className="text-xs text-[#007185] hover:text-[#C45500] hover:underline mt-4 inline-block font-semibold">
            Explore all
          </Link>
        </div>

        {/* Card 4: Sign in / Registration + Banner */}
        <div className="flex flex-col gap-5 min-h-[420px]">

          {/* Top Block: Sign In */}
          <div className="bg-white p-5 rounded-xs border border-gray-200/60 shadow-xs text-center flex flex-col justify-center flex-1">
            <h2 className="text-sm font-bold text-gray-800 mb-3 tracking-tight leading-snug">Sign in for your best experience</h2>
            <Link href="/login">
              <button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] text-gray-900 text-xs font-bold py-2.5 rounded-lg border border-[#FCD200] shadow-2xs hover:shadow transition-all cursor-pointer">
                Sign in securely
              </button>
            </Link>
          </div>

          {/* Bottom Block: Banner Offer */}
          <div className="bg-[#FFF8F0] p-5 rounded-xs border border-amber-100 shadow-xs relative overflow-hidden flex flex-col justify-between h-[235px] group cursor-pointer transition-all duration-200 hover:shadow-sm">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-900 font-extrabold text-sm tracking-tight"> iPhone</span>
                <span className="text-gray-500 text-xs font-semibold">Air</span>
              </div>
              <p className="text-xs text-gray-700 mt-1 font-bold">The thinnest iPhone ever.</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Exciting launch offers*</p>
            </div>

            {/* Center Product Image */}
            <div className="flex-1 flex items-center justify-center py-2">
              <img
                src="/iphone_air.png"
                alt="iPhone Air"
                className="max-h-24 object-contain group-hover:scale-102 transition-transform duration-200"
              />
            </div>

            <span className="text-[11px] text-[#007185] font-bold group-hover:text-[#C45500] group-hover:underline transition-colors mt-2">
              Shop now
            </span>
          </div>

        </div>

      </div>

      {/* Related to items you've viewed */}
      {products.length > 0 && (
        <div className="max-w-[1500px] mx-auto px-4 md:px-6 mt-6 relative z-20">
          <div className="bg-white p-5 rounded-xs border border-gray-200/60 shadow-xs">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-base md:text-lg font-bold text-gray-900 tracking-tight">Related to items you&apos;ve viewed</h2>
              <Link href="/search?category=Deals" className="text-xs text-[#007185] hover:text-[#C45500] hover:underline font-bold">
                See more
              </Link>
            </div>
            {/* Horizontal Scroll Area */}
            <div className="flex gap-5 overflow-x-auto pb-4 pt-2 no-scrollbar">
              {products.map((item) => (
                <Link key={item.id} href={`/product/${item.id}`} className="flex-none w-48 group cursor-pointer block">
                  <div className="h-36 bg-[#f3f3f3]/60 flex items-center justify-center p-4 rounded-xs border border-gray-100 hover:shadow-2xs transition-shadow duration-200">
                    <img
                      src={getProductImage(item)}
                      alt={item.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-102 transition-transform duration-200"
                    />
                  </div>
                  <p className="text-[11px] text-gray-550 font-semibold mt-2 leading-snug group-hover:text-[#C45500] group-hover:underline line-clamp-2">
                    {item.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Second Row of Category Cards */}
      <div className="max-w-[1500px] mx-auto px-4 md:px-6 mt-6 relative z-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Card 1: Keep shopping for */}
        <div className="bg-white p-5 rounded-xs border border-gray-200/60 shadow-xs flex flex-col justify-between min-h-[420px] transition-all hover:-translate-y-0.5 duration-200">
          <div>
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3.5 tracking-tight leading-tight">Keep shopping for</h2>
            {homestyle.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {homestyle.map((item) => (
                  <Link key={item.id} href={`/product/${item.id}`} className="group cursor-pointer flex flex-col justify-between h-full block">
                    <div>
                      <div className="h-28 bg-[#f3f3f3]/60 flex items-center justify-center p-3 rounded-xs border border-gray-100 group-hover:shadow-2xs transition-shadow">
                        <img
                          src={getProductImage(item)}
                          alt={item.title}
                          className="max-h-full max-w-full object-contain group-hover:scale-102 transition-transform duration-200"
                        />
                      </div>
                      <p className="text-[11px] text-gray-550 font-semibold mt-1 leading-tight group-hover:text-amber-600 line-clamp-1">
                        {item.title.split(' ')[0]} {item.title.split(' ')[1] || ''}
                      </p>
                    </div>
                    <p className="text-xs font-bold text-gray-950 mt-1 animate-pulse">₹{Math.round(item.price).toLocaleString('en-IN')}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 font-medium">No products available</p>
            )}
          </div>
          <Link href={`/search?category=HomeStyle`} className="text-xs text-[#007185] hover:text-[#C45500] hover:underline mt-4 inline-block font-semibold">
            See more
          </Link>
        </div>

        {/* Card 2: Continue shopping for */}
        <div className="bg-white p-5 rounded-xs border border-gray-200/60 shadow-xs flex flex-col justify-between min-h-[420px] transition-all hover:-translate-y-0.5 duration-200">
          {featuredProduct1 ? (
            <div className="flex flex-col justify-between h-full">
              <div>
                <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3.5 tracking-tight leading-tight">Continue shopping for</h2>
                <Link href={`/product/${featuredProduct1.id}`} className="group cursor-pointer block">
                  <div className="h-44 bg-[#f3f3f3]/60 flex items-center justify-center p-4 rounded-xs border border-gray-100 hover:shadow-2xs transition-shadow duration-200">
                    <img
                      src={getProductImage(featuredProduct1)}
                      alt={featuredProduct1.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-102 transition-transform duration-200"
                    />
                  </div>
                  <p className="text-xs text-gray-750 font-semibold mt-2.5 leading-snug group-hover:text-[#C45500] group-hover:underline line-clamp-2">
                    {featuredProduct1.title}
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-base font-bold text-gray-900">₹{Math.round(featuredProduct1.price).toLocaleString('en-IN')}</span>
                    {featuredProduct1.original_price && (
                      <span className="text-[11px] text-gray-450 line-through font-medium">M.R.P.: ₹{Math.round(featuredProduct1.original_price).toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </Link>
              </div>

              <div className="mt-3">
                <div className="flex gap-2.5">
                  {deals.map((thumb) => (
                    <Link
                      key={thumb.id}
                      href={`/product/${thumb.id}`}
                      className={`w-10 h-10 border rounded p-1 flex items-center justify-center bg-white transition-all duration-200 ${thumb.id === featuredProduct1.id ? 'border-[#007185] ring-1 ring-[#007185] scale-105 shadow-2xs' : 'border-gray-200 hover:border-gray-400'}`}
                    >
                      <img src={getProductImage(thumb)} alt="" className="max-h-full max-w-full object-contain" />
                    </Link>
                  ))}
                </div>
                <Link href={`/product/${featuredProduct1.id}`} className="text-xs text-[#007185] hover:text-[#C45500] hover:underline mt-4 inline-block font-semibold">
                  See more
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Loading...</p>
          )}
        </div>

        {/* Card 3: Pick up where you left off */}
        <div className="bg-white p-5 rounded-xs border border-gray-200/60 shadow-xs flex flex-col justify-between min-h-[420px] transition-all hover:-translate-y-0.5 duration-200">
          {featuredProduct2 ? (
            <div className="flex flex-col justify-between h-full">
              <div>
                <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3.5 tracking-tight leading-tight">Pick up where you left off</h2>
                <Link href={`/product/${featuredProduct2.id}`} className="group cursor-pointer block">
                  <div className="h-44 bg-[#f3f3f3]/60 flex items-center justify-center p-4 rounded-xs border border-gray-100 hover:shadow-2xs transition-shadow duration-200">
                    <img
                      src={getProductImage(featuredProduct2)}
                      alt={featuredProduct2.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-102 transition-transform duration-200"
                    />
                  </div>
                  <p className="text-xs text-gray-755 font-semibold mt-2.5 leading-snug group-hover:text-[#C45500] group-hover:underline line-clamp-2">
                    {featuredProduct2.title}
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-base font-bold text-gray-900">₹{Math.round(featuredProduct2.price).toLocaleString('en-IN')}</span>
                    {featuredProduct2.original_price && (
                      <span className="text-[11px] text-gray-450 line-through font-medium">M.R.P.: ₹{Math.round(featuredProduct2.original_price).toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </Link>
              </div>

              <div className="mt-3">
                <div className="flex gap-2.5">
                  {deals.map((thumb) => (
                    <Link
                      key={thumb.id}
                      href={`/product/${thumb.id}`}
                      className={`w-10 h-10 border rounded p-1 flex items-center justify-center bg-white transition-all duration-200 ${thumb.id === featuredProduct2.id ? 'border-[#007185] ring-1 ring-[#007185] scale-105 shadow-2xs' : 'border-gray-200 hover:border-gray-400'}`}
                    >
                      <img src={getProductImage(thumb)} alt="" className="max-h-full max-w-full object-contain" />
                    </Link>
                  ))}
                </div>
                <Link href={`/product/${featuredProduct2.id}`} className="text-xs text-[#007185] hover:text-[#C45500] hover:underline mt-4 inline-block font-semibold">
                  See more
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Loading...</p>
          )}
        </div>

        {/* Card 4: More items to consider */}
        <div className="bg-white p-5 rounded-xs border border-gray-200/60 shadow-xs flex flex-col justify-between min-h-[420px] transition-all hover:-translate-y-0.5 duration-200">
          {featuredProduct3 ? (
            <div className="flex flex-col justify-between h-full">
              <div>
                <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3.5 tracking-tight leading-tight">More items to consider</h2>
                <Link href={`/product/${featuredProduct3.id}`} className="group cursor-pointer block">
                  <div className="h-44 bg-[#f3f3f3]/60 flex items-center justify-center p-4 rounded-xs border border-gray-100 hover:shadow-2xs transition-shadow duration-200">
                    <img
                      src={getProductImage(featuredProduct3)}
                      alt={featuredProduct3.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-102 transition-transform duration-200"
                    />
                  </div>
                  <p className="text-xs text-gray-755 font-semibold mt-2.5 leading-snug group-hover:text-[#C45500] group-hover:underline line-clamp-2">
                    {featuredProduct3.title}
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-base font-bold text-gray-900">₹{Math.round(featuredProduct3.price).toLocaleString('en-IN')}</span>
                    {featuredProduct3.original_price && (
                      <span className="text-[11px] text-gray-455 line-through font-medium">M.R.P.: ₹{Math.round(featuredProduct3.original_price).toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </Link>
              </div>

              <div className="mt-3">
                <div className="flex gap-2.5">
                  {appliances.map((thumb) => (
                    <Link
                      key={thumb.id}
                      href={`/product/${thumb.id}`}
                      className={`w-10 h-10 border rounded p-1 flex items-center justify-center bg-white transition-all duration-200 ${thumb.id === featuredProduct3.id ? 'border-[#007185] ring-1 ring-[#007185] scale-105 shadow-2xs' : 'border-gray-200 hover:border-gray-400'}`}
                    >
                      <img src={getProductImage(thumb)} alt="" className="max-h-full max-w-full object-contain" />
                    </Link>
                  ))}
                </div>
                <Link href={`/product/${featuredProduct3.id}`} className="text-xs text-[#007185] hover:text-[#C45500] hover:underline mt-4 inline-block font-semibold">
                  See more
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Loading...</p>
          )}
        </div>

      </div>
      <Footer />
    </div>
  );
}