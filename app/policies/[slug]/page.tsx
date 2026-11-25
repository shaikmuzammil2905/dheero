import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

const POLICIES: Record<string, { title: string; updated: string; sections: string[] }> = {
  shipping: {
    title: "Shipping Policy",
    updated: "November 2026",
    sections: [
      "Orders placed on DHEERO™ (Dheer Eco Essentials) are typically dispatched within 1–2 business days from Khammam, Telangana.",
      "Standard Pan-India delivery takes approximately 3–6 business days depending on the destination PIN code and courier serviceability.",
      "Shipping charges are calculated transparently at checkout. Orders above the free-shipping threshold configured by the store qualify for complimentary shipping.",
      "Tracking details are updated in your My Account order history once dispatched.",
    ],
  },
  returns: {
    title: "Return Policy",
    updated: "November 2026",
    sections: [
      "We accept return or replacement requests within 7 days of delivery for unused, unwashed items in their original folded packaging.",
      "If you receive a damaged, defective, or incorrect colour variant, please contact us within 48 hours of delivery with order details and photographs.",
      "For hygiene and devotional respect, washed, used, or altered items cannot be accepted for return.",
    ],
  },
  refund: {
    title: "Refund Policy",
    updated: "November 2026",
    sections: [
      "Once a returned item is received and inspected, approved refunds are initiated within 3–5 business days to the original payment method (UPI, card, or bank account).",
      "For Cash on Delivery (COD) orders, refunds are processed via UPI or NEFT bank transfer after verification.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    updated: "November 2026",
    sections: [
      "Dheer Eco Essentials (DHEERO™) respects your privacy. We collect only the information needed to process orders, arrange delivery, and provide customer support.",
      "Payment transactions are processed securely through encrypted payment gateway channels. We never store raw card numbers or UPI PINs.",
      "We do not sell or rent customer contact details to third parties.",
    ],
  },
  terms: {
    title: "Terms & Conditions",
    updated: "November 2026",
    sections: [
      "By accessing and purchasing from DHEERO™, you agree to provide accurate delivery and contact information.",
      "DHEERO™ is an independent Indian brand offering devotional and traditional headwear. It is not officially affiliated with or endorsed by the Sabarimala temple or its administration.",
      "All disputes are subject to the jurisdiction of courts in Khammam, Telangana, India.",
    ],
  },
};

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = POLICIES[slug];
  if (!policy) notFound();

  return (
    <div className="parchment-surface py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="parchment-card rounded-3xl p-6 sm:p-10 space-y-5">
          <div className="border-b border-[#D4A017]/35 pb-4">
            <p className="text-xs uppercase tracking-widest text-[#7A0E0E] font-semibold">
              DHEERO™ Customer Service
            </p>
            <h1 className="font-serif-display text-4xl font-bold text-[#5A2E0B] mt-1">
              {policy.title}
            </h1>
            <p className="text-xs text-[#5A2E0B]/65 mt-1">
              Last updated: {policy.updated}
            </p>
          </div>
          <div className="space-y-4 text-sm text-[#32170B]/90 leading-relaxed">
            {policy.sections.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="pt-4 border-t border-[#D4A017]/30 flex justify-between items-center text-xs">
            <Link href="/contact" className="text-[#7A0E0E] font-semibold hover:underline">
              Questions? Contact Support
            </Link>
            <Link href="/shop" className="text-[#F26500] font-semibold hover:underline">
              Return to Shop →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
