"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Lock, ShieldCheck, Truck, AlertCircle } from "lucide-react";
import { useStore } from "@/components/StoreProvider";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart, settings } = useStore();

  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("cod");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderNumber: string;
    totalAmount: number;
    paymentStatus: string;
    orderStatus: string;
  } | null>(null);

  const codEnabled = settings.cod_enabled !== "0";
  const baseShipping = Number(settings.shipping_fee ?? 59);
  const freeThreshold = Number(settings.free_shipping_threshold ?? 999);
  const shippingFee = cartSubtotal === 0 ? 0 : cartSubtotal >= freeThreshold ? 0 : baseShipping;
  const totalAmount = cartSubtotal + shippingFee;

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setCustomerName((v) => v || data.user.name || "");
          setCustomerEmail((v) => v || data.user.email || "");
          setCustomerMobile((v) => v || data.user.mobile || "");
        }
        if (data.addresses?.[0]) {
          const a = data.addresses[0];
          setShippingAddress((v) => v || a.address_line || "");
          setCity((v) => v || a.city || "");
          setDistrict((v) => v || a.district || "");
          setState((v) => v || a.state || "");
          setPincode((v) => v || a.pincode || "");
        }
      })
      .catch(() => {});
  }, []);

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
          customerEmail,
          customerMobile,
          shippingAddress,
          city,
          district,
          state,
          pincode,
          paymentMethod,
          notes,
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
          paymentStatus: data.paymentStatus,
          orderStatus: data.orderStatus,
        });
        setSubmitting(false);
        return;
      }

      // Razorpay online checkout + server-side verification
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        setErrorMsg("Unable to load Razorpay payment gateway script.");
        setSubmitting(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: data.razorpayKeyId,
        amount: data.totalAmount * 100,
        currency: "INR",
        name: "DHEERO™",
        description: `Order ${data.orderNumber}`,
        order_id: data.razorpayOrderId,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerMobile,
        },
        theme: { color: "#7A0E0E" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: data.orderId,
              ...response,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.verified) {
            clearCart();
            setConfirmedOrder({
              orderNumber: data.orderNumber,
              totalAmount: data.totalAmount,
              paymentStatus: "verified",
              orderStatus: "Confirmed",
            });
          } else {
            setErrorMsg(
              verifyData.error ||
                "Payment verification failed. Contact support with your Order ID."
            );
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
      <div className="parchment-surface py-16 px-4 min-h-[75vh] flex items-center justify-center">
        <div className="max-w-xl w-full parchment-card rounded-3xl p-8 text-center space-y-5">
          <CheckCircle2 className="w-16 h-16 text-[#1F6F3D] mx-auto" />
          <h1 className="font-serif-display text-4xl font-bold text-[#5A2E0B]">
            Order Confirmed!
          </h1>
          <p className="text-sm text-[#32170B]/85">
            Swamiye Saranam Ayyappa. Thank you for choosing DHEERO™. Your order has been
            recorded and confirmed.
          </p>
          <div className="p-4 rounded-2xl bg-white/85 border border-[#D4A017]/50 text-sm space-y-1.5">
            <p>
              <strong>Order ID:</strong>{" "}
              <span className="text-[#7A0E0E] font-bold">{confirmedOrder.orderNumber}</span>
            </p>
            <p>
              <strong>Total Amount:</strong> ₹{confirmedOrder.totalAmount}
            </p>
            <p>
              <strong>Status:</strong> {confirmedOrder.orderStatus} (
              {confirmedOrder.paymentStatus})
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/account"
              className="px-6 py-3 rounded-full bg-[#7A0E0E] text-white text-sm font-semibold"
            >
              View Order History
            </Link>
            <Link
              href="/shop"
              className="px-6 py-3 rounded-full border border-[#7A0E0E] text-[#7A0E0E] text-sm font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="parchment-surface py-20 px-4 text-center space-y-4">
        <h1 className="font-serif-display text-4xl font-bold text-[#5A2E0B]">
          No items in cart
        </h1>
        <Link
          href="/shop"
          className="inline-block px-7 py-3 rounded-full bg-[#F26500] text-white font-semibold text-sm"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="parchment-surface py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="font-serif-display text-3xl sm:text-5xl font-bold text-[#5A2E0B]">
            Secure Checkout
          </h1>
          <p className="text-xs sm:text-sm text-[#5A2E0B]/75">
            Complete your delivery address and select a verified payment option.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-100 border border-red-300 text-red-900 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left: Delivery Details */}
          <div className="lg:col-span-7 parchment-card rounded-2xl p-6 sm:p-8 space-y-5">
            <h2 className="font-serif-display text-2xl font-bold text-[#7A0E0E]">
              1. Delivery Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#5A2E0B] mb-1">
                  Full Name *
                </label>
                <input
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Recipient full name"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4A017]/50 text-sm outline-none focus:border-[#F26500]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5A2E0B] mb-1">
                  Mobile Number *
                </label>
                <input
                  required
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value)}
                  placeholder="10-digit mobile"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4A017]/50 text-sm outline-none focus:border-[#F26500]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5A2E0B] mb-1">
                Email Address *
              </label>
              <input
                required
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4A017]/50 text-sm outline-none focus:border-[#F26500]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5A2E0B] mb-1">
                Full Delivery Address *
              </label>
              <textarea
                required
                rows={2}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="House / Flat No., Street, Landmark"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4A017]/50 text-sm outline-none focus:border-[#F26500]"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#5A2E0B] mb-1">
                  City *
                </label>
                <input
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#D4A017]/50 text-sm outline-none focus:border-[#F26500]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5A2E0B] mb-1">
                  District *
                </label>
                <input
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#D4A017]/50 text-sm outline-none focus:border-[#F26500]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5A2E0B] mb-1">
                  State *
                </label>
                <input
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#D4A017]/50 text-sm outline-none focus:border-[#F26500]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5A2E0B] mb-1">
                  PIN Code *
                </label>
                <input
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="507003"
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#D4A017]/50 text-sm outline-none focus:border-[#F26500]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5A2E0B] mb-1">
                Order Notes (Optional)
              </label>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any delivery instructions..."
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4A017]/50 text-sm outline-none focus:border-[#F26500]"
              />
            </div>

            {/* Payment Selection */}
            <div className="pt-4 border-t border-[#D4A017]/35 space-y-3">
              <h2 className="font-serif-display text-2xl font-bold text-[#7A0E0E]">
                2. Payment Method
              </h2>

              {codEnabled && (
                <label className="flex items-start gap-3 p-4 rounded-xl bg-white border-2 border-[#D4A017]/50 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mt-1 accent-[#F26500]"
                  />
                  <div>
                    <p className="font-semibold text-sm text-[#5A2E0B]">
                      Cash on Delivery (COD)
                    </p>
                    <p className="text-xs text-[#5A2E0B]/75">
                      Pay in cash or UPI upon delivery at your doorstep.
                    </p>
                  </div>
                </label>
              )}

              <label className="flex items-start gap-3 p-4 rounded-xl bg-white border-2 border-[#D4A017]/50 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                  className="mt-1 accent-[#F26500]"
                />
                <div>
                  <p className="font-semibold text-sm text-[#5A2E0B]">
                    Online Payment — UPI / Cards / Netbanking (Razorpay)
                  </p>
                  <p className="text-xs text-[#5A2E0B]/75">
                    Verified via server-side HMAC signature check.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 parchment-card rounded-2xl overflow-hidden">
            <div className="bg-[#7A0E0E] text-[#F9F3E6] px-6 py-4">
              <h2 className="font-serif-display text-2xl font-bold">Order Summary</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image}
                        alt={item.colorName}
                        className="w-12 h-12 rounded-lg object-cover border border-[#D4A017]/40"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-[#5A2E0B] truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-[#7A0E0E]">
                          {item.colorName} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-[#5A2E0B]">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#D4A017]/35 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-[#D4A017]/35">
                  <span className="font-bold text-base text-[#5A2E0B]">Total Payable</span>
                  <span className="text-2xl font-bold text-[#7A0E0E]">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-full bg-[#F26500] hover:bg-[#d85700] disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <Lock className="w-4 h-4" />
                {submitting ? "Processing Order..." : "PLACE ORDER SECURELY"}
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-[#5A2E0B]/75 pt-1">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1F6F3D]" /> Verified Checkout
                </span>
                <span className="inline-flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#7A0E0E]" /> Pan-India Shipping
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
