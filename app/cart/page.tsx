"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Lock,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useStore } from "@/components/StoreProvider";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

export default function CartAndCheckoutPage() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    updateQuantity,
    updateVariant,
    removeFromCart,
    clearCart,
    products,
    settings,
  } = useStore();

  const product = products[0];
  const variants = product?.variants || [];
  const baseShipping = Number(settings.shipping_fee ?? 59);
  const freeThreshold = Number(settings.free_shipping_threshold ?? 999);
  const shippingFee =
    cartSubtotal === 0 ? 0 : cartSubtotal >= freeThreshold ? 0 : baseShipping;
  const totalAmount = cartSubtotal + shippingFee;
  const codEnabled = settings.cod_enabled !== "0";

  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("cod");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderNumber: string;
    totalAmount: number;
    orderStatus: string;
  } | null>(null);

  const loadRazorpayScript = () =>
    new Promise<boolean>((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail: customerEmail.trim() || "customer@dheero.in",
          customerMobile,
          shippingAddress,
          city,
          district: city,
          state,
          pincode,
          paymentMethod,
          items: cart.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Unable to place order.");
        setSubmitting(false);
        return;
      }

      if (paymentMethod === "cod") {
        clearCart();
        setConfirmedOrder({
          orderNumber: data.orderNumber,
          totalAmount: data.totalAmount,
          orderStatus: data.orderStatus,
        });
        setSubmitting(false);
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        setErrorMsg("Unable to load payment gateway script.");
        setSubmitting(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: data.razorpayKeyId,
        amount: data.totalAmount * 100,
        currency: "INR",
        name: "DHEERO",
        description: `Order ${data.orderNumber}`,
        order_id: data.razorpayOrderId,
        prefill: {
          name: customerName,
          email: customerEmail || undefined,
          contact: customerMobile,
        },
        theme: { color: "#541D25" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: data.orderId, ...response }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.verified) {
            clearCart();
            setConfirmedOrder({
              orderNumber: data.orderNumber,
              totalAmount: data.totalAmount,
              orderStatus: "Confirmed",
            });
          } else {
            setErrorMsg(verifyData.error || "Payment verification failed.");
          }
          setSubmitting(false);
        },
      });
      rzp.open();
    } catch {
      setErrorMsg("Network error while placing order.");
      setSubmitting(false);
    }
  };

  if (confirmedOrder) {
    return (
      <div className="bg-[#F8F3E8] py-16 px-4 min-h-[75vh] flex items-center justify-center">
        <div className="max-w-lg w-full ivory-card rounded-3xl p-8 text-center space-y-5">
          <CheckCircle2 className="w-14 h-14 text-[#541D25] mx-auto" />
          <h1 className="font-serif-display text-4xl font-bold text-[#541D25]">
            Order Confirmed
          </h1>
          <p className="text-sm text-[#29231D]/85">
            Swamiye Saranam Ayyappa. Thank you for choosing DHEERO – ఇరుముడి రుమాలు.
          </p>
          <div className="p-4 rounded-2xl bg-white/80 border border-[#C6A04A]/50 text-sm space-y-1">
            <p>
              <strong>Order Number:</strong>{" "}
              <span className="text-[#C8242C] font-bold">{confirmedOrder.orderNumber}</span>
            </p>
            <p>
              <strong>Total Amount:</strong> ₹{confirmedOrder.totalAmount}
            </p>
            <p>
              <strong>Status:</strong> {confirmedOrder.orderStatus}
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-block px-7 py-3 rounded-full bg-[#541D25] text-[#F8F3E8] text-sm font-semibold"
          >
            Return to Product
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F3E8] py-10 sm:py-14 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="font-serif-display text-3xl sm:text-5xl font-bold text-[#541D25]">
            Cart & Checkout
          </h1>
          <p className="text-sm text-[#29231D]/75">
            Review your selected DHEERO – ఇరుముడి రుమాలు and complete delivery details.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="ivory-card rounded-3xl p-12 text-center space-y-4">
            <ShoppingBag className="w-12 h-12 mx-auto text-[#C6A04A]" />
            <h2 className="font-serif-display text-3xl font-bold text-[#541D25]">
              Your cart is empty
            </h2>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#C8242C] text-white text-sm font-semibold"
            >
              Explore ఇరుముడి రుమాలు <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Cart Items + Price Summary */}
            <div className="lg:col-span-6 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.variantId}
                  className="ivory-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.colorName}
                    className="w-full sm:w-28 h-36 sm:h-28 rounded-xl object-cover border border-[#C6A04A]/45 shrink-0"
                  />
                  <div className="flex-1 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="font-serif-display text-2xl font-bold text-[#541D25]">
                          {item.productName}
                        </h2>
                        <p className="text-xs text-[#29231D]/70">
                          Unit Price: ₹{item.price}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.variantId)}
                        aria-label="Remove item"
                        className="text-xs text-[#C8242C] inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>

                    {/* Inline Color Switcher */}
                    {variants.length > 0 && (
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
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                                active
                                  ? "bg-[#541D25] text-[#F8F3E8] border-[#541D25]"
                                  : "bg-white text-[#29231D] border-[#C6A04A]/50"
                              }`}
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: v.color_hex }}
                              />
                              {v.color_name}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-[#C6A04A]/25">
                      <div className="inline-flex items-center rounded-full border border-[#C6A04A]/55 bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="p-1.5 text-[#541D25]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="p-1.5 text-[#541D25]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-xl font-bold text-[#541D25]">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Totals Card */}
              <div className="ivory-card rounded-2xl p-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-semibold">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-semibold">
                    {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#C6A04A]/35 flex justify-between items-baseline">
                  <span className="font-bold text-base text-[#541D25]">
                    Final Payable Amount
                  </span>
                  <span className="text-2xl font-bold text-[#C8242C]">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Simple Checkout Form */}
            <form
              onSubmit={handlePlaceOrder}
              className="lg:col-span-6 ivory-card rounded-2xl p-6 sm:p-8 space-y-4"
            >
              <h2 className="font-serif-display text-2xl font-bold text-[#541D25]">
                Delivery Details
              </h2>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-red-900 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Full Name *</label>
                  <input
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#C6A04A]/50 text-sm outline-none focus:border-[#541D25]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Mobile Number *
                  </label>
                  <input
                    required
                    value={customerMobile}
                    onChange={(e) => setCustomerMobile(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#C6A04A]/50 text-sm outline-none focus:border-[#541D25]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#C6A04A]/50 text-sm outline-none focus:border-[#541D25]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Address *</label>
                <textarea
                  required
                  rows={2}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="House / Flat No., Street, Landmark"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#C6A04A]/50 text-sm outline-none focus:border-[#541D25]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">City *</label>
                  <input
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#C6A04A]/50 text-sm outline-none focus:border-[#541D25]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">State *</label>
                  <input
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#C6A04A]/50 text-sm outline-none focus:border-[#541D25]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">PIN Code *</label>
                  <input
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="507003"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#C6A04A]/50 text-sm outline-none focus:border-[#541D25]"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <p className="text-xs font-semibold">Payment Method</p>
                {codEnabled && (
                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#C6A04A]/50 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-[#541D25]"
                    />
                    <span>Cash on Delivery (COD)</span>
                  </label>
                )}
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#C6A04A]/50 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "razorpay"}
                    onChange={() => setPaymentMethod("razorpay")}
                    className="accent-[#541D25]"
                  />
                  <span>UPI / Cards / Netbanking (Razorpay)</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-full bg-[#C8242C] hover:bg-[#a91c23] disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <Lock className="w-4 h-4" />
                {submitting ? "Placing Order..." : `Confirm Order • ₹${totalAmount}`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
