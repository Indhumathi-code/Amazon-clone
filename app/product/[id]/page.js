import pool from '../../../lib/db';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { Star, Truck, ShieldCheck, Lock, Check, Gift, Tag, ChevronDown } from 'lucide-react';
import { getProductImage } from '../../../lib/utils';
import AddToCartButton from './AddToCartButton';

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-55">
          <h1 className="text-xl font-bold text-red-650">Product ID missing</h1>
        </div>
        <Footer />
      </>
    );
  }

  let product = null;
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    product = rows[0];
  } catch (err) {
    console.error('Error fetching product:', err);
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-55 p-6 select-none">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h1>
          <p className="text-gray-500 mb-5 text-sm">The product with ID {id} does not exist in our catalog.</p>
          <Link href="/">
            <button className="bg-yellow-450 hover:bg-yellow-500 text-gray-905 font-bold px-5 py-2 rounded-lg shadow-xs cursor-pointer text-xs">
              Go Back Home
            </button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const discount = product.original_price
    ? Math.round(
        ((product.original_price - product.price) /
          product.original_price) *
          100
      )
    : null;

  const ratingValue = Number(product.rating || 4);

  // Helper for rendering star ratings
  const renderStars = (rating) => {
    const stars = [];
    const floor = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.4;

    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(
          <Star key={i} size={15} className="fill-[#F5A623] stroke-[#F5A623]" />
        );
      } else if (i === floor + 1 && hasHalf) {
        stars.push(
          <div key={i} className="relative flex items-center">
            <Star size={15} className="stroke-gray-200 fill-gray-100" />
            <div className="absolute top-0 left-0 w-[50%] overflow-hidden">
              <Star size={15} className="fill-[#F5A623] stroke-[#F5A623]" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} size={15} className="stroke-gray-200 fill-gray-100" />
        );
      }
    }
    return stars;
  };

  const imageSrc = getProductImage(product);

  // Generate secondary images for the side gallery
  const sideImages = [
    imageSrc,
    imageSrc,
    imageSrc,
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col select-none">
      <Navbar />

      {/* Main product container */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-6 w-full font-sans">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-6 flex gap-1.5 items-center flex-wrap">
          <Link href="/" className="hover:underline hover:text-[#C45500] font-semibold">Home</Link>
          <span className="text-gray-400">/</span>
          <span className="hover:underline hover:text-[#C45500] cursor-pointer font-semibold">{product.category || 'Product'}</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600 truncate max-w-[200px] sm:max-w-xs">{product.title}</span>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 1. Left Gallery (lg:col-span-5) */}
          <div className="lg:col-span-5 flex gap-4">
            {/* Gallery Thumbnails */}
            <div className="flex flex-col gap-2.5 shrink-0">
              {sideImages.map((img, index) => (
                <div 
                  key={index} 
                  className={`w-12 h-12 border p-1 rounded-lg cursor-pointer hover:border-amber-500 bg-gray-50/50 flex items-center justify-center transition-all ${index === 0 ? 'border-amber-500 ring-1 ring-amber-400' : 'border-gray-200'}`}
                >
                  <img src={img} alt="thumbnail" className="max-h-full max-w-full object-contain" />
                </div>
              ))}
              <div className="w-12 h-12 border border-gray-200 p-1 rounded-lg cursor-pointer hover:border-amber-500 bg-gray-50/50 flex flex-col items-center justify-center text-[9px] text-gray-400 font-bold leading-tight uppercase">
                <span>5+</span>
                <span>photos</span>
              </div>
            </div>

            {/* Main Image View */}
            <div className="flex-1 border border-gray-200 rounded-lg p-6 bg-white flex items-center justify-center h-[320px] sm:h-[400px] lg:h-[450px]">
              <img
                src={imageSrc}
                alt={product.title}
                className="max-h-full max-w-full object-contain hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </div>

          {/* 2. Middle Details (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-5">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 leading-snug">
                {product.title}
              </h1>
              <div className="text-[#007185] text-xs font-semibold mt-1.5 hover:text-[#C45500] hover:underline cursor-pointer">
                Visit the Store
              </div>
            </div>

            {/* Ratings block */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-0.5">
                {renderStars(ratingValue)}
              </div>
              <span className="text-[#007185] hover:text-[#C45500] hover:underline cursor-pointer font-bold">
                {product.rating || '4.0'} rating
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-[#007185] hover:text-[#C45500] hover:underline cursor-pointer font-semibold">
                {Number(product.reviews || 80).toLocaleString()} reviews
              </span>
            </div>

            {product.badge && (
              <div className="bg-red-650 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md w-fit uppercase tracking-wider shadow-xs">
                {product.badge}
              </div>
            )}

            <hr className="border-gray-100" />

            {/* Pricing Details */}
            <div className="space-y-1.5">
              <div className="flex items-baseline gap-2 flex-wrap">
                {discount && (
                  <span className="text-red-600 text-3xl font-light">-{discount}%</span>
                )}
                <span className="text-3xl font-bold text-gray-900">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
              </div>

              {product.original_price && (
                <div className="text-xs text-gray-500 font-medium">
                  M.R.P.: <span className="line-through">₹{Number(product.original_price).toLocaleString('en-IN')}</span>
                </div>
              )}
              
              <div className="text-xs text-gray-800 font-semibold bg-gray-50 px-2 py-1 rounded w-fit border border-gray-100">
                Inclusive of all taxes
              </div>
              <div className="text-xs text-gray-650">
                <span className="font-bold text-gray-850">EMI</span> starts at ₹{Math.round(product.price / 12).toLocaleString('en-IN')}/month. <span className="text-[#007185] hover:underline cursor-pointer font-bold">EMI options ▼</span>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Bank/Promo Offers */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Tag size={14} className="text-amber-500" />
                Offers & Promotions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border border-gray-200 rounded-lg p-3.5 text-xs hover:shadow-xs transition-all cursor-pointer bg-white">
                  <p className="font-bold text-gray-900">Bank Offer</p>
                  <p className="text-gray-500 mt-1 leading-snug">Upto ₹3,000 discount on select credit cards</p>
                  <p className="text-[#007185] hover:text-[#C45500] font-bold mt-2 flex items-center gap-0.5">33 offers <ChevronDown size={12} /></p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3.5 text-xs hover:shadow-xs transition-all cursor-pointer bg-white">
                  <p className="font-bold text-gray-900">No Cost EMI</p>
                  <p className="text-gray-500 mt-1 leading-snug">Interest savings on Amazon Pay ICICI Card</p>
                  <p className="text-[#007185] hover:text-[#C45500] font-bold mt-2 flex items-center gap-0.5">4 offers <ChevronDown size={12} /></p>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Product description / Highlights */}
            <div className="space-y-2">
              <p className="font-bold text-sm text-gray-900">About this item</p>
              <ul className="list-disc pl-4 space-y-2 text-xs text-gray-650 leading-relaxed font-medium">
                <li>High efficiency copper condenser for energy efficiency and faster cooling.</li>
                <li>Multiple working modes with dust filters and anti-corrosive coating protection.</li>
                <li>Digital smart control and remote options for automated temperature regulation.</li>
                <li>Includes comprehensive 1-year product warranty and 10-year compressor warranty.</li>
              </ul>
            </div>
          </div>

          {/* 3. Right Buy Box (lg:col-span-3) */}
          <div className="lg:col-span-3 w-full">
            <div className="border border-gray-200 rounded-lg p-5 bg-white space-y-4 shadow-xs">
              
              {/* Buy Box Price */}
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </p>
                <div className="text-xs text-[#007185] font-semibold mt-1 leading-snug">
                  FREE scheduled delivery as soon as tomorrow.
                </div>
              </div>

              {/* Delivery Details */}
              <div className="text-xs text-gray-500 flex items-start gap-1.5 border-t border-b border-gray-100 py-3">
                <Truck size={15} className="text-gray-400 shrink-0 mt-0.5" />
                <div>
                  Delivering to <span className="font-bold text-gray-800">Madurai 625018</span>
                  <p className="text-[#007185] font-semibold mt-0.5 hover:underline cursor-pointer">Update location</p>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <p className="text-green-700 font-extrabold text-base flex items-center gap-1">
                  <Check size={16} className="stroke-[3]" />
                  In stock
                </p>
                <p className="text-[11px] text-gray-500 leading-snug">Sold by App-Retail Private Limited and Fulfilled by Amazon.</p>
              </div>

              <AddToCartButton productId={product.id} />

              {/* Security info */}
              <div className="text-[11px] text-gray-550 border-t border-gray-100 pt-3 space-y-1.5 font-medium">
                <div className="flex justify-between items-center">
                  <span>Ships from:</span>
                  <span className="font-bold text-gray-800">Amazon</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Payment:</span>
                  <span className="font-bold text-[#007185] flex items-center gap-0.5 hover:underline cursor-pointer">
                    <Lock size={10} /> Secure transaction
                  </span>
                </div>
              </div>

              {/* Protection checkbox */}
              <div className="text-[11px] border-t border-gray-100 pt-3">
                <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-semibold select-none">
                  <input type="checkbox" className="rounded border-gray-300 text-amber-500 focus:ring-amber-400 h-3.5 w-3.5" />
                  <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-green-600" /> Add Protection Plan</span>
                </label>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}