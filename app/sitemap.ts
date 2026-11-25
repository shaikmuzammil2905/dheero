import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dheero.in";
  const routes = [
    "",
    "/shop",
    "/about",
    "/craft",
    "/faq",
    "/contact",
    "/login",
    "/cart",
    "/policies/shipping",
    "/policies/returns",
    "/policies/refund",
    "/policies/privacy",
    "/policies/terms",
  ];
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/shop" ? "daily" : "monthly",
    priority: route === "" ? 1 : route === "/shop" ? 0.9 : 0.7,
  }));
}
