// src/hooks/useCartCount.ts
import { useState, useEffect } from 'react';
import { cartAPI, wishlistAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export const useCartCount = () => {
  const [count, setCount] = useState(0);
  const { user } = useAuth();

  const fetchCartCount = async () => {
    if (!user) {
      setCount(0);
      return;
    }
    try {
      const response = await cartAPI.get();
      const items = response.data?.items || [];
      const totalCount = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCount(totalCount);
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [user]);

  return { cartCount: count, refreshCartCount: fetchCartCount };
};

export const useWishlistCount = () => {
  const [count, setCount] = useState(0);
  const { user } = useAuth();

  const fetchWishlistCount = async () => {
    if (!user) {
      setCount(0);
      return;
    }
    try {
      const response = await wishlistAPI.get();
      const items = response.data || [];
      setCount(items.length);
    } catch (error) {
      console.error('Error fetching wishlist count:', error);
      setCount(0);
    }
  };

  useEffect(() => {
    fetchWishlistCount();
  }, [user]);

  return { wishlistCount: count, refreshWishlistCount: fetchWishlistCount };
};