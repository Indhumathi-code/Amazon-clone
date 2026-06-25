'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AuthGuard from '../../components/AuthGuard';
import { ShoppingBag, ChevronRight, Package, RefreshCw } from 'lucide-react';
import axios from 'axios';

function OrdersContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('amazon_token');
      if (!token) {
        setError('You are not logged in.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = res.data;

        if (data.success) {
          setOrders(data.orders);
        } else {
          setError(data.message || 'Failed to fetch orders.');
        }
      } catch (err) {
        console.error(err);
        const msg = err.response?.data?.message || 'Failed to fetch orders due to a network error.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="bg-[#EAEDED] min-h-screen flex flex-col select-none font-sans">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-6 flex gap-1.5 items-center">
          <Link href="/" className="hover:underline hover:text-[#C45500] font-semibold">Your Account</Link>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-gray-650 font-bold">Your Orders</span>
        </div>

        <h1 className="text-3xl font-normal text-gray-900 mb-6">Your Orders</h1>

        {loading ? (
          <div className="bg-white rounded-md border border-gray-200 p-12 text-center flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-[3px] border-[#FF9900]/20 border-t-[#FF9900] rounded-full animate-spin"></div>
            <span className="text-sm text-gray-500 font-semibold">Fetching your orders...</span>
          </div>
        ) : error ? (
          <div className="bg-white rounded-md border border-gray-200 p-8 text-center text-red-600 font-semibold text-sm">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-md border border-gray-200 p-12 text-center flex flex-col items-center">
            <div className="bg-gray-50 text-gray-400 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <ShoppingBag size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No orders found</h3>
            <p className="text-gray-500 text-xs sm:text-sm mb-6 max-w-xs leading-relaxed">Looks like you haven&apos;t placed any orders yet. Start exploring our deals!</p>
            <Link href="/">
              <button className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-905 font-bold py-2.5 px-6 rounded-lg transition-colors shadow-xs cursor-pointer text-xs">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });

              return (
                <div key={order.id} className="bg-white rounded-md border border-gray-200 shadow-2xs overflow-hidden">
                  
                  {/* Order Card Header */}
                  <div className="bg-[#F0F2F2] border-b border-gray-200 px-4 py-3.5 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-gray-650">
                    <div>
                      <p className="text-gray-400 uppercase tracking-wider text-[10px] mb-0.5">Order Placed</p>
                      <p className="text-gray-800">{orderDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 uppercase tracking-wider text-[10px] mb-0.5">Total</p>
                      <p className="text-gray-800">₹{Number(order.total_price).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-gray-400 uppercase tracking-wider text-[10px] mb-0.5">Ship To</p>
                      <p className="text-[#007185] hover:text-[#C45500] cursor-pointer hover:underline truncate max-w-[150px]">
                        John Doe
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <p className="text-gray-400 uppercase tracking-wider text-[10px] mb-0.5">Order #</p>
                      <p className="text-gray-800 font-mono">AMZ-{order.id}-{new Date(order.created_at).getTime().toString().slice(-4)}</p>
                    </div>
                  </div>

                  {/* Order Card Body */}
                  <div className="p-4 sm:p-6 flex flex-col md:flex-row gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-50/50 border border-gray-100 p-2 rounded-xl flex items-center justify-center shrink-0 mx-auto md:mx-0">
                      <img
                        src={order.product_image || 'https://m.media-amazon.com/images/I/71Ld0-zRjwL._SX679_.jpg'}
                        alt={order.product_title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow min-w-0 text-center md:text-left">
                      <h3 className="font-bold text-gray-900 text-sm leading-snug hover:text-[#C45500] hover:underline cursor-pointer">
                        <Link href={`/product/${order.product_id}`}>
                          {order.product_title}
                        </Link>
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 font-semibold">Qty: {order.quantity}</p>
                      
                      <div className="mt-4 flex items-center justify-center md:justify-start gap-1.5 text-xs text-green-700 font-bold">
                        <Package size={15} />
                        <span>Estimated delivery: Tomorrow</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5 font-semibold">Shipping Address: {order.shipping_address}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 shrink-0 w-full md:w-48 justify-center">
                      <Link href={`/product/${order.product_id}`}>
                        <button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-normal py-2 rounded-lg border border-[#FCD200] transition-all text-xs cursor-pointer active:scale-[0.98] select-none flex items-center justify-center gap-1 font-semibold">
                          <RefreshCw size={12} />
                          Buy it again
                        </button>
                      </Link>
                      
                      <button className="w-full bg-white hover:bg-gray-50 text-gray-700 font-normal py-2 rounded-lg border border-gray-300 transition-all text-xs cursor-pointer active:scale-[0.98] select-none font-semibold">
                        Track package
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function OrdersPage() {
  return (
    <AuthGuard>
      <OrdersContent />
    </AuthGuard>
  );
}
