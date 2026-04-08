import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const { isAuthenticated } = useAuth();

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItemCount(0);
      return;
    }
    try {
      const res = await api.get('/cart/');
      if (res.data && res.data.items) {
        const total = res.data.items.reduce((sum, item) => sum + Number(item.quantity), 0);
        setCartItemCount(total);
      } else {
        setCartItemCount(0);
      }
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
      setCartItemCount(0);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <CartContext.Provider value={{ cartItemCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
