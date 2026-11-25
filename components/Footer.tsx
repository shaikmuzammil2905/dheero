"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle, ExternalLink } from "lucide-react";
import { useStore } from "./StoreProvider";

export function Footer() {
  const { settings } = useStore();
  const phone = settings.phone || "7207147749";
  const whatsapp = settings.whatsapp || "7207147749";
  const email = settings.email || "dheergopichand@gmail.com";
  const address =
    settings.address ||
    "P No. 60, Teacher's Colony, Yedulapuram, Khammam – 507003, Telangana, India";
  const gst = settings.gst || "36ACMPL5503H";

  return (
    <footer className="bg-[#7A0E0E] text-[#F9F3E6] border-t-4 border-[#D4A017]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <img
              src="/images/dheero-logo.png"
              alt="DHEERO™"
              className="h-14 w-auto drop-shadow-[0_2px_10px_rgba(249,243,230,0.45)]"
            />
            <p className="text-sm text-[#F9F3E6]/85 leading-relaxed">
              DHEERO™ by <strong className="text-white">Dheer Eco Essentials</strong> —
              Thoughtfully designed devotional headwear and essentials inspired by Indian
              heritage, comfort, and tradition.
            </p>
            <p className="text-xs text-[#D4A017]">
              GSTIN: {gst} • Retail & Wholesale
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-serif-display text-xl font-bold text-[#D4A017] mb-3">
              Explore DHEERO™
            </h3>
            <ul className="space-y-2 text-sm text-[#F9F3E6]/85">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  Shop Irumudi Rumala
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/craft" className="hover:text-white transition-colors">
                  Our Craft
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Wholesale
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-serif-display text-xl font-bold text-[#D4A017] mb-3">
              Customer Service
            </h3>
            <ul className="space-y-2 text-sm text-[#F9F3E6]/85">
              <li>
                <Link href="/policies/shipping" className="hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-white transition-colors">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/refund" className="hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Track Order / My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3 text-sm text-[#F9F3E6]/90">
            <h3 className="font-serif-display text-xl font-bold text-[#D4A017] mb-3">
              Connect With Us
            </h3>
            <a
              href={`tel:+91${phone}`}
              className="flex items-center gap-2.5 hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4 text-[#D4A017] shrink-0" />
              <span>+91 {phone}</span>
            </a>
            <a
              href={`https://wa.me/91${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 hover:text-white transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#D4A017] shrink-0" />
              <span>WhatsApp: +91 {whatsapp}</span>
            </a>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2.5 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4 text-[#D4A017] shrink-0" />
              <span className="break-all">{email}</span>
            </a>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
              <span className="text-xs leading-relaxed text-[#F9F3E6]/80">{address}</span>
            </div>
            <div className="pt-2">
              <a
                href={settings.instagram_url || "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#32170B]/60 border border-[#D4A017]/40 text-xs hover:bg-[#32170B]"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#D4A017]" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Respectful Disclaimer */}
        <div className="mt-10 pt-6 border-t border-[#D4A017]/30 text-center space-y-2">
          <p className="text-xs text-[#F9F3E6]/80 max-w-3xl mx-auto leading-relaxed">
            DHEERO™ is an independent brand offering devotional and traditional headwear. It
            is not officially affiliated with or endorsed by the Sabarimala temple or its
            administration. Product use is entirely optional.
          </p>
          <p className="text-xs text-[#D4A017]/90">
            © {new Date().getFullYear()} Dheer Eco Essentials (DHEERO™). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
