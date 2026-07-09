import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    fetch('/api/cart')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setCartCount(data.count || 0);
          setCartItems(data.items || []);
        }
      })
      .catch(err => console.error("Could not fetch cart:", err));
  };

  const addToCart = (productId) => {
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchCart();
          setIsCartOpen(true);
        }
      })
      .catch(err => console.error('Failed to add to cart:', err));
  };

  const removeFromCart = (itemId) => {
    fetch(`/api/cart/${itemId}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchCart();
        }
      })
      .catch(err => console.error('Failed to remove from cart:', err));
  };

  return (
    <CartContext.Provider value={{
      cartCount,
      cartItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
