"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  User,
  ShoppingCart,
  X,
  Home,
  ShoppingBag,
  MoreHorizontal,
  MessageCircle,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useStore } from "./StoreProvider";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About Us" },
  { href: "/craft", label: "Our Craft" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    cart,
    cartCount,
    cartSubtotal,
    updateQuantity,
    removeFromCart,
    isCartDrawerOpen,
    setCartDrawerOpen,
    settings,
    products,
    faqs,
  } = useStore();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const whatsappNum = settings.whatsapp || "7207147749";
  const whatsappUrl = `https://wa.me/91${whatsappNum}?text=${encodeURIComponent(
    "Namaskaram! I would like to know more about DHEERO™ Irumudi Rumala."
  )}`;

  const query = searchQuery.trim().toLowerCase();
  const matchedProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.variants.some((v) => v.color_name.toLowerCase().includes(query))
  );
  const matchedFaqs = query
    ? faqs.filter(
        (f) =>
          f.question.toLowerCase().includes(query) || f.answer.toLowerCase().includes(query)
      )
    : [];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 border-b ${
          scrolled
            ? "bg-[#F9F3E6]/95 backdrop-blur-md border-[#D4A017]/40 shadow-md"
            : "bg-[#F9F3E6] border-[#D4A017]/25"
        }`}
      >
        <div className="temple-border-top w-full" />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-3">
          {/* Left: Tripundra Hamburger (Mobile) + Original DHEERO Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open devotional navigation menu"
              className="lg:hidden p-2 rounded-lg bg-[#32170B]/90 border border-[#D4A017]/50 shadow-sm active:scale-95 transition-transform flex flex-col justify-center items-center gap-[4px] w-10 h-10"
            >
              {/* Symbolic Tripundra-inspired hamburger: Gandham saffron, Vibhuti white, Kumkum red */}
              <span className="block w-6 h-[3px] rounded-full bg-[#F26500]" />
              <span className="block w-6 h-[3px] rounded-full bg-white shadow-[0_0_2px_rgba(255,255,255,0.8)]" />
              <span className="block w-6 h-[3px] rounded-full bg-[#B91C1C]" />
            </button>

            <Link href="/" className="flex items-center shrink-0">
              <img
                src="/images/dheero-logo.png"
                alt="DHEERO™"
                className="h-11 sm:h-13 md:h-14 w-auto object-contain mix-blend-multiply"
              />
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    active
                      ? "bg-[#7A0E0E] text-[#F9F3E6] shadow-sm border border-[#D4A017]/50"
                      : "text-[#5A2E0B] hover:text-[#7A0E0E] hover:bg-[#D4A017]/15"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Search, My Account, Cart, WhatsApp */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products and FAQs"
              className="p-2 sm:p-2.5 rounded-full text-[#5A2E0B] hover:bg-[#D4A017]/15 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/account"
              aria-label="My Account"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-[#5A2E0B] hover:bg-[#D4A017]/15 transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="hidden xl:inline">My Account</span>
            </Link>

            <button
              type="button"
              onClick={() => setCartDrawerOpen(true)}
              aria-label="Open shopping cart"
              className="relative p-2 sm:px-3 sm:py-2 rounded-full text-[#5A2E0B] hover:bg-[#D4A017]/15 transition-colors flex items-center gap-1.5"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden xl:inline text-sm font-medium">Cart</span>
              <span className="absolute -top-0.5 -right-0.5 sm:static inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#F26500] text-white text-[11px] font-bold">
                {cartCount}
              </span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1F6F3D] hover:bg-[#17552E] text-white text-xs font-semibold tracking-wide shadow-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile quick navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#7A0E0E] text-[#F9F3E6] border-t border-[#D4A017]/50 grid grid-cols-5 h-16 shadow-[0_-4px_20px_rgba(50,23,11,0.25)]"
      >
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] ${
            pathname === "/" ? "bg-[#F26500] text-white font-semibold" : "text-[#F9F3E6]/85"
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] ${
            pathname.startsWith("/shop")
              ? "bg-[#F26500] text-white font-semibold"
              : "text-[#F9F3E6]/85"
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Shop</span>
        </Link>
        <Link
          href="/cart"
          className={`relative flex flex-col items-center justify-center gap-0.5 text-[11px] ${
            pathname.startsWith("/cart")
              ? "bg-[#F26500] text-white font-semibold"
              : "text-[#F9F3E6]/85"
          }`}
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#D4A017] text-[#32170B] text-[10px] font-bold rounded-full min-w-[17px] h-[17px] flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </Link>
        <Link
          href="/account"
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] ${
            pathname.startsWith("/account") || pathname.startsWith("/login")
              ? "bg-[#F26500] text-white font-semibold"
              : "text-[#F9F3E6]/85"
          }`}
        >
          <User className="w-5 h-5" />
          <span>Account</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center gap-0.5 text-[11px] text-[#F9F3E6]/85"
        >
          <MoreHorizontal className="w-5 h-5" />
          <span>More</span>
        </button>
      </nav>

      {/* Slide-in Devotional Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#32170B]/70 backdrop-blur-sm flex"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="w-80 max-w-[85vw] h-full parchment-surface border-r-2 border-[#D4A017]/60 flex flex-col justify-between p-6 overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#D4A017]/30">
                  <img
                    src="/images/dheero-logo.png"
                    alt="DHEERO™"
                    className="h-11 w-auto mix-blend-multiply"
                  />
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                    className="p-2 rounded-full bg-[#7A0E0E]/10 text-[#7A0E0E]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Symbolic Tripundra Accent Bar */}
                <div className="my-4 space-y-1">
                  <div className="h-[3px] w-full rounded-full bg-[#F26500]" />
                  <div className="h-[3px] w-full rounded-full bg-white border border-[#D4A017]/30" />
                  <div className="h-[3px] w-full rounded-full bg-[#7A0E0E]" />
                </div>

                <div className="space-y-1.5 mt-4">
                  {NAV_LINKS.map((link) => {
                    const active =
                      link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-colors ${
                          active
                            ? "bg-[#7A0E0E] text-[#F9F3E6]"
                            : "text-[#5A2E0B] hover:bg-[#D4A017]/15"
                        }`}
                      >
                        <span>{link.label}</span>
                        <ArrowRight className="w-4 h-4 opacity-70" />
                      </Link>
                    );
                  })}
                  <Link
                    href="/login"
                    className="flex items-center justify-between px-4 py-3 rounded-xl font-medium text-[#5A2E0B] hover:bg-[#D4A017]/15"
                  >
                    <span>Login / Register</span>
                    <User className="w-4 h-4 opacity-70" />
                  </Link>
                  <Link
                    href="/admin"
                    className="flex items-center justify-between px-4 py-3 rounded-xl font-medium text-[#7A0E0E] hover:bg-[#D4A017]/15"
                  >
                    <span>Admin Console</span>
                    <Sparkles className="w-4 h-4 opacity-70" />
                  </Link>
                </div>
              </div>

              <div className="pt-6 border-t border-[#D4A017]/30 space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1F6F3D] text-white font-semibold text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Support (+91 {whatsappNum})
                </a>
                <p className="text-xs text-center text-[#5A2E0B]/75">
                  Swamiye Saranam Ayyappa
                </p>
              </div>
            </motion.div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-in Cart Drawer Popup */}
      <AnimatePresence>
        {isCartDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#32170B]/65 backdrop-blur-sm flex justify-end"
          >
            <div className="flex-1" onClick={() => setCartDrawerOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="w-full max-w-md h-full parchment-surface border-l-2 border-[#D4A017]/60 flex flex-col justify-between p-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#D4A017]/30">
                <div>
                  <h2 className="font-serif-display text-2xl font-bold text-[#5A2E0B]">
                    Your Cart ({cartCount})
                  </h2>
                  <p className="text-xs text-[#5A2E0B]/70">
                    DHEERO™ Devotional Essentials
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCartDrawerOpen(false)}
                  aria-label="Close cart drawer"
                  className="p-2 rounded-full bg-[#7A0E0E]/10 text-[#7A0E0E]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-14 space-y-4">
                    <ShoppingCart className="w-12 h-12 mx-auto text-[#D4A017]" />
                    <p className="text-[#5A2E0B] font-medium">
                      Your devotional cart is empty.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setCartDrawerOpen(false);
                        router.push("/shop");
                      }}
                      className="px-6 py-2.5 rounded-full bg-[#F26500] text-white text-sm font-semibold shadow-md"
                    >
                      Explore Irumudi Rumala
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.variantId}
                      className="flex gap-3 p-3 rounded-xl bg-white/80 border border-[#D4A017]/30 shadow-sm"
                    >
                      <img
                        src={item.image}
                        alt={item.colorName}
                        className="w-20 h-20 rounded-lg object-cover shrink-0 border border-[#D4A017]/30"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-[#5A2E0B] truncate">
                          {item.productName}
                        </h3>
                        <p className="text-xs text-[#7A0E0E] font-medium flex items-center gap-1.5 mt-0.5">
                          <span
                            className="inline-block w-2.5 h-2.5 rounded-full border border-black/20"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          {item.colorName}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="inline-flex items-center border border-[#D4A017]/50 rounded-lg bg-[#F9F3E6]">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity - 1)
                              }
                              className="p-1.5 text-[#5A2E0B]"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2.5 text-xs font-bold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity + 1)
                              }
                              className="p-1.5 text-[#5A2E0B]"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="font-bold text-sm text-[#7A0E0E]">
                            ₹{item.price * item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.variantId)}
                            aria-label="Remove item"
                            className="p-1.5 text-[#7A0E0E]/70 hover:text-[#7A0E0E]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-4 border-t border-[#D4A017]/30 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#5A2E0B]/80">Subtotal</span>
                    <span className="text-lg font-bold text-[#7A0E0E]">
                      ₹{cartSubtotal}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Link
                      href="/cart"
                      onClick={() => setCartDrawerOpen(false)}
                      className="py-3 rounded-xl border border-[#7A0E0E] text-[#7A0E0E] text-center text-sm font-semibold hover:bg-[#7A0E0E]/5"
                    >
                      View Cart
                    </Link>
                    <Link
                      href="/checkout"
                      onClick={() => setCartDrawerOpen(false)}
                      className="py-3 rounded-xl bg-[#F26500] hover:bg-[#d85700] text-white text-center text-sm font-semibold shadow-md"
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Popup Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#32170B]/70 backdrop-blur-sm flex items-start justify-center pt-16 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl parchment-card rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-[#D4A017]/40 pb-3">
                <Search className="w-5 h-5 text-[#7A0E0E]" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search DHEERO™ Irumudi Rumala, colours, care, FAQs..."
                  className="flex-1 bg-transparent outline-none text-[#32170B] placeholder:text-[#5A2E0B]/50 text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="p-1.5 rounded-full hover:bg-[#7A0E0E]/10 text-[#7A0E0E]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 max-h-80 overflow-y-auto space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#7A0E0E] mb-2">
                    Products
                  </p>
                  {matchedProducts.map((p) => (
                    <Link
                      key={p.id}
                      href="/shop"
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#D4A017]/15 transition-colors"
                    >
                      <img
                        src={p.variants[0]?.primary_image || "/images/rumala-turmeric.jpg"}
                        alt={p.name}
                        className="w-12 h-12 rounded-lg object-cover border border-[#D4A017]/40"
                      />
                      <div>
                        <p className="font-semibold text-sm text-[#5A2E0B]">{p.name}</p>
                        <p className="text-xs text-[#5A2E0B]/70">
                          {p.variants.map((v) => v.color_name).join(" • ")} — ₹{p.base_price}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {matchedFaqs.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#7A0E0E] mb-2">
                      Frequently Asked Questions
                    </p>
                    {matchedFaqs.slice(0, 4).map((f) => (
                      <Link
                        key={f.id}
                        href="/faq"
                        onClick={() => setSearchOpen(false)}
                        className="block p-2.5 rounded-xl hover:bg-[#D4A017]/15 text-sm text-[#5A2E0B]"
                      >
                        {f.question}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
