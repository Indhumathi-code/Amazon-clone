import pool from '../../lib/db';
import Link from 'next/link';
import AuthGuard from '../../components/AuthGuard';
import CheckoutFormClient from './CheckoutFormClient';
import { ShoppingBag, AlertCircle } from 'lucide-react';

export default async function CheckoutPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const id = resolvedParams?.id;

  if (!id) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 select-none font-sans">
          <div className="bg-white p-8 rounded-2xl shadow-xs max-w-md w-full text-center border border-gray-100 flex flex-col items-center">
            <div className="bg-red-50 text-red-500 rounded-full w-16 h-16 flex items-center justify-center mb-5">
              <ShoppingBag size={28} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Checkout Error</h1>
            <p className="text-gray-500 text-xs md:text-sm mb-6 leading-relaxed">No product was specified for checkout. Please select a product first.</p>
            <Link href="/" className="w-full">
              <button className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-955 font-bold py-2.5 rounded-lg transition-colors w-full shadow-xs cursor-pointer text-xs">
                Return to Home
              </button>
            </Link>
          </div>
        </div>
      </AuthGuard>
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
    console.error('Database error in CheckoutPage:', err);
  }

  if (!product) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 select-none font-sans">
          <div className="bg-white p-8 rounded-2xl shadow-xs max-w-md w-full text-center border border-gray-100 flex flex-col items-center">
            <div className="bg-red-50 text-red-500 rounded-full w-16 h-16 flex items-center justify-center mb-5">
              <AlertCircle size={28} />
            </div>
            <h1 className="text-xl font-bold text-red-650 mb-2">Product Not Found</h1>
            <p className="text-gray-500 text-xs md:text-sm mb-6 leading-relaxed">The product you are trying to purchase does not exist or has been removed.</p>
            <Link href="/" className="w-full">
              <button className="bg-gray-150 hover:bg-gray-200 text-gray-805 font-bold py-2.5 rounded-lg transition-colors w-full shadow-2xs cursor-pointer text-xs">
                Return to Home
              </button>
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const shippingCost = 40;
  const totalAmount = Number(product.price) + shippingCost;

  return (
    <AuthGuard>
      <CheckoutFormClient 
        product={product} 
        shippingCost={shippingCost} 
        totalAmount={totalAmount} 
      />
    </AuthGuard>
  );
}
