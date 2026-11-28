"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#541D25] text-[#F8F3E8] border-t-2 border-[#C6A04A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="rounded-xl bg-[radial-gradient(ellipse_at_center,rgba(248,243,232,0.95)_0%,rgba(248,243,232,0.5)_58%,transparent_80%)] px-3 py-1">
              <img
                src="/images/dheero-logo.png"
                alt="DHEERO"
                className="h-11 w-auto"
              />
            </div>
            <p className="text-xs text-[#EFE6D5]/80">
              DHEERO – ఇరుముడి రుమాలు • A meaningful part of your devotional journey.
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#EFE6D5]/90">
            <Link href="/" className="hover:text-[#C6A04A] transition-colors">
              Home
            </Link>
            <Link href="/#our-story" className="hover:text-[#C6A04A] transition-colors">
              Our Story
            </Link>
            <Link href="/shop" className="hover:text-[#C6A04A] transition-colors">
              Product
            </Link>
            <Link href="/cart" className="hover:text-[#C6A04A] transition-colors">
              Cart
            </Link>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-[#C6A04A]/25 text-center space-y-1.5 text-xs text-[#EFE6D5]/75">
          <p>
            Dheer Eco Essentials • Khammam – 507003, Telangana, India • Contact: +91 7207147749
          </p>
          <p>
            DHEERO is an independent devotional lifestyle brand and is not officially affiliated
            with or endorsed by the Sabarimala temple or its administration.
          </p>
        </div>
      </div>
    </footer>
  );
}
