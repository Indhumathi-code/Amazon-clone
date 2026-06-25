'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PlaceOrderButton from './PlaceOrderButton';
import { Lock, ShieldCheck, MapPin, CreditCard, ShoppingBag, Truck, ChevronDown, Check, AlertCircle } from 'lucide-react';
import { getProductImage } from '../../lib/utils';

export default function CheckoutFormClient({ product, shippingCost, totalAmount }) {
  // Address States
  const [addressMode, setAddressMode] = useState('view'); // 'view' or 'edit'
  const [address, setAddress] = useState({
    fullName: 'Your Name',
    phone: '+91 Phone Number',
    street: 'Address',
    city: 'Your City',
    state: 'Your state',
    pincode: 'Your Pincode',
  });
  
  // Temporary Address state during editing
  const [tempAddress, setTempAddress] = useState({ ...address });
  const [addressError, setAddressError] = useState('');

  // Pre-fill user name from localStorage if available
  useEffect(() => {
    const savedName = localStorage.getItem('amazon_user');
    if (savedName) {
      setTimeout(() => {
        setAddress(prev => ({ ...prev, fullName: savedName }));
        setTempAddress(prev => ({ ...prev, fullName: savedName }));
      }, 0);                    
    }
  }, []);

  // Payment States
  const [paymentMode, setPaymentMode] = useState('view'); // 'view' or 'edit'
  const [selectedMethod, setSelectedMethod] = useState('card'); // 'card', 'googlepay', 'cash'
  
  // Card Inputs
  const [cardData, setCardData] = useState({
    cardNumber: '4321 5678 9012 4242',
    cardName: 'John Doe',
    expiry: '12/29',
    cvv: '123'
  });
  const [tempCardData, setTempCardData] = useState({ ...cardData });

  // Google Pay / UPI Inputs
  const [upiId, setUpiId] = useState('yourbank@okaxis');
  const [tempUpiId, setTempUpiId] = useState(upiId);
  const [paymentError, setPaymentError] = useState('');

  // Shipping Speed
  const [shippingSpeed, setShippingSpeed] = useState('prime'); // 'prime' or 'standard'

  // Edit action handlers
  const handleEditAddress = () => {
    setTempAddress({ ...address });
    setAddressError('');
    setAddressMode('edit');
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    setAddressError('');

    // Validations
    if (!tempAddress.fullName.trim()) return setAddressError('Full Name is required.');
    if (!tempAddress.phone.trim()) return setAddressError('Phone Number is required.');
    if (!tempAddress.street.trim()) return setAddressError('Street address is required.');
    if (!tempAddress.city.trim()) return setAddressError('City is required.');
    if (!tempAddress.state.trim()) return setAddressError('State is required.');
    if (!tempAddress.pincode.trim() || !/^\d{6}$/.test(tempAddress.pincode)) {
      return setAddressError('Enter a valid 6-digit PIN code.');
    }

    setAddress({ ...tempAddress });
    setAddressMode('view');
  };

  const handleEditPayment = () => {
    setTempCardData({ ...cardData });
    setTempUpiId(upiId);
    setPaymentError('');
    setPaymentMode('edit');
  };

  const handleSavePayment = (e) => {
    e.preventDefault();
    setPaymentError('');

    if (selectedMethod === 'card') {
      const cleanNum = tempCardData.cardNumber.replace(/\s/g, '');
      if (!cleanNum || cleanNum.length < 12) {
        return setPaymentError('Please enter a valid card number.');
      }
      if (!tempCardData.cardName.trim()) {
        return setPaymentError('Please enter the cardholder name.');
      }
      if (!tempCardData.expiry.trim() || !/^\d{2}\/\d{2}$/.test(tempCardData.expiry)) {
        return setPaymentError('Expiry date must be in MM/YY format.');
      }
      if (!tempCardData.cvv.trim() || tempCardData.cvv.length < 3) {
        return setPaymentError('Please enter a valid CVV.');
      }
      setCardData({ ...tempCardData });
    } else if (selectedMethod === 'googlepay') {
      if (!tempUpiId.trim() || !tempUpiId.includes('@')) {
        return setPaymentError('Please enter a valid Google Pay UPI ID (e.g. name@bank).');
      }
      setUpiId(tempUpiId);
    }

    setPaymentMode('view');
  };

  // String formatting for submission
  const formattedAddress = `${address.fullName}, ${address.street}, ${address.city}, ${address.state} - ${address.pincode}, Phone: ${address.phone}`;
  
  let formattedPayment = 'Visa ending in 4242';
  if (selectedMethod === 'card') {
    const cleanNum = cardData.cardNumber.replace(/\s/g, '');
    const last4 = cleanNum.slice(-4) || '4242';
    formattedPayment = `Card ending in ${last4}`;
  } else if (selectedMethod === 'googlepay') {
    formattedPayment = `Google Pay (UPI: ${upiId})`;
  } else if (selectedMethod === 'cash') {
    formattedPayment = 'Cash on Delivery (Cash in hand)';
  }

  // Format Card Expiry
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < value.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += value[i];
    }
    setTempCardData({ ...tempCardData, cardNumber: formatted });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setTempCardData({ ...tempCardData, expiry: value.slice(0, 5) });
  };

  return (
    <div className="min-h-screen bg-white select-none font-sans">
      
      {/* Checkout Header */}
      <header className="bg-white border-b border-gray-200 py-3.5 px-6 sticky top-0 z-50 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-baseline shrink-0">
            <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">amazon</span>
            <span className="text-sm font-bold text-[#FF9900]">.in</span>
          </Link>
          
          <h1 className="text-base sm:text-xl font-bold text-gray-800 flex items-center gap-1.5">
            Checkout <span className="text-gray-400 text-xs font-semibold">({1} item)</span>
          </h1>

          <div className="text-gray-500 flex items-center gap-1.5 font-bold text-xs bg-gray-55 border border-gray-250 px-3 py-1.5 rounded-lg shadow-2xs">
            <Lock size={13} className="text-green-600 animate-pulse" />
            <span className="hidden sm:inline">Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Checkout Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Delivery Address */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs transition-all duration-300">
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                  <span className="bg-[#232f3e] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-extrabold">1</span>
                  Delivery address
                </h2>
                {addressMode === 'view' && (
                  <button 
                    onClick={handleEditAddress}
                    className="text-[#007185] hover:text-[#C45500] text-xs font-bold hover:underline cursor-pointer bg-transparent border-none outline-none"
                  >
                    Change
                  </button>
                )}
              </div>

              {addressMode === 'view' ? (
                <div className="pl-7 text-xs sm:text-sm text-gray-600 space-y-1 font-semibold">
                  <p className="font-bold text-gray-800">{address.fullName}</p>
                  <p>{address.street}</p>
                  <p>{address.city}, {address.state} - {address.pincode}</p>
                  <p className="text-gray-450 mt-1">Phone: {address.phone}</p>
                </div>
              ) : (
                <form onSubmit={handleSaveAddress} className="pl-7 space-y-4 max-w-lg">
                  {addressError && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 animate-shake">
                      <AlertCircle size={14} />
                      <span>{addressError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={tempAddress.fullName}
                        onChange={(e) => setTempAddress({ ...tempAddress, fullName: e.target.value })}
                        className="w-full h-[32px] border border-gray-300 rounded px-2.5 text-xs focus:border-[#e77600] focus:ring-2 focus:ring-[#f5d7bb] focus:outline-none transition-all"
                        placeholder="First and Last name"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Mobile Number</label>
                      <input 
                        type="text" 
                        value={tempAddress.phone}
                        onChange={(e) => setTempAddress({ ...tempAddress, phone: e.target.value })}
                        className="w-full h-[32px] border border-gray-300 rounded px-2.5 text-xs focus:border-[#e77600] focus:ring-2 focus:ring-[#f5d7bb] focus:outline-none transition-all"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Flat, House no., Building, Apartment</label>
                    <input 
                      type="text" 
                      value={tempAddress.street}
                      onChange={(e) => setTempAddress({ ...tempAddress, street: e.target.value })}
                      className="w-full h-[32px] border border-gray-300 rounded px-2.5 text-xs focus:border-[#e77600] focus:ring-2 focus:ring-[#f5d7bb] focus:outline-none transition-all"
                      placeholder="Street address, P.O. box, company name"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Town/City</label>
                      <input 
                        type="text" 
                        value={tempAddress.city}
                        onChange={(e) => setTempAddress({ ...tempAddress, city: e.target.value })}
                        className="w-full h-[32px] border border-gray-300 rounded px-2.5 text-xs focus:border-[#e77600] focus:ring-2 focus:ring-[#f5d7bb] focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">State</label>
                      <input 
                        type="text" 
                        value={tempAddress.state}
                        onChange={(e) => setTempAddress({ ...tempAddress, state: e.target.value })}
                        className="w-full h-[32px] border border-gray-300 rounded px-2.5 text-xs focus:border-[#e77600] focus:ring-2 focus:ring-[#f5d7bb] focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">PIN Code</label>
                      <input 
                        type="text" 
                        maxLength={6}
                        value={tempAddress.pincode}
                        onChange={(e) => setTempAddress({ ...tempAddress, pincode: e.target.value.replace(/\D/g, '') })}
                        className="w-full h-[32px] border border-gray-300 rounded px-2.5 text-xs focus:border-[#e77600] focus:ring-2 focus:ring-[#f5d7bb] focus:outline-none transition-all"
                        placeholder="6 digits"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      type="submit"
                      className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 px-4 py-1.5 rounded-lg border border-[#FCD200] text-xs font-semibold shadow-2xs hover:shadow active:scale-[0.98] transition-all cursor-pointer"
                    >
                      Save and Use this Address
                    </button>
                    <button 
                      type="button"
                      onClick={() => setAddressMode('view')}
                      className="bg-white hover:bg-gray-50 text-gray-800 px-4 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs transition-all duration-300">
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                  <span className="bg-[#232f3e] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-extrabold">2</span>
                  Payment method
                </h2>
                {paymentMode === 'view' && (
                  <button 
                    onClick={handleEditPayment}
                    className="text-[#007185] hover:text-[#C45500] text-xs font-bold hover:underline cursor-pointer bg-transparent border-none outline-none"
                  >
                    Change
                  </button>
                )}
              </div>

              {paymentMode === 'view' ? (
                <div className="pl-7 text-xs sm:text-sm text-gray-600 space-y-3 font-semibold">
                  <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 p-3 rounded-xl">
                    <div className="bg-[#232F3E] text-white rounded p-1.5 flex items-center justify-center">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{formattedPayment}</p>
                      <p className="text-gray-400 text-[10px]">Billing Address: Same as delivery address</p>
                    </div>
                  </div>
                  <div className="bg-amber-50/50 text-amber-800 text-[11px] px-3.5 py-2.5 rounded-xl border border-amber-100/50 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-amber-550 shrink-0" />
                    <span>Save 10% instantly on this order with Amazon Pay ICICI Credit Card.</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSavePayment} className="pl-7 space-y-4 max-w-lg">
                  {paymentError && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
                      <AlertCircle size={14} />
                      <span>{paymentError}</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Card Radio Option */}
                    <label className={`flex flex-col p-4 rounded-xl border transition-all cursor-pointer ${selectedMethod === 'card' ? 'border-[#e77600] bg-orange-50/10' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="paymentOption" 
                          checked={selectedMethod === 'card'} 
                          onChange={() => setSelectedMethod('card')}
                          className="accent-[#e77600] h-4 w-4" 
                        />
                        <div className="flex items-center gap-2">
                          <CreditCard size={16} className="text-gray-700" />
                          <span className="text-xs font-bold text-gray-800">Credit or Debit Card</span>
                        </div>
                      </div>
                      
                      {selectedMethod === 'card' && (
                        <div className="mt-4 pl-7 space-y-3 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-dashed border-gray-150 pt-3">
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-bold text-gray-650 mb-0.5">Card Number</label>
                            <input 
                              type="text" 
                              value={tempCardData.cardNumber}
                              onChange={handleCardNumberChange}
                              maxLength={19}
                              className="w-full h-[30px] border border-gray-300 rounded px-2.5 text-xs focus:border-[#e77600] focus:ring-1 focus:ring-[#f5d7bb] focus:outline-none"
                              placeholder="0000 0000 0000 0000"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-bold text-gray-650 mb-0.5">Cardholder Name</label>
                            <input 
                              type="text" 
                              value={tempCardData.cardName}
                              onChange={(e) => setTempCardData({ ...tempCardData, cardName: e.target.value })}
                              className="w-full h-[30px] border border-gray-300 rounded px-2.5 text-xs focus:border-[#e77600] focus:ring-1 focus:ring-[#f5d7bb] focus:outline-none"
                              placeholder="Name on card"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-650 mb-0.5">Expiry Date</label>
                            <input 
                              type="text" 
                              value={tempCardData.expiry}
                              onChange={handleExpiryChange}
                              placeholder="MM/YY"
                              className="w-full h-[30px] border border-gray-300 rounded px-2.5 text-xs focus:border-[#e77600] focus:ring-1 focus:ring-[#f5d7bb] focus:outline-none text-center"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-650 mb-0.5">CVV</label>
                            <input 
                              type="password" 
                              maxLength={3}
                              value={tempCardData.cvv}
                              onChange={(e) => setTempCardData({ ...tempCardData, cvv: e.target.value.replace(/\D/g, '') })}
                              placeholder="123"
                              className="w-full h-[30px] border border-gray-300 rounded px-2.5 text-xs focus:border-[#e77600] focus:ring-1 focus:ring-[#f5d7bb] focus:outline-none text-center"
                            />
                          </div>
                        </div>
                      )}
                    </label>

                    {/* Google Pay / UPI Radio Option */}
                    <label className={`flex flex-col p-4 rounded-xl border transition-all cursor-pointer ${selectedMethod === 'googlepay' ? 'border-[#e77600] bg-orange-50/10' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="paymentOption" 
                          checked={selectedMethod === 'googlepay'} 
                          onChange={() => setSelectedMethod('googlepay')}
                          className="accent-[#e77600] h-4 w-4" 
                        />
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[11px] text-blue-600 tracking-wider">G</span>
                          <span className="font-bold text-xs text-gray-800">Google Pay / UPI</span>
                        </div>
                      </div>
                      
                      {selectedMethod === 'googlepay' && (
                        <div className="mt-4 pl-7 space-y-2 border-t border-dashed border-gray-150 pt-3">
                          <label className="block text-[10px] font-bold text-gray-650 mb-0.5">Enter UPI ID</label>
                          <input 
                            type="text" 
                            value={tempUpiId}
                            onChange={(e) => setTempUpiId(e.target.value)}
                            placeholder="e.g. mobile@upi"
                            className="w-full max-w-xs h-[30px] border border-gray-300 rounded px-2.5 text-xs focus:border-[#e77600] focus:ring-1 focus:ring-[#f5d7bb] focus:outline-none"
                          />
                        </div>
                      )}
                    </label>

                    {/* Cash in Hand Radio Option */}
                    <label className={`flex flex-col p-4 rounded-xl border transition-all cursor-pointer ${selectedMethod === 'cash' ? 'border-[#e77600] bg-orange-50/10' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="paymentOption" 
                          checked={selectedMethod === 'cash'} 
                          onChange={() => setSelectedMethod('cash')}
                          className="accent-[#e77600] h-4 w-4" 
                        />
                        <span className="text-xs font-bold text-gray-800">Cash in Hand (Cash on Delivery)</span>
                      </div>
                      
                      {selectedMethod === 'cash' && (
                        <div className="mt-3 pl-7 text-[11px] text-gray-500 font-semibold border-t border-dashed border-gray-150 pt-3">
                          Pay in cash upon delivery. Please keep exact change ready.
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      type="submit"
                      className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 px-4 py-1.5 rounded-lg border border-[#FCD200] text-xs font-semibold shadow-2xs hover:shadow active:scale-[0.98] transition-all cursor-pointer"
                    >
                      Use this payment method
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPaymentMode('view')}
                      className="bg-white hover:bg-gray-50 text-gray-800 px-4 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Step 3: Review Item and Shipping */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs">
              <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2 mb-6">
                <span className="bg-[#232f3e] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-extrabold">3</span>
                Review items and delivery
              </h2>
              
              <div className="pl-7 flex flex-col md:flex-row gap-6">
                {/* Image */}
                <div className="w-28 h-28 object-contain bg-gray-55/50 p-2.5 rounded-xl border border-gray-100 flex items-center justify-center shrink-0 mx-auto md:mx-0">
                  <img
                    src={getProductImage(product)}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-850 text-xs sm:text-sm leading-snug line-clamp-2">{product.title}</h3>
                  <p className="text-[11px] text-green-700 font-bold mt-1.5 flex items-center gap-0.5">In stock</p>
                  <p className="text-xs text-gray-450 mt-1 font-semibold">Qty: 1</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-base font-extrabold text-gray-900">₹{Number(product.price).toLocaleString('en-IN')}</span>
                    {product.original_price && (
                      <span className="text-[11px] text-gray-400 line-through">
                        M.R.P.: ₹{Number(product.original_price).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Options */}
                <div className="w-full md:w-64 bg-gray-55/50 p-4 rounded-xl border border-gray-100 text-xs font-semibold space-y-3.5">
                  <p className="font-bold text-gray-800 flex items-center gap-1">
                    <Truck size={13} className="text-amber-500" /> Choose delivery speed:
                  </p>
                  <div className="space-y-3">
                    <label 
                      onClick={() => setShippingSpeed('prime')}
                      className={`flex items-start gap-2.5 cursor-pointer bg-white p-3 rounded-lg border shadow-3xs transition-all ${shippingSpeed === 'prime' ? 'border-[#e77600] ring-1 ring-[#e77600]' : 'border-gray-200'}`}
                    >
                      <input 
                        type="radio" 
                        name="speed" 
                        checked={shippingSpeed === 'prime'} 
                        onChange={() => setShippingSpeed('prime')}
                        className="mt-0.5 accent-[#e77600] h-3.5 w-3.5" 
                      />
                      <div>
                        <span className="font-bold text-green-700">Tomorrow by 10 AM</span>
                        <p className="text-gray-400 text-[10px] font-semibold mt-0.5">FREE Prime Delivery</p>
                      </div>
                    </label>
                    <label 
                      onClick={() => setShippingSpeed('standard')}
                      className={`flex items-start gap-2.5 cursor-pointer bg-white p-3 rounded-lg border transition-all ${shippingSpeed === 'standard' ? 'border-[#e77600] ring-1 ring-[#e77600]' : 'border-gray-200'}`}
                    >
                      <input 
                        type="radio" 
                        name="speed" 
                        checked={shippingSpeed === 'standard'} 
                        onChange={() => setShippingSpeed('standard')}
                        className="mt-0.5 accent-[#e77600] h-3.5 w-3.5" 
                      />
                      <div>
                        <span className="font-bold text-gray-700">Standard Delivery</span>
                        <p className="text-gray-400 text-[10px] font-semibold mt-0.5">Delivered in 2-3 business days</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary Sidebar */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm sticky top-24 space-y-4">
              
              <PlaceOrderButton 
                productId={product.id} 
                price={product.price} 
                shippingAddress={formattedAddress}
                paymentMethod={formattedPayment}
                disabled={addressMode === 'edit' || paymentMode === 'edit'}
              />
              
              <p className="text-[10px] text-gray-500 text-center leading-normal font-semibold px-1">
                By placing your order, you agree to Amazon&apos;s privacy notice and conditions of use.
              </p>

              <hr className="border-gray-100" />

              <h3 className="font-bold text-gray-900 text-sm sm:text-base">Order Summary</h3>
              
              <div className="text-xs sm:text-sm space-y-2.5 font-bold">
                <div className="flex justify-between text-gray-500 font-semibold">
                  <span>Items:</span>
                  <span className="text-gray-800">₹{Number(product.price).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-semibold">
                  <span>Delivery:</span>
                  <span className="text-gray-800">₹{shippingCost}.00</span>
                </div>
                <div className="flex justify-between text-gray-500 font-semibold">
                  <span>Promotion Applied:</span>
                  <span className="text-red-600 font-bold">-₹{shippingCost}.00</span>
                </div>

                <hr className="border-gray-150" />

                <div className="flex justify-between text-base sm:text-lg font-bold text-red-605 pt-1">
                  <span>Order Total:</span>
                  <span>₹{Number(product.price).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-xs leading-relaxed text-gray-500 font-semibold">
                <p className="font-bold text-gray-700">Easy 10-Day Returns</p>
                <p className="mt-0.5">Return eligible items for free within 10 days of delivery.</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
