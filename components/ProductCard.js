'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, ShoppingCart } from 'lucide-react';
import { getProductImage } from '../lib/utils';
import axios from 'axios';

export default function ProductCard({ product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const discount = product.original_price
    ? Math.round(
        ((product.original_price - product.price) /
          product.original_price) *
          100
      )
    : null;

  const ratingValue = Number(product.rating || 4);

  // Render star ratings using Lucide vector icons
  const renderStars = (rating) => {
    const stars = [];
    const floor = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.4;

    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(
          <Star key={i} size={14} className="fill-[#F5A623] stroke-[#F5A623]" />
        );
      } else if (i === floor + 1 && hasHalf) {
        stars.push(
          <div key={i} className="relative flex items-center">
            <Star size={14} className="stroke-gray-200 fill-gray-100" />
            <div className="absolute top-0 left-0 w-[50%] overflow-hidden">
              <Star size={14} className="fill-[#F5A623] stroke-[#F5A623]" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} size={14} className="stroke-gray-200 fill-gray-100" />
        );
      }
    }
    return stars;
  };

  const imageSrc = getProductImage(product);

  return (
    <div className="group bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-[380px] relative select-none">
      
      {/* Product Category Badge */}
      {product.badge && (
        <span className="absolute top-3 left-3 text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-md font-bold z-10 shadow-xs uppercase tracking-wider">
          {product.badge}
        </span>
      )}

      {/* Image container with hover scaling */}
      <Link
        href={`/product/${product.id}`}
        className="h-40 flex items-center justify-center mb-4 bg-gray-50/50 rounded-lg p-3 relative overflow-hidden shrink-0"
      >
        <img
          src={imageSrc}
          alt={product.title}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/placeholder.png';
          }}
        />
      </Link>

      {/* Product Title */}
      <div className="flex-grow flex flex-col justify-between">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3
              className="text-xs md:text-sm font-semibold text-gray-800 hover:text-[#C45500] hover:underline leading-snug line-clamp-2"
              title={product.title}
            >
              {product.title}
            </h3>
          </Link>

          {/* Ratings Block */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center">
              {renderStars(ratingValue)}
            </div>
            <span className="text-[11px] text-[#007185] hover:text-[#C45500] hover:underline cursor-pointer">
              ({Number(product.reviews || 80).toLocaleString()})
            </span>
          </div>
        </div>

        {/* Pricing Details */}
        <div className="mt-3">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base md:text-lg font-bold text-gray-900">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>

            {product.original_price && (
              <>
                <span className="text-[11px] text-gray-400 line-through">
                  ₹{Number(product.original_price).toLocaleString('en-IN')}
                </span>

                {discount && (
                  <span className="text-[11px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded-sm">
                    {discount}% off
                  </span>
                )}
              </>
            )}
          </div>

          {/* Prime Tag */}
          {product.badge === 'Prime' && (
            <div className="text-[#007185] text-[10px] font-extrabold mt-1 tracking-wider uppercase">
              ✦ prime
            </div>
          )}
        </div>
      </div>

      {/* Action Add-to-Cart Button */}
      <button
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();

          const token = localStorage.getItem('amazon_token');
          if (!token) {
            const currentPath = window.location.pathname + window.location.search;
            router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
            return;
          }

          setLoading(true);
          try {
            const response = await axios.post('/api/cart', {
              product_id: product.id,
              quantity: 1
            }, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if (response.data.success) {
              setAdded(true);
              window.dispatchEvent(new Event('cart-updated'));
              setTimeout(() => setAdded(false), 2000);
            } else {
              alert(response.data.message || 'Failed to add item to cart.');
            }
          } catch (err) {
            console.error(err);
            alert('Failed to add item to cart. Please try again.');
          } finally {
            setLoading(false);
          }
        }}
        disabled={loading}
        className={`mt-4 text-xs font-semibold py-2 rounded-lg w-full transition-all border shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] select-none hover:shadow ${
          added
            ? 'bg-green-600 border-green-700 text-white hover:bg-green-700 hover:border-green-800'
            : 'bg-[#FFD814] border-[#FCD200] hover:bg-[#F7CA00] text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed'
        }`}
      >
        {loading ? (
          'Adding...'
        ) : added ? (
          <>✓ Added!</>
        ) : (
          <>
            <ShoppingCart size={13} />
            Add to Cart
          </>
        )}
      </button>

    </div>
  );
}