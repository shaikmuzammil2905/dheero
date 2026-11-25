import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/components/StoreProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingSupport } from "@/components/FloatingSupport";

export const metadata: Metadata = {
  title: "DHEERO™ | A Journey of Faith. A Tradition of Devotion.",
  description:
    "DHEERO™ by Dheer Eco Essentials — Thoughtfully designed devotional headwear and essentials for the sacred Sabarimala pilgrimage. Explore the DHEERO™ Irumudi Rumala.",
  openGraph: {
    title: "DHEERO™ | Devotional Headwear & Irumudi Rumala",
    description:
      "Thoughtfully designed essentials for the sacred journey. Explore Turmeric Yellow, Light Brown, and Maroon Red DHEERO™ Irumudi Rumala.",
    images: ["/images/hero-sabarimala.jpg"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F9F3E6] text-[#32170B] antialiased selection:bg-[#F26500]/20 selection:text-[#7A0E0E] relative">
        {/* Site-wide Grand Parchment & Temple-Hills Background (Desktop + Mobile) */}
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
        >
          <img
            src="/images/site-bg.png"
            alt=""
            className="w-full h-full object-cover object-center"
          />
        </div>
        <StoreProvider>
          <Navbar />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer />
          <FloatingSupport />
        </StoreProvider>
      </body>
    </html>
  );
}
