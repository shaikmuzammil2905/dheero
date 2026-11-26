"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  MessageCircle,
  ShieldCheck,
  Truck,
  UserPlus,
  Award,
} from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { playSwamiyeSaranamAyyappa } from "@/lib/sound";

export default function LoginPage() {
  const router = useRouter();
  const { settings } = useStore();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const whatsapp = settings.whatsapp || "7207147749";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Login failed.");
        setLoading(false);
        return;
      }
      playSwamiyeSaranamAyyappa();
      if (data.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, mobile, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Registration failed.");
        setLoading(false);
        return;
      }
      playSwamiyeSaranamAyyappa();
      router.push("/account");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Unable to reset password.");
      } else {
        setInfoMsg(data.message);
        setMode("login");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[88vh] flex items-center justify-center py-12 px-4 overflow-hidden bg-[#1B100A]">
      {/* Grand Animated Sabarimala Temple & Brass Lamp Background */}
      <img
        src="/images/login-bg.png"
        alt="Sabarimala Devotional Atmosphere"
        className="absolute inset-0 w-full h-full object-cover animate-hero-drift"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1B100A]/45 via-[#1B100A]/20 to-[#1B100A]/65" />

      <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Atmospheric Quote */}
        <div className="hidden lg:block lg:col-span-3 text-center space-y-2 text-[#F9F3E6]">
          <p className="font-serif-display text-2xl italic drop-shadow-lg">
            Your Trusted Devotional Partner for Sabarimala
          </p>
          <div className="h-1 w-24 mx-auto rounded-full bg-[#F26500]" />
        </div>

        {/* Center: Antique Parchment Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto space-y-4">
          <div className="parchment-card rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="text-center space-y-2">
              <img
                src="/images/dheero-logo.png"
                alt="DHEERO™"
                className="h-16 sm:h-20 w-auto mx-auto"
              />
              <div className="flex items-center justify-center gap-2 text-[#D4A017]">
                <span className="h-[1px] w-12 bg-[#D4A017]" />
                <span>✦</span>
                <span className="h-[1px] w-12 bg-[#D4A017]" />
              </div>
              <h1 className="font-serif-display text-2xl font-bold text-[#5A2E0B]">
                {mode === "login"
                  ? "Welcome Back, Devotee"
                  : mode === "register"
                  ? "Create Your DHEERO™ Account"
                  : "Reset Password"}
              </h1>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-red-900 text-xs">
                {errorMsg}
              </div>
            )}
            {infoMsg && (
              <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs">
                {infoMsg}
              </div>
            )}

            {mode === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7A0E0E] absolute left-3.5 top-3.5" />
                  <input
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Email or Mobile Number"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#D4A017]/60 text-sm outline-none focus:border-[#F26500]"
                  />
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7A0E0E] absolute left-3.5 top-3.5" />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-white border border-[#D4A017]/60 text-sm outline-none focus:border-[#F26500]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label="Toggle password visibility"
                    className="absolute right-3 top-3 text-[#5A2E0B]/70"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#D84B00] via-[#F26500] to-[#D84B00] text-white font-bold tracking-wider text-sm shadow-lg hover:brightness-105 disabled:opacity-60"
                >
                  {loading ? "SIGNING IN..." : "LOGIN"}
                </button>

                <div className="text-center space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg("");
                      setMode("forgot");
                    }}
                    className="text-xs font-semibold text-[#7A0E0E] underline"
                  >
                    Forgot Password?
                  </button>
                  <div className="text-xs text-[#5A2E0B]/60">or</div>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg("");
                      setMode("register");
                    }}
                    className="w-full py-2.5 rounded-full border border-[#D4A017] bg-white/75 text-[#5A2E0B] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white"
                  >
                    <UserPlus className="w-4 h-4 text-[#7A0E0E]" /> Create an Account
                  </button>
                </div>
              </form>
            )}

            {mode === "register" && (
              <form onSubmit={handleRegister} className="space-y-3">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4A017]/60 text-sm outline-none focus:border-[#F26500]"
                />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4A017]/60 text-sm outline-none focus:border-[#F26500]"
                />
                <input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Mobile Number (10 digits)"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4A017]/60 text-sm outline-none focus:border-[#F26500]"
                />
                <input
                  required
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create Password (min 6 chars)"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4A017]/60 text-sm outline-none focus:border-[#F26500]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-[#F26500] text-white font-bold text-sm shadow-lg"
                >
                  {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                </button>
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="w-full text-xs font-semibold text-[#7A0E0E] underline pt-1"
                >
                  Already have an account? Back to Login
                </button>
              </form>
            )}

            {mode === "forgot" && (
              <form onSubmit={handleForgot} className="space-y-3">
                <input
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Registered Email or Mobile Number"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4A017]/60 text-sm outline-none focus:border-[#F26500]"
                />
                <input
                  required
                  type="password"
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password (min 6 chars)"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4A017]/60 text-sm outline-none focus:border-[#F26500]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-[#7A0E0E] text-white font-bold text-sm shadow-lg"
                >
                  {loading ? "UPDATING..." : "RESET PASSWORD"}
                </button>
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="w-full text-xs font-semibold text-[#7A0E0E] underline pt-1"
                >
                  Back to Login
                </button>
              </form>
            )}

            {/* Card Trust Row */}
            <div className="pt-3 border-t border-[#D4A017]/35 grid grid-cols-3 gap-2 text-center text-[11px] text-[#5A2E0B]">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#7A0E0E]" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-[#7A0E0E]" />
                <span>Reliable Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Award className="w-4 h-4 text-[#7A0E0E]" />
                <span>Authentic & Trusted</span>
              </div>
            </div>
          </div>

          {/* Secure Checkout Pill Below Card */}
          <div className="mx-auto max-w-sm rounded-full bg-[#32170B]/90 border border-[#D4A017]/60 px-5 py-2.5 text-center text-[#F9F3E6] shadow-xl">
            <p className="text-xs font-bold flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#D4A017]" /> Secure Checkout
            </p>
            <p className="text-[10px] text-[#F9F3E6]/75">
              Your Payments are Safe & Encrypted
            </p>
          </div>
        </div>

        {/* Right Atmospheric Label */}
        <div className="hidden lg:flex lg:col-span-3 flex-col items-center text-center space-y-3 text-[#F9F3E6]">
          <div className="space-y-1 bg-[#32170B]/55 backdrop-blur-sm px-5 py-4 rounded-2xl border border-[#D4A017]/50 shadow-xl">
            <p className="font-serif-display text-2xl italic drop-shadow-lg">
              Sabarimala Devotional Essentials
            </p>
            <span className="text-[#D4A017] text-sm">✦ ✦ ✦</span>
          </div>
        </div>
      </div>
    </div>
  );
}
