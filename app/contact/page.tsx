"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { GoldOrnamentalDivider, Reveal } from "@/components/MotionPrimitives";

export default function ContactPage() {
  const { settings } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isWholesale, setIsWholesale] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const phone = settings.phone || "7207147749";
  const whatsapp = settings.whatsapp || "7207147749";
  const emailAddr = settings.email || "dheergopichand@gmail.com";
  const address =
    settings.address ||
    "P No. 60, Teacher's Colony, Yedulapuram, Khammam – 507003, Telangana, India";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, mobile, subject, message, isWholesale }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Failed to send message.");
        return;
      }
      setStatus("sent");
      setName("");
      setEmail("");
      setMobile("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  return (
    <div className="parchment-surface py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Reveal className="text-center space-y-3">
          <GoldOrnamentalDivider label="Get in Touch" />
          <h1 className="font-serif-display text-4xl sm:text-6xl font-bold text-[#5A2E0B]">
            Contact & Wholesale Inquiries
          </h1>
          <p className="text-sm sm:text-base text-[#5A2E0B]/80 max-w-2xl mx-auto">
            Reach out to Dheer Eco Essentials (DHEERO™) for customer support, order
            assistance, or bulk Mandali & wholesale orders.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details */}
          <Reveal className="lg:col-span-5 space-y-4">
            <div className="parchment-card rounded-2xl p-6 space-y-5">
              <h2 className="font-serif-display text-2xl font-bold text-[#7A0E0E]">
                Direct Support Channels
              </h2>

              <a
                href={`tel:+91${phone}`}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-white/80 border border-[#D4A017]/40 hover:border-[#F26500] transition-colors"
              >
                <div className="p-2.5 rounded-lg bg-[#7A0E0E] text-[#D4A017]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-[#5A2E0B]/70">Click to Call</p>
                  <p className="font-semibold text-sm text-[#5A2E0B]">+91 {phone}</p>
                </div>
              </a>

              <a
                href={`mailto:${emailAddr}`}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-white/80 border border-[#D4A017]/40 hover:border-[#F26500] transition-colors"
              >
                <div className="p-2.5 rounded-lg bg-[#7A0E0E] text-[#D4A017]">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-[#5A2E0B]/70">Email Support</p>
                  <p className="font-semibold text-sm text-[#5A2E0B] truncate">
                    {emailAddr}
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/80 border border-[#D4A017]/40">
                <div className="p-2.5 rounded-lg bg-[#7A0E0E] text-[#D4A017] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-[#5A2E0B]/70">Business Address</p>
                  <p className="text-xs font-medium text-[#5A2E0B] leading-relaxed mt-0.5">
                    {address}
                  </p>
                  <p className="text-[11px] text-[#7A0E0E] mt-1">
                    Online Direct Store (Physical store planned for 2027)
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Contact Form */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="parchment-card rounded-2xl p-6 sm:p-8 space-y-4"
            >
              <h2 className="font-serif-display text-2xl font-bold text-[#7A0E0E]">
                Send Us a Message
              </h2>

              {status === "sent" && (
                <div className="p-4 rounded-xl bg-[#1F6F3D]/10 border border-[#1F6F3D]/40 text-[#1F6F3D] text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>
                    Thank you! Your message has been received. Our team will respond
                    shortly.
                  </span>
                </div>
              )}

              {status === "error" && (
                <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-red-800 text-sm">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5A2E0B] mb-1">
                    Full Name *
                  </label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4A017]/50 text-sm outline-none focus:border-[#F26500]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5A2E0B] mb-1">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4A017]/50 text-sm outline-none focus:border-[#F26500]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5A2E0B] mb-1">
                    Mobile / WhatsApp
                  </label>
                  <input
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4A017]/50 text-sm outline-none focus:border-[#F26500]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5A2E0B] mb-1">
                    Subject *
                  </label>
                  <input
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Order inquiry / Wholesale / Feedback"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4A017]/50 text-sm outline-none focus:border-[#F26500]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A2E0B] mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your requirements or questions..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4A017]/50 text-sm outline-none focus:border-[#F26500]"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-[#5A2E0B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isWholesale}
                  onChange={(e) => setIsWholesale(e.target.checked)}
                  className="accent-[#F26500] w-4 h-4"
                />
                <span>This is a Wholesale / Bulk Mandali Inquiry</span>
              </label>

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#F26500] hover:bg-[#d85700] disabled:opacity-60 text-white font-semibold text-sm shadow-lg"
              >
                <Send className="w-4 h-4" />
                {status === "sending" ? "Sending..." : "Send Message"}
              </button>
            </form>
          </Reveal>
        </div>

        {/* Scroll Section 3: Wholesale & Mandali Ordering */}
        <Reveal className="parchment-card rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A0E0E]">
              Bulk & Mandali Orders
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#5A2E0B]">
              Supporting Pilgrim Groups & Retailers Across India
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: "Mandali & Pilgrim Groups",
                desc: "Uniform colour batches (Turmeric Yellow, Light Brown, or Maroon Red) packed cleanly for group yatras.",
              },
              {
                title: "Devotional Stores & Traders",
                desc: "Dedicated wholesale pricing tiers and GST-invoiced billing from Dheer Eco Essentials.",
              },
              {
                title: "Fast Pan-India Dispatch",
                desc: "Coordinated road and courier dispatch from Khammam, Telangana for timely seasonal arrival.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="p-5 rounded-2xl bg-white/80 border border-[#D4A017]/40 space-y-2"
              >
                <h3 className="font-serif-display text-2xl font-bold text-[#7A0E0E]">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#32170B]/85 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Scroll Section 4: Business Identity & 2027 Physical Store Roadmap */}
        <Reveal className="rounded-3xl bg-[#32170B] text-[#F9F3E6] border border-[#D4A017]/50 p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A017]">
              Dheer Eco Essentials
            </span>
            <h2 className="font-serif-display text-3xl font-bold">
              Direct Online Store Today. Flagship Store Planned for 2027.
            </h2>
            <p className="text-sm text-[#F9F3E6]/85 leading-relaxed">
              We currently operate exclusively online with direct dispatch from Khammam,
              Telangana (GSTIN: {settings.gst || "36ACMPL5503H"}), ensuring consistent
              quality and responsive WhatsApp support.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#462110] border border-[#D4A017]/40 text-sm space-y-1.5">
            <p className="font-bold text-[#D4A017]">Registered Address</p>
            <p>{address}</p>
            <p className="text-xs text-[#F9F3E6]/75 pt-1">
              Owner: {settings.owner_name || "L. Sai Chand (DHEER)"}
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
