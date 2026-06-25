'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AddToCartButton({ productId }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  const handleAddToCart = async () => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('amazon_token');

    if (!token) {
      const currentPath =
        window.location.pathname + window.location.search;

      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    try {
      const response = await axios.post(
        '/api/cart',
        {
          product_id: productId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (!data.success) {
        setError(data.message || 'Failed to add item to cart.');
        setLoading(false);
        return;
      }

      // Success feedback
      setAdded(true);

      // Update Navbar cart count
      window.dispatchEvent(new Event('cart-updated'));

      setTimeout(() => {
        setAdded(false);
      }, 2500);

      setLoading(false);

      // If you want to redirect to cart after adding, uncomment:
      // router.push('/cart');
    } catch (err) {
      console.error(err);

      const msg =
        err.response?.data?.message ||
        'Network error. Please try again.';

      setError(msg);
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    const token = localStorage.getItem('amazon_token');

    if (!token) {
      const currentPath =
        window.location.pathname + window.location.search;

      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    router.push(`/checkout?id=${productId}&quantity=${quantity}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs font-semibold">
        <span className="text-gray-500">Quantity:</span>

        <select
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="bg-white border border-gray-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer shadow-2xs font-bold text-gray-800"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </div>

      <div className="space-y-3 pt-2">
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className={`w-full py-2.5 rounded-full transition-all border shadow-xs text-sm cursor-pointer hover:shadow active:scale-[0.98] disabled:opacity-60 font-semibold flex items-center justify-center gap-1.5 ${
            added
              ? 'bg-green-600 border-green-700 text-white hover:bg-green-700'
              : 'bg-[#FFD814] border-[#FCD200] hover:bg-[#F7CA00] text-gray-900'
          }`}
        >
          {loading
            ? 'Adding...'
            : added
            ? '✓ Added to Cart'
            : 'Add to Cart'}
        </button>

        <button
          onClick={handleBuyNow}
          className="w-full bg-[#FFA41C] hover:bg-[#FA8900] text-gray-900 py-2.5 rounded-full transition-all border border-[#FF8F00] shadow-xs text-sm cursor-pointer hover:shadow active:scale-[0.98] font-semibold"
        >
          Buy Now
        </button>
      </div>

      {error && (
        <p className="text-red-600 text-xs text-center font-semibold mt-2">
          {error}
        </p>
      )}
    </div>
  );
}