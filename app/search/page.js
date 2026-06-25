import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import { ChevronRight, Star } from 'lucide-react';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const category = resolvedParams?.category || '';
  const q = resolvedParams?.q || '';

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  let products = [];
  try {
    const res = await axios.get(`${apiUrl}/api/products`, {
      params: { category, q }
    });
    if (res.data && res.data.success) {
      products = res.data.products;
    }
  } catch (err) {
    console.error('Error fetching products for search page:', err);
  }

  const resultText = category ? category : (q ? `"${q}"` : 'All Products');

  return (
    <div className="bg-white min-h-screen flex flex-col select-none font-sans">
      <Navbar />

      {/* Sub-navbar showing result counts */}
      <div className="bg-white shadow-sm border-b border-gray-200 py-2 px-4 md:px-6 text-sm text-gray-700 shadow-b-md">
        <div className="max-w-[1500px] mx-auto font-medium flex items-center">
          <span>{products.length} results for </span>
          <span className="text-red-700 font-bold ml-1">{resultText}</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex-grow max-w-[1500px] mx-auto w-full flex flex-col md:flex-row mt-4 mb-8">
        
        {/* Left Sidebar (Filters) */}
        <aside className="w-full md:w-[260px] shrink-0 px-4 md:px-6 md:border-r border-gray-200 mb-6 md:mb-0">
          <div className="space-y-5">
            
            {/* Delivery Filter */}
            <div className="text-sm">
              <h3 className="font-bold text-gray-900 mb-2">Eligible for Free Shipping</h3>
              <label className="flex items-center gap-2 cursor-pointer text-gray-800 hover:text-[#C45500]">
                <input type="checkbox" className="rounded border-gray-300 w-4 h-4 text-amber-500 focus:ring-amber-400" />
                <span className="font-medium">Free Shipping</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 pl-6">Get FREE Shipping on eligible orders shipped by Amazon</p>
            </div>

            {/* Category Filter */}
            <div className="text-sm">
              <h3 className="font-bold text-gray-900 mb-2">Category</h3>
              <div className="flex flex-col gap-1.5 text-gray-800">
                <Link href="/search?category=Deals" className={`hover:text-[#C45500] hover:underline flex items-center gap-1 ${category === 'Deals' ? 'font-bold text-gray-900' : ''}`}>
                  <ChevronRight size={14} className="text-gray-500" /> Deals
                </Link>
                <Link href="/search?category=Appliances" className={`hover:text-[#C45500] hover:underline flex items-center gap-1 ${category === 'Appliances' ? 'font-bold text-gray-900' : ''}`}>
                  <ChevronRight size={14} className="text-gray-500" /> Appliances
                </Link>
                <Link href="/search?category=HomeStyle" className={`hover:text-[#C45500] hover:underline flex items-center gap-1 ${category === 'HomeStyle' ? 'font-bold text-gray-900' : ''}`}>
                  <ChevronRight size={14} className="text-gray-500" /> Home & Kitchen
                </Link>
                <Link href="/search?category=Electronics" className={`hover:text-[#C45500] hover:underline flex items-center gap-1 ${category === 'Electronics' ? 'font-bold text-gray-900' : ''}`}>
                  <ChevronRight size={14} className="text-gray-500" /> Electronics
                </Link>
              </div>
            </div>

            {/* Brands Filter */}
            <div className="text-sm">
              <h3 className="font-bold text-gray-900 mb-2">Brands</h3>
              <div className="flex flex-col gap-2">
                {['Samsung', 'LG', 'Panasonic', 'AmazonBasics', 'Godrej', 'IFB'].map(brand => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer text-gray-800 hover:text-[#C45500]">
                    <input type="checkbox" className="rounded border-gray-300 w-4 h-4 text-amber-500 focus:ring-amber-400" />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="text-sm">
              <h3 className="font-bold text-gray-900 mb-2">Customer Reviews</h3>
              <div className="flex flex-col gap-1.5 cursor-pointer">
                <div className="flex items-center gap-1 hover:text-[#C45500]">
                  <div className="flex"><Star size={14} className="fill-[#F5A623] stroke-[#F5A623]"/><Star size={14} className="fill-[#F5A623] stroke-[#F5A623]"/><Star size={14} className="fill-[#F5A623] stroke-[#F5A623]"/><Star size={14} className="fill-[#F5A623] stroke-[#F5A623]"/><Star size={14} className="stroke-gray-300 fill-transparent"/></div>
                  <span className="text-xs">& Up</span>
                </div>
                <div className="flex items-center gap-1 hover:text-[#C45500]">
                  <div className="flex"><Star size={14} className="fill-[#F5A623] stroke-[#F5A623]"/><Star size={14} className="fill-[#F5A623] stroke-[#F5A623]"/><Star size={14} className="fill-[#F5A623] stroke-[#F5A623]"/><Star size={14} className="stroke-gray-300 fill-transparent"/><Star size={14} className="stroke-gray-300 fill-transparent"/></div>
                  <span className="text-xs">& Up</span>
                </div>
              </div>
            </div>

            {/* Item Condition */}
            <div className="text-sm">
              <h3 className="font-bold text-gray-900 mb-2">Item Condition</h3>
              <label className="flex items-center gap-2 cursor-pointer text-gray-800 hover:text-[#C45500]">
                <input type="checkbox" className="rounded border-gray-300 w-4 h-4 text-amber-500 focus:ring-amber-400" />
                <span>New</span>
              </label>
            </div>

          </div>
        </aside>

        {/* Right Content Area (Products Grid) */}
        <main className="flex-1 px-4 md:px-2 w-full">
          <div className="mb-4 pb-2 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Results</h2>
            <p className="text-sm text-gray-500 mt-1">Check each product page for other buying options.</p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">No results for {resultText}</h3>
              <p className="text-gray-600">Try checking your spelling or use more general terms</p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
