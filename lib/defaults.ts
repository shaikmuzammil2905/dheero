import type { Collection, FaqItem, Product } from "./types";

export const DEFAULT_COLLECTION: Collection = {
  id: "col_devotional",
  slug: "devotional",
  name: "Devotional Collection",
  tagline: "ఇరుముడి కట్టు శబరిమల ఎక్కువ",
  description:
    "A thoughtfully designed natural-dye fabric created to accompany your devotional journey.",
  hero_image: "/images/ayyappa-hero.png",
  accent_color: "#C8242C",
  primary_color: "#541D25",
  bg_color: "#F8F3E8",
  is_active: 1,
  is_published: 1,
  sort_order: 1,
  seo_title: "DHEERO – ఇరుముడి రుమాలు | A Meaningful Part of Your Devotional Journey",
  seo_description:
    "DHEERO ఇరుముడి రుమాలు — A natural, herbal-dyed cloth designed as a meaningful part of the Ayyappa devotional journey.",
};

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod_irumudi_rumala",
    collection_id: "col_devotional",
    slug: "irumudi-rumala",
    name: "DHEERO – ఇరుముడి రుమాలు",
    subtitle: "A meaningful part of your devotional journey",
    description:
      "A thoughtfully designed natural-dye fabric created to accompany your devotional journey.",
    product_type: "Devotional Headwear",
    category: "ఇరుముడి రుమాలు",
    target_audience: "Ayyappa Swamy devotees",
    dimensions: "Standard pilgrimage proportion",
    weight: "Lightweight & breathable",
    fabric_summary:
      "Natural-dye inspired, herbal-infused cotton textile concept designed for comfortable skin contact.",
    care_instructions:
      "Gentle hand wash with mild soap. Dry in shade. Reusable and suitable for everyday care.",
    base_price: 399,
    mrp_price: 399,
    is_active: 1,
    created_at: "2026-11-28T00:00:00.000Z",
    variants: [
      {
        id: "var_red",
        product_id: "prod_irumudi_rumala",
        sku: "DHR-IRU-RED-01",
        color_name: "Red",
        color_hex: "#C8242C",
        marking_description: "Deep devotional red with woven border & stitched DHEERO label",
        price: 399,
        stock: 120,
        is_available: 1,
        primary_image: "/images/rumala-maroon.jpg",
        gallery_images: [
          "/images/rumala-maroon.jpg",
          "/images/wear-red.png",
          "/images/rumala-trio.jpg",
        ],
        frames_360: [],
        sort_order: 1,
      },
      {
        id: "var_yellow",
        product_id: "prod_irumudi_rumala",
        sku: "DHR-IRU-YLW-01",
        color_name: "Yellow",
        color_hex: "#E5A91A",
        marking_description: "Turmeric-inspired natural yellow with woven border & stitched DHEERO label",
        price: 399,
        stock: 120,
        is_available: 1,
        primary_image: "/images/rumala-turmeric.jpg",
        gallery_images: [
          "/images/rumala-turmeric.jpg",
          "/images/wear-yellow.png",
          "/images/rumala-trio.jpg",
        ],
        frames_360: [],
        sort_order: 2,
      },
    ],
  },
];

export const DEFAULT_FAQS: FaqItem[] = [];

export const DEFAULT_SETTINGS: Record<string, string> = {
  business_name: "Dheer Eco Essentials",
  brand_name: "DHEERO",
  owner_name: "L. Sai Chand (DHEER)",
  phone: "7207147749",
  whatsapp: "7207147749",
  email: "dheergopichand@gmail.com",
  address: "P No. 60, Teacher's Colony, Yedulapuram, Khammam – 507003, Telangana, India",
  gst: "36ACMPL5503H",
  shipping_fee: "59",
  free_shipping_threshold: "999",
  cod_enabled: "1",
  razorpay_enabled: "1",
};
