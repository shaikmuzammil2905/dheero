"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useStore } from "./StoreProvider";
import { playTempleGhanta } from "@/lib/sound";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#our-story", label: "Our Story" },
  { href: "/shop", label: "Product" },
  { href: "/cart", label: "Cart" },
];

export function Navbar() {
  const pathname = usePathname();
  const { cartCount } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 border-b ${
        scrolled
          ? "bg-[#F8F3E8]/95 backdrop-blur-md border-[#C6A04A]/40 shadow-sm"
          : "bg-[#F8F3E8]/90 border-[#C6A04A]/25"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        {/* Left: DHEERO Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <img
            src="/images/dheero-logo.png"
            alt="DHEERO"
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Minimal Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : link.href.startsWith("/#")
                ? false
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  if (link.href === "/shop") playTempleGhanta();
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#541D25] text-[#F8F3E8]"
                    : "text-[#29231D] hover:text-[#541D25] hover:bg-[#EFE6D5]"
                }`}
              >
                {link.label === "Cart" && <ShoppingBag className="w-4 h-4" />}
                <span>{link.label}</span>
                {link.label === "Cart" && cartCount > 0 && (
                  <span className="ml-0.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#C8242C] text-white text-[11px] font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Compact Actions */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative p-2 rounded-full text-[#541D25] hover:bg-[#EFE6D5]"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#C8242C] text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-lg text-[#541D25] border border-[#C6A04A]/45 bg-[#EFE6D5]/70"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Compact Mobile Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden overflow-hidden bg-[#F8F3E8] border-t border-[#C6A04A]/30"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    if (link.href === "/shop") playTempleGhanta();
                    setMobileOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#29231D] hover:bg-[#EFE6D5] flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  {link.label === "Cart" && cartCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#C8242C] text-white text-xs font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
