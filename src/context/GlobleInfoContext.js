// context/GlobleInfoContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GlobleInfo = createContext();

export const GlobleInfoProvider = ({ children }) => {
  const [productCount, setProductCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [checkoutData, setCheckoutData] = useState({});

  const updateCounts = async () => {
    try {
      const cartItems = JSON.parse(await AsyncStorage.getItem('cart')) || [];
      const wishlistItems = JSON.parse(await AsyncStorage.getItem('wishlist')) || [];
      setProductCount(cartItems.length);
      setWishlistCount(wishlistItems.length);
    } catch (error) {
      console.error('Error updating counts:', error);
    }
  };

  const saveCheckoutData = (data) => {
    setCheckoutData(data);
    console.log("Checkout Data Saved:", data);
  };

  useEffect(() => {
    updateCounts();
  }, []);

  return (
    <GlobleInfo.Provider
      value={{
        productCount,
        wishlistCount,
        updateCounts,
        saveCheckoutData,
        checkoutData,
      }}
    >
      {children}
    </GlobleInfo.Provider>
  );
};
