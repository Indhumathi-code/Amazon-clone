'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { status } = useSession();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    if (status !== 'authenticated') {
      setCartItems([]);
      setLoading(false);
      return;
    }
    const res = await fetch('/api/cart');
    if (res.ok) setCartItems(await res.json());
    setLoading(false);
  }, [status]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId) => {
    if (status !== 'authenticated') {
      alert('Please log in to add items to your cart');
      return;
    }
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    if (res.ok) setCartItems(await res.json()); // <-- instant update, no reload
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, addToCart, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}