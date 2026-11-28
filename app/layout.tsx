import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/components/StoreProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "DHEERO | ఇరుముడి రుమాలు — A Meaningful Part of Your Devotional Journey",
  description:
    "DHEERO – ఇరుముడి రుమాలు. A natural, herbal-dyed cloth designed as a meaningful part of the Ayyappa devotional journey.",
  openGraph: {
    title: "DHEERO | ఇరుముడి రుమాలు",
    description:
      "A thoughtfully designed natural-dye fabric created to accompany your devotional journey.",
    images: ["/images/ayyappa-hero.png"],
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
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Montserrat:wght@400;500;600;700&family=Noto+Serif+Telugu:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F8F3E8] text-[#29231D] antialiased selection:bg-[#C6A04A]/25 selection:text-[#541D25]">
        <StoreProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
