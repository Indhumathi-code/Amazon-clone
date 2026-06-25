'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function PlaceOrderButton({ productId, price, shippingAddress, paymentMethod, disabled }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async () => {
    if (!shippingAddress) {
      setError('Please save your delivery address first.');
      return;
    }
    if (!paymentMethod) {
      setError('Please save your payment method first.');
      return;
    }

    setLoading(true);
    setError('');

    const token = localStorage.getItem('amazon_token');
    if (!token) {
      setError('You are not logged in.');
      setLoading(false);
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    try {
      const response = await axios.post('/api/orders', {
        product_id: productId,
        quantity: 1,
        total_price: price,
        shipping_address: shippingAddress,
        payment_method: paymentMethod
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = response.data;

      if (!data.success) {
        setError(data.message || 'Failed to place order.');
        setLoading(false);
        return;
      }

      router.push(`/success?orderId=${data.orderId}`);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Network error. Please try again.';
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      <button
        onClick={handlePlaceOrder}
        disabled={loading || disabled}
        className="w-full bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] text-gray-900 font-normal py-3 rounded-full border border-[#FCD200] transition-all shadow-xs text-sm cursor-pointer hover:shadow active:scale-[0.98] select-none disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center font-semibold"
      >
        {loading ? 'Placing order...' : 'Place your order'}
      </button>
      {error && (
        <p className="text-red-600 text-[11px] text-center font-bold">{error}</p>
      )}
    </div>
  );
}
