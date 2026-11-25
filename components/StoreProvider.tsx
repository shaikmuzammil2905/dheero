"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { CartItem, Collection, FaqItem, Product } from "@/lib/types";

interface StoreContextValue {
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  updateVariant: (oldVariantId: string, newItem: CartItem) => void;
  removeFromCart: (variantId: string) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  toastMessage: string | null;
  activeCollection: Collection | null;
  products: Product[];
  settings: Record<string, string>;
  faqs: FaqItem[];
  refreshStore: () => Promise<void>;
}

const StoreContext = createContext<StoreContextValue | null>(null);
const CART_KEY = "dheero_cart_v1";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isCartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeCollection, setActiveCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  const refreshStore = async () => {
    try {
      const res = await fetch("/api/store", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setActiveCollection(data.activeCollection ?? null);
      setProducts(data.products ?? []);
      setSettings(data.settings ?? {});
      setFaqs(data.faqs ?? []);
    } catch (err) {
      console.error("Failed to fetch store data:", err);
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) setCart(JSON.parse(saved));
    } catch {
      // ignore invalid storage
    }
    setHydrated(true);
    refreshStore();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart, hydrated]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((cur) => (cur === msg ? null : cur)), 3200);
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.variantId === item.variantId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity };
        return next;
      }
      return [...prev, item];
    });
    showToast(`Added ${item.colorName} (${item.quantity}) to your cart`);
    setCartDrawerOpen(true);
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.variantId === variantId ? { ...i, quantity } : i))
    );
  };

  const updateVariant = (oldVariantId: string, newItem: CartItem) => {
    setCart((prev) => {
      const filtered = prev.filter((i) => i.variantId !== oldVariantId);
      const existing = filtered.find((i) => i.variantId === newItem.variantId);
      if (existing) {
        return filtered.map((i) =>
          i.variantId === newItem.variantId
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }
      return [...filtered, newItem];
    });
  };

  const removeFromCart = (variantId: string) => {
    setCart((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        addToCart,
        updateQuantity,
        updateVariant,
        removeFromCart,
        clearCart,
        isCartDrawerOpen,
        setCartDrawerOpen,
        toastMessage,
        activeCollection,
        products,
        settings,
        faqs,
        refreshStore,
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#32170B] text-[#F9F3E6] border border-[#D4A017]/60 px-5 py-3 rounded-full shadow-2xl text-sm font-medium flex items-center gap-2.5 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#F26500]" />
          {toastMessage}
        </div>
      )}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
