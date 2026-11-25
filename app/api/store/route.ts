import { NextResponse } from "next/server";
import {
  getActiveCollection,
  getAllCollections,
  getFaqs,
  getProductsWithVariants,
  getWebsiteSettings,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const activeCollection = getActiveCollection();
    const publishedCollections = getAllCollections().filter((c) => c.is_published === 1);
    const products = getProductsWithVariants(false);
    const settings = getWebsiteSettings();
    const faqs = getFaqs(false);

    return NextResponse.json({
      activeCollection,
      publishedCollections,
      products,
      settings,
      faqs,
    });
  } catch (err) {
    console.error("GET /api/store error:", err);
    return NextResponse.json({ error: "Failed to load store data" }, { status: 500 });
  }
}
