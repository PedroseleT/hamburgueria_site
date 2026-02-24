"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  customization?: {
    molhos?: string[];
    extras?: string[];
    obs?: string;
  };
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItemCustomization: (id: string, newCustomization: any, newPrice: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("pedro-burger-cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("pedro-burger-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => 
        item.id === product.id && 
        JSON.stringify(item.customization) === JSON.stringify(product.customization)
      );
      if (existing) {
        return prev.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + product.quantity } : item
        );
      }
      return [...prev, product];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
    );
  };

  const updateItemCustomization = (id: string, newCustomization: any, newPrice: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, customization: newCustomization, price: newPrice } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, updateItemCustomization, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de um CartProvider");
  return context;
};