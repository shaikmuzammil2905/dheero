"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Lock,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  Truck,
} from "lucide-react";
import { useStore } from "@/components/StoreProvider";

export default function CartPage() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    updateQuantity,
    updateVariant,
    removeFromCart,
    products,
    settings,
  } = useStore();

  const product = products[0];
  const variants = product?.variants || [];
  const baseShipping = Number(settings.shipping_fee ?? 59);
  const freeThreshold = Number(settings.free_shipping_threshold ?? 999);
  const shippingFee = cartSubtotal === 0 ? 0 : cartSubtotal >= freeThreshold ? 0 : baseShipping;
  const totalAmount = cartSubtotal + shippingFee;
  const whatsapp = settings.whatsapp || "7207147749";

  return (
    <div className="parchment-surface py-10 sm:py-14 min-h-[75vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#7A0E0E] text-[#F9F3E6]">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif-display text-3xl sm:text-5xl font-bold text-[#5A2E0B]">
              Your Shopping Cart{" "}
              <span className="text-xl sm:text-2xl font-normal text-[#7A0E0E]">
                ({cartCount} {cartCount === 1 ? "Item" : "Items"})
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#5A2E0B]/75">
              Review your items and proceed to a secure checkout.
            </p>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="parchment-card rounded-3xl p-12 text-center space-y-4">
            <ShoppingCart className="w-14 h-14 mx-auto text-[#D4A017]" />
            <h2 className="font-serif-display text-3xl font-bold text-[#5A2E0B]">
              Your cart is currently empty
            </h2>
            <p className="text-sm text-[#5A2E0B]/80 max-w-md mx-auto">
              Explore the DHEERO™ Irumudi Rumala in Turmeric Yellow, Light Brown, or Maroon
              Red.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#F26500] hover:bg-[#d85700] text-white font-semibold text-sm shadow-lg"
            >
              Explore Irumudi Rumala <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.variantId}
                  className="parchment-card rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-5"
                >
                  <img
                    src={item.image}
                    alt={item.colorName}
                    className="w-full sm:w-36 h-44 sm:h-36 rounded-xl object-cover border border-[#D4A017]/50 shrink-0"
                  />

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="font-serif-display text-2xl font-bold text-[#7A0E0E]">
                          {item.productName}
                        </h2>
                        <p className="text-xs text-[#5A2E0B]/75">SKU: {item.sku}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.variantId)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#7A0E0E]/80 hover:text-[#7A0E0E]"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>

                    {/* Inline Colour Variant Switcher */}
                    {variants.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-[#5A2E0B]">Colour:</p>
                        <div className="flex flex-wrap gap-2">
                          {variants.map((v) => {
                            const active = v.id === item.variantId;
                            return (
                              <button
                                key={v.id}
                                type="button"
                                onClick={() => {
                                  if (active) return;
                                  updateVariant(item.variantId, {
                                    productId: item.productId,
                                    productName: item.productName,
                                    variantId: v.id,
                                    colorName: v.color_name,
                                    colorHex: v.color_hex,
                                    sku: v.sku,
                                    price: v.price,
                                    image: v.primary_image,
                                    quantity: item.quantity,
                                  });
                                }}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                                  active
                                    ? "bg-[#7A0E0E] text-white border-[#7A0E0E]"
                                    : "bg-white text-[#5A2E0B] border-[#D4A017]/50 hover:border-[#F26500]"
                                }`}
                              >
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-black/20"
                                  style={{ backgroundColor: v.color_hex }}
                                />
                                {v.color_name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#D4A017]/25">
                      <span className="text-2xl font-bold text-[#7A0E0E]">
                        ₹{item.price * item.quantity}
                      </span>
                      <div className="inline-flex items-center rounded-xl border border-[#D4A017]/60 bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-2 text-[#5A2E0B]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 text-sm font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="p-2 text-[#5A2E0B]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Trust Strip */}
              <div className="parchment-card rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#5A2E0B]">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-[#7A0E0E] shrink-0" />
                  <div>
                    <p className="font-bold">Secure Checkout</p>
                    <p className="text-[#5A2E0B]/75">
                      Your payment is verified server-side & encrypted.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-6 h-6 text-[#7A0E0E] shrink-0" />
                  <div>
                    <p className="font-bold">Multiple Payment Options</p>
                    <p className="text-[#5A2E0B]/75">
                      UPI • Cards • Netbanking • Cash on Delivery (where enabled)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 space-y-4">
              <div className="parchment-card rounded-2xl overflow-hidden">
                <div className="bg-[#7A0E0E] text-[#F9F3E6] px-6 py-4">
                  <h2 className="font-serif-display text-2xl font-bold">Order Summary</h2>
                </div>
                <div className="p-6 space-y-4 text-sm">
                  <div className="flex justify-between text-[#5A2E0B]">
                    <span>Item Total ({cartCount} Items)</span>
                    <span className="font-semibold">₹{cartSubtotal}</span>
                  </div>
                  <div className="flex justify-between text-[#5A2E0B]">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                    </span>
                  </div>
                  {cartSubtotal < freeThreshold && (
                    <p className="text-[11px] text-[#7A0E0E] bg-[#D4A017]/15 px-3 py-1.5 rounded-lg">
                      Add ₹{freeThreshold - cartSubtotal} more for Free Pan-India Shipping
                    </p>
                  )}
                  <div className="pt-3 border-t border-[#D4A017]/40 flex justify-between items-baseline">
                    <span className="font-bold text-base text-[#5A2E0B]">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-[#7A0E0E]">
                      ₹{totalAmount}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/75 border border-[#D4A017]/35 text-xs text-[#5A2E0B]/85 space-y-1">
                    <p className="font-bold text-[#5A2E0B]">Shipping Information</p>
                    <p>Ships in 1–2 Business Days</p>
                    <p>Expected Delivery: 3–6 Days (India)</p>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full py-3.5 rounded-full bg-[#F26500] hover:bg-[#d85700] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Lock className="w-4 h-4" /> PROCEED TO CHECKOUT →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
