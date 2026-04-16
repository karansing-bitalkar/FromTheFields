import { useState, useEffect } from "react";
import type { Product } from "@/types";

const STORAGE_KEY = "ftf_wishlist";

function loadWishlist(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useWishlist() {
  const [wishlistIds, setWishlistIds] = useState<string[]>(loadWishlist);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const isWishlisted = (id: string) => wishlistIds.includes(id);

  const toggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id) ? prev.filter((i) => i !== product.id) : [...prev, product.id]
    );
    return !wishlistIds.includes(product.id);
  };

  const removeFromWishlist = (id: string) => {
    setWishlistIds((prev) => prev.filter((i) => i !== id));
  };

  const clearWishlist = () => setWishlistIds([]);

  return { wishlistIds, isWishlisted, toggleWishlist, removeFromWishlist, clearWishlist };
}
