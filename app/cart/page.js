'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AuthGuard from '../../components/AuthGuard';
import { Trash2, Bookmark, ExternalLink, Gift, CheckCircle, AlertCircle, ShoppingBag } from 'lucide-react';
import { getProductImage } from '../../lib/utils';
import axios from 'axios';

function CartContent() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCartItems = async () => {
    const token = localStorage.getItem('amazon_token');
    if (!token) {
      setError('You are not logged in.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = res.data;

      if (data.success) {
        setCartItems(data.cart);
      } else {
        setError(data.message || 'Failed to fetch cart items.');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to fetch cart due to a network error.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchCartItems();
    }, 0);
  }, []);

  const handleDelete = async (productId) => {
    const token = localStorage.getItem('amazon_token');
    if (!token) return;

    try {
      const res = await axios.delete(`/api/cart?product_id=${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = res.data;

      if (data.success) {
        // Remove item from state locally
        setCartItems(prevItems => prevItems.filter(item => item.product_id !== productId));
        
        // Trigger custom event to update Navbar cart count
        window.dispatchEvent(new Event('cart-updated'));
      } else {
        alert(data.message || 'Failed to delete item.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete item due to a network error.');
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    const token = localStorage.getItem('amazon_token');
    if (!token) return;

    try {
      const res = await axios.put('/api/cart', {
        product_id: productId,
        quantity: newQuantity
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = res.data;

      if (data.success) {
        // Update item quantity locally in state
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.product_id === productId ? { ...item, quantity: newQuantity } : item
          )
        );
        
        // Trigger custom event to update Navbar cart count
        window.dispatchEvent(new Event('cart-updated'));
      } else {
        alert(data.message || 'Failed to update item quantity.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update quantity due to a network error.');
    }
  };

  if (loading) {
    return (
      <div className="bg-[#EAEDED] min-h-screen flex flex-col select-none font-sans">
        <Navbar />
        <main className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-md border border-gray-200 text-center shadow-xs flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-[3px] border-[#FF9900]/20 border-t-[#FF9900] rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-gray-500">Loading your cart...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#EAEDED] min-h-screen flex flex-col select-none font-sans">
        <Navbar />
        <main className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-md border border-gray-200 text-center shadow-xs text-red-600 font-semibold">
            {error}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#EAEDED] flex flex-col select-none font-sans">
        <Navbar />
        <main className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full flex items-center justify-center">
          <div className="bg-white p-8 md:p-12 rounded-md border border-gray-200 text-center shadow-sm max-w-lg w-full flex flex-col items-center">
            <div className="bg-amber-50 text-amber-500 rounded-full w-20 h-20 flex items-center justify-center mb-6">
              <ShoppingBag size={36} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 tracking-tight">Your Shopping Cart is empty</h1>
            <p className="text-gray-400 text-xs md:text-sm mb-8 font-medium leading-relaxed max-w-xs">
              Explore deals or continue shopping to discover items to add to your cart.
            </p>
            <Link href="/">
              <button className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-955 font-bold px-8 py-3 rounded-lg border border-[#FCD200] shadow-xs cursor-pointer text-sm transition-all hover:shadow active:scale-[0.98]">
                Continue Shopping
              </button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalItemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotalPrice = cartItems.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0);

  // Link to checkout the first item in the cart
  const checkoutId = cartItems[0]?.product_id;

  return (
    <div className="bg-[#EAEDED] min-h-screen flex flex-col select-none font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Cart Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Left Column: Cart items (lg:col-span-3) */}
          <div className="lg:col-span-3 bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-xs text-[#007185] hover:text-[#C45500] hover:underline cursor-pointer mt-1 font-semibold">
                Active items in your cart
              </p>
            </div>

            {/* Cart Items List */}
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row gap-6 border-b border-gray-100 pb-6 items-start">
                
                {/* Product Image */}
                <div className="w-36 h-36 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 flex items-center justify-center shrink-0 mx-auto md:mx-0">
                  <img
                    src={getProductImage({ image_url: item.image_url })}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Product Title and Actions */}
                <div className="flex-grow space-y-2.5">
                  <h2 className="text-base md:text-lg font-bold text-gray-905 leading-snug line-clamp-2">
                    <Link href={`/product/${item.product_id}`} className="hover:text-[#C45500] hover:underline">
                      {item.title}
                    </Link>
                  </h2>
                  <p className="text-xs text-green-700 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block animate-ping"></span> In Stock
                  </p>
                  
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span>Category:</span>
                    <span className="font-bold text-gray-800 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">{item.category || 'General'}</span>
                  </div>

                  {/* Actions: Qty, Delete, Save for Later */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-xs font-semibold">
                    <div className="flex items-center gap-1 bg-gray-100 border border-gray-200 rounded-lg px-2 py-0.5 text-gray-700 font-bold">
                      <span className="text-gray-500 text-xs font-semibold mr-0.5">Qty:</span>
                      <select
                        value={item.quantity || 1}
                        onChange={(e) => handleUpdateQuantity(item.product_id, Number(e.target.value))}
                        className="bg-transparent border-none outline-none font-bold text-gray-705 text-xs cursor-pointer focus:ring-0 p-0"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(qty => (
                          <option key={qty} value={qty}>{qty}</option>
                        ))}
                      </select>
                    </div>
                    <span className="text-gray-200">|</span>
                    <button
                      onClick={() => handleDelete(item.product_id)}
                      className="text-red-500 hover:text-red-700 hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none font-bold"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                    <span className="text-gray-200">|</span>
                    <button className="text-[#007185] hover:text-[#C45500] hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none font-bold">
                      <Bookmark size={13} />
                      Save for later
                    </button>
                    <span className="text-gray-200">|</span>
                    <button className="text-[#007185] hover:text-[#C45500] hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none font-bold">
                      <ExternalLink size={13} />
                      More like this
                    </button>
                  </div>
                </div>

                {/* Product Price */}
                <div className="text-right md:w-32 shrink-0 w-full md:w-auto mt-4 md:mt-0">
                  <p className="text-lg md:text-xl font-bold text-gray-900">
                    ₹{Number(item.price).toLocaleString('en-IN')}
                  </p>
                  {item.original_price && (
                    <p className="text-xs text-gray-400 line-through mt-0.5">
                      M.R.P.: ₹{Number(item.original_price).toLocaleString('en-IN')}
                    </p>
                  )}
                </div>

              </div>
            ))}

            {/* Subtotal bottom */}
            <div className="text-right text-base sm:text-lg font-medium text-gray-700 pt-2">
              Subtotal ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}):{' '}
              <span className="font-extrabold text-gray-950">₹{subtotalPrice.toLocaleString('en-IN')}</span>
            </div>

          </div>

          {/* Right Column: Checkout Widget (lg:col-span-1) */}
          <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-5">
            
            {/* Free Shipping Alert */}
            <div className="text-xs text-green-700 flex gap-2 items-start bg-green-50 p-3.5 rounded-xl border border-green-100">
              <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
              <div>
                <span>Your order qualifies for </span>
                <span className="font-bold">FREE Delivery</span>
                <span>. Choose this option at checkout.</span>
              </div>
            </div>

            {/* Subtotal summary */}
            <div className="text-base text-gray-805 leading-tight">
              Subtotal ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}):{' '}
              <div className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">₹{subtotalPrice.toLocaleString('en-IN')}</div>
            </div>

            {/* Gift option */}
            <div className="text-xs text-gray-700 flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-100 p-3 rounded-xl">
              <input type="checkbox" id="gift" className="rounded text-amber-500 focus:ring-amber-400 border-gray-300 h-4 w-4" />
              <label htmlFor="gift" className="cursor-pointer font-semibold flex items-center gap-1 text-gray-850"><Gift size={13} className="text-amber-550" /> This order contains a gift</label>
            </div>

            {/* Proceed to Checkout button */}
            <Link href={`/checkout?id=${checkoutId}`} className="block">
              <button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] text-gray-900 font-normal py-2.5 rounded-full border border-[#FCD200] transition-all shadow-xs text-sm cursor-pointer hover:shadow active:scale-[0.98] select-none font-semibold">
                Proceed to Checkout
              </button>
            </Link>

            <div className="border-t border-gray-100 pt-3.5 mt-2 text-xs text-gray-500 leading-relaxed font-medium">
              <p className="font-bold text-gray-850">EMI Available</p>
              <p className="mt-1">No Cost EMI available on selected credit cards. Check details at checkout page.</p>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CartPage() {
  return (
    <AuthGuard>
      <CartContent />
    </AuthGuard>
  );
}