'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, Calendar, MapPin, FileText, HelpCircle } from 'lucide-react';
import axios from 'axios';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'AMZ-9284-4820';
  const [shippingAddress, setShippingAddress] = useState('John Doe, Madurai, TN - 625018');

  useEffect(() => {
    if (!orderId || orderId === 'AMZ-9284-4820') return;

    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('amazon_token');
        if (!token) return;

        const response = await axios.get('/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          const matchedOrder = response.data.orders.find(o => o.id.toString() === orderId);
          if (matchedOrder && matchedOrder.shipping_address) {
            setShippingAddress(matchedOrder.shipping_address);
          }
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-[#EAEDED] flex flex-col select-none font-sans">
      
      {/* Mini Success Header */}
      <header className="bg-white border-b border-gray-250 py-3.5 px-6 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-baseline shrink-0">
            <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">amazon</span>
            <span className="text-sm font-bold text-[#FF9900]">.in</span>
          </Link>
          <div className="text-xs font-bold text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg uppercase tracking-wider">
            Order Complete
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow max-w-2xl mx-auto w-full px-4 py-12 flex flex-col items-center">
        
        {/* Success Card */}
        <div className="bg-white rounded-md border border-gray-200 shadow-sm p-8 w-full text-center relative overflow-hidden transition-all duration-300">

          {/* Animated Success Checkmark */}
          <div className="inline-flex items-center justify-center bg-green-50 text-green-600 rounded-full w-20 h-20 mb-6 relative animate-pulse shadow-xs border border-green-150">
            <Check size={36} className="stroke-[3]" />
            <span className="absolute inset-0 rounded-full border-4 border-green-500/20 animate-ping"></span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Order Placed Successfully!
          </h1>
          
          <p className="text-gray-400 text-xs md:text-sm mb-8 max-w-sm mx-auto font-semibold leading-relaxed">
            Thank you for your purchase. We are preparing your order and will notify you when it ships.
          </p>

          {/* Details Box */}
          <div className="bg-gray-55/40 rounded-2xl p-5 border border-gray-100 mb-8 text-left space-y-4 max-w-lg mx-auto text-xs sm:text-sm font-semibold text-gray-600">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 flex items-center gap-1.5"><FileText size={14} className="text-gray-400" /> Order ID:</span>
              <span className="font-mono font-bold text-gray-800">#{orderId}</span>
            </div>
            
            <div className="flex justify-between items-center border-t border-gray-200/60 pt-3.5">
              <span className="text-gray-400 flex items-center gap-1.5"><Calendar size={14} className="text-gray-400" /> Estimated Delivery:</span>
              <span className="font-extrabold text-green-700">Tomorrow, by 10:00 AM</span>
            </div>

            <div className="flex justify-between items-start border-t border-gray-200/60 pt-3.5">
              <span className="text-gray-400 flex items-center gap-1.5 mt-0.5"><MapPin size={14} className="text-gray-400" /> Shipping Address:</span>
              <span className="font-bold text-gray-800 text-right max-w-[200px] truncate sm:max-w-xs">{shippingAddress}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/" className="w-full sm:w-auto">
              <button className="w-full sm:w-60 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-normal py-2.5 px-6 rounded-full border border-[#FCD200] transition-all shadow-xs cursor-pointer text-sm active:scale-[0.98] select-none">
                Continue Shopping
              </button>
            </Link>
            
            <Link href="/orders" className="w-full sm:w-auto">
              <button className="w-full sm:w-44 bg-white hover:bg-gray-50 text-gray-900 font-normal py-2.5 px-6 rounded-full border border-gray-300 transition-all shadow-3xs text-sm cursor-pointer select-none active:scale-[0.98]">
                View Your Orders
              </button>
            </Link>
          </div>

        </div>

        {/* Info text */}
        <p className="text-[11px] text-gray-400 text-center mt-6 max-w-sm leading-relaxed font-semibold flex items-center gap-1 justify-center flex-wrap">
          <HelpCircle size={12} className="text-gray-400 shrink-0" />
          <span>Need help?</span>
          <span className="text-[#007185] hover:text-[#C45500] hover:underline cursor-pointer">Contact Customer Support</span>
          <span>or go to</span>
          <span className="text-[#007185] hover:text-[#C45500] hover:underline cursor-pointer">Your Account</span>.
        </p>

      </main>

      {/* Mini Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 px-4 text-center text-xs text-gray-400 mt-12">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-semibold">
          <p>© 1996-{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates</p>
          <div className="flex gap-4 text-gray-500">
            <span className="hover:underline hover:text-gray-800 cursor-pointer">Conditions of Use</span>
            <span className="hover:underline hover:text-gray-800 cursor-pointer">Privacy Notice</span>
            <span className="hover:underline hover:text-gray-800 cursor-pointer">Interest-Based Ads</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 font-semibold text-sm">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
