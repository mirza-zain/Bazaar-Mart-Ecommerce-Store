'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";

export type CartItem = {
  id: string; // Unique cart item ID (e.g. `${productId}-${variant}`)
  productId: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
  maxStock?: number;
};

interface CartContextType {
  items: CartItem[];
  isLoaded: boolean;
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  freeShippingThreshold: number;
  progressToFreeShipping: number;
  addToCart: (item: Omit<CartItem, "id">) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "bazzario_cart_v1";
const FREE_SHIPPING_THRESHOLD = 8000;
const FLAT_SHIPPING_FEE = 250;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [items, isLoaded]);

  const addToCart = (newItem: Omit<CartItem, "id">) => {
    setItems((prevItems) => {
      const uniqueId = `${newItem.productId}-${newItem.variant || "default"}`;
      const existingIndex = prevItems.findIndex((i) => i.id === uniqueId);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const existing = updated[existingIndex];
        const max = existing.maxStock ?? 999;
        const newQty = Math.min(existing.quantity + newItem.quantity, max);
        updated[existingIndex] = { ...existing, quantity: newQty };
        return updated;
      } else {
        const itemWithId: CartItem = {
          ...newItem,
          id: uniqueId,
        };
        return [...prevItems, itemWithId];
      }
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === id) {
            const max = item.maxStock ?? 999;
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return { ...item, quantity: Math.min(newQty, max) };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear cart storage", e);
    }
  };

  // Derived calculations
  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const shippingFee = useMemo(
    () => (items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE),
    [items.length, subtotal]
  );

  const progressToFreeShipping = useMemo(
    () => Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100),
    [subtotal]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isLoaded,
        totalItems,
        subtotal,
        shippingFee,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        progressToFreeShipping,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

