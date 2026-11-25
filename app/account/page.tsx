"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, MapPin, Package, Plus, Shield, User as UserIcon } from "lucide-react";
import type { Address, Order, User } from "@/lib/types";

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [showAddrForm, setShowAddrForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const loadAccount = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      if (!data.user) {
        router.replace("/login");
        return;
      }
      setUser(data.user);
      setAddresses(data.addresses || []);
      setOrders(data.orders || []);
    } catch {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccount();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/me", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: fullName,
        mobile,
        address_line: addressLine,
        city,
        district,
        state,
        pincode,
      }),
    });
    if (res.ok) {
      setShowAddrForm(false);
      setFullName("");
      setMobile("");
      setAddressLine("");
      setCity("");
      setDistrict("");
      setState("");
      setPincode("");
      loadAccount();
    }
  };

  if (loading || !user) {
    return (
      <div className="parchment-surface py-20 text-center text-[#5A2E0B]">
        Loading your account...
      </div>
    );
  }

  return (
    <div className="parchment-surface py-10 sm:py-14 min-h-[75vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="parchment-card rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#7A0E0E] text-[#D4A017] flex items-center justify-center">
              <UserIcon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-serif-display text-3xl font-bold text-[#5A2E0B]">
                {user.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#5A2E0B]/75">
                {user.email} {user.mobile ? `• +91 ${user.mobile}` : ""}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#7A0E0E] text-[#F9F3E6] text-xs font-semibold"
              >
                <Shield className="w-4 h-4 text-[#D4A017]" /> Admin Dashboard
              </Link>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#7A0E0E] text-[#7A0E0E] text-xs font-semibold hover:bg-[#7A0E0E]/5"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Saved Addresses */}
          <div className="lg:col-span-4 space-y-4">
            <div className="parchment-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif-display text-2xl font-bold text-[#7A0E0E] flex items-center gap-2">
                  <MapPin className="w-5 h-5" /> Saved Addresses
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAddrForm((s) => !s)}
                  className="p-1.5 rounded-full bg-[#F26500] text-white"
                  aria-label="Add address"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {showAddrForm && (
                <form onSubmit={handleAddAddress} className="space-y-2.5 pt-2 border-t border-[#D4A017]/30">
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#D4A017]/50 text-xs"
                  />
                  <input
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Mobile"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#D4A017]/50 text-xs"
                  />
                  <input
                    required
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="Address Line"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#D4A017]/50 text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="px-3 py-2 rounded-lg bg-white border border-[#D4A017]/50 text-xs"
                    />
                    <input
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="District"
                      className="px-3 py-2 rounded-lg bg-white border border-[#D4A017]/50 text-xs"
                    />
                    <input
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State"
                      className="px-3 py-2 rounded-lg bg-white border border-[#D4A017]/50 text-xs"
                    />
                    <input
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="PIN Code"
                      className="px-3 py-2 rounded-lg bg-white border border-[#D4A017]/50 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 rounded-full bg-[#7A0E0E] text-white text-xs font-semibold"
                  >
                    Save Address
                  </button>
                </form>
              )}

              {addresses.length === 0 ? (
                <p className="text-xs text-[#5A2E0B]/70">No saved addresses yet.</p>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-3 rounded-xl bg-white/75 border border-[#D4A017]/35 text-xs space-y-0.5"
                    >
                      <p className="font-bold text-[#5A2E0B]">{addr.full_name}</p>
                      <p>{addr.address_line}</p>
                      <p>
                        {addr.city}, {addr.district}, {addr.state} – {addr.pincode}
                      </p>
                      <p className="text-[#7A0E0E]">Mobile: {addr.mobile}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order History */}
          <div className="lg:col-span-8 space-y-4">
            <div className="parchment-card rounded-2xl p-6 space-y-4">
              <h2 className="font-serif-display text-2xl font-bold text-[#7A0E0E] flex items-center gap-2">
                <Package className="w-5 h-5" /> Order History
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <p className="text-sm text-[#5A2E0B]/75">
                    You have not placed any orders yet.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block px-6 py-2.5 rounded-full bg-[#F26500] text-white text-xs font-semibold"
                  >
                    Shop Irumudi Rumala
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-xl bg-white/80 border border-[#D4A017]/40 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D4A017]/25 pb-2">
                        <div>
                          <p className="font-bold text-sm text-[#7A0E0E]">
                            {order.order_number}
                          </p>
                          <p className="text-[11px] text-[#5A2E0B]/70">
                            {new Date(order.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-[#7A0E0E] text-[#F9F3E6] text-xs font-semibold">
                            {order.order_status}
                          </span>
                          <span className="font-bold text-sm text-[#5A2E0B]">
                            ₹{order.total_amount}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-[#32170B]">
                        {order.items?.map((item) => (
                          <p key={item.id}>
                            {item.product_name} ({item.color_name}) × {item.quantity} — ₹
                            {item.total_price}
                          </p>
                        ))}
                      </div>

                      {order.tracking_number && (
                        <p className="text-xs font-semibold text-[#1F6F3D]">
                          Tracking ID: {order.tracking_number}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
