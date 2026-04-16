import { useState, useCallback } from "react";
import type { Product } from "@/types";

const STORAGE_KEY = "ftf_cart";

export interface CartItem {
  product: Product;
  quantity: number;
}

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useCart(initial?: CartItem[]) {
  const [items, setItems] = useState<CartItem[]>(() => initial ?? loadCart());

  const updateItems = (next: CartItem[]) => {
    setItems(next);
    saveCart(next);
  };

  const addItem = useCallback((product: Product, qty = 1) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.product.id === product.id);
      const next = exists
        ? prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i)
        : [...prev, { product, quantity: qty }];
      saveCart(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.product.id !== productId);
      saveCart(next);
      return next;
    });
  }, []);

  const updateQty = useCallback((productId: string, qty: number) => {
    setItems((prev) => {
      const next = prev.map((i) => i.product.id === productId ? { ...i, quantity: Math.max(1, qty) } : i);
      saveCart(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    saveCart([]);
  }, []);

  const reorder = useCallback((orderItems: CartItem[]) => {
    setItems((prev) => {
      let next = [...prev];
      for (const item of orderItems) {
        const exists = next.find((i) => i.product.id === item.product.id);
        if (exists) {
          next = next.map((i) => i.product.id === item.product.id ? { ...i, quantity: i.quantity + item.quantity } : i);
        } else {
          next = [...next, { ...item }];
        }
      }
      saveCart(next);
      return next;
    });
  }, []);

  const totalItems = items.reduce((a, b) => a + b.quantity, 0);
  const subtotal = items.reduce((a, b) => a + b.product.price * b.quantity, 0);

  return { items, addItem, removeItem, updateQty, clearCart, reorder, totalItems, subtotal, updateItems };
}
