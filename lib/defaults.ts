import type { Collection, FaqItem, Product } from "./types";

export const DEFAULT_COLLECTION: Collection = {
  id: "col_devotional",
  slug: "devotional",
  name: "Devotional Collection",
  tagline: "A Journey of Faith.\nA Tradition of Devotion.",
  description:
    "Thoughtfully designed devotional headwear and essentials inspired by the sacred Sabarimala pilgrimage.",
  hero_image: "/images/hero-sabarimala.png",
  accent_color: "#F26500",
  primary_color: "#7A0E0E",
  bg_color: "#F9F3E6",
  is_active: 1,
  is_published: 1,
  sort_order: 1,
  seo_title: "DHEERO™ | Devotional Headwear & Irumudi Rumala",
  seo_description:
    "Thoughtfully designed essentials for the sacred Sabarimala journey. Explore the DHEERO™ Irumudi Rumala.",
};

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod_irumudi_rumala",
    collection_id: "col_devotional",
    slug: "irumudi-rumala",
    name: "DHEERO™ Irumudi Rumala",
    subtitle: "Dedicated Devotional Headwear for Ayyappa Swamy Devotees",
    description:
      "A thoughtfully designed devotional rumala for Ayyappa Swamy devotees, bringing together traditional inspiration, comfortable fabric and distinctive product presentation.",
    product_type: "Devotional Headwear",
    category: "Irumudi Rumala",
    target_audience: "Adult male Ayyappa devotees",
    dimensions: "Standard (Final dimensions to be confirmed)",
    weight: "To be confirmed after final fabric selection",
    fabric_summary:
      "Comfort-focused breathable fabric (Final fabric selection to be confirmed)",
    care_instructions:
      "Hand wash recommended with mild detergent. Dry in shade. Iron on low heat. Do not bleach. Do not dry clean.",
    base_price: 399,
    mrp_price: 499,
    is_active: 1,
    created_at: "2026-11-25T00:00:00.000Z",
    variants: [
      {
        id: "var_turmeric_yellow",
        product_id: "prod_irumudi_rumala",
        sku: "DHR-IRU-YLW-01",
        color_name: "Turmeric Yellow",
        color_hex: "#F4B400",
        marking_description: "Red Kumkum-inspired horizontal marking",
        price: 399,
        stock: 120,
        is_available: 1,
        primary_image: "/images/rumala-turmeric.jpg",
        gallery_images: [
          "/images/rumala-turmeric.jpg",
          "/images/rumala-trio.jpg",
          "/images/rumala-brown.jpg",
          "/images/rumala-maroon.jpg",
        ],
        frames_360: [],
        sort_order: 1,
      },
      {
        id: "var_light_brown",
        product_id: "prod_irumudi_rumala",
        sku: "DHR-IRU-BRN-01",
        color_name: "Light Brown",
        color_hex: "#9E6B43",
        marking_description:
          "Devotional marking design to be finalised (editable via Admin)",
        price: 399,
        stock: 85,
        is_available: 1,
        primary_image: "/images/rumala-brown.jpg",
        gallery_images: [
          "/images/rumala-brown.jpg",
          "/images/rumala-trio.jpg",
          "/images/rumala-turmeric.jpg",
          "/images/rumala-maroon.jpg",
        ],
        frames_360: [],
        sort_order: 2,
      },
      {
        id: "var_maroon_red",
        product_id: "prod_irumudi_rumala",
        sku: "DHR-IRU-MRN-01",
        color_name: "Maroon Red",
        color_hex: "#7A0E0E",
        marking_description: "Yellow Gandham-inspired horizontal marking",
        price: 399,
        stock: 95,
        is_available: 1,
        primary_image: "/images/rumala-maroon.jpg",
        gallery_images: [
          "/images/rumala-maroon.jpg",
          "/images/rumala-trio.jpg",
          "/images/rumala-turmeric.jpg",
          "/images/rumala-brown.jpg",
        ],
        frames_360: [],
        sort_order: 3,
      },
    ],
  },
];

export const DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq_1",
    question: "What is DHEERO Irumudi Rumala?",
    answer:
      "DHEERO™ Irumudi Rumala is a dedicated devotional headwear cloth thoughtfully designed for Ayyappa Swamy devotees, combining traditional-inspired colour combinations, distinctive horizontal devotional markings, and comfortable fabric presentation.",
    sort_order: 1,
    is_active: 1,
  },
  {
    id: "faq_2",
    question: "What colour options are available?",
    answer:
      "Our initial launch offers three signature variants: Turmeric Yellow (with a Red Kumkum-inspired horizontal marking), Light Brown, and Maroon Red (with a Yellow Gandham-inspired horizontal marking). Additional colours such as Black may be introduced via the admin catalogue.",
    sort_order: 2,
    is_active: 1,
  },
  {
    id: "faq_3",
    question: "How do I choose a colour?",
    answer:
      "You may choose the colour that best aligns with your personal preference, group tradition, or comfort during your pilgrimage journey. All variants feature the same thoughtful DHEERO™ sizing and finishing.",
    sort_order: 3,
    is_active: 1,
  },
  {
    id: "faq_4",
    question: "What are the product dimensions?",
    answer:
      "The DHEERO™ Irumudi Rumala is crafted in a Standard size suited for traditional head covering and Irumudi wrapping styles. Final exact dimensions will be updated on the product page once confirmed.",
    sort_order: 4,
    is_active: 1,
  },
  {
    id: "faq_5",
    question: "How do I wear the rumala?",
    answer:
      "You can wear it in multiple ways — as a traditional head covering, forehead-style wrapping, full-head coverage, side and ear coverage, or neatly folded. Step-by-step styling demonstrations are available on the product page.",
    sort_order: 5,
    is_active: 1,
  },
  {
    id: "faq_6",
    question: "How do I care for the fabric?",
    answer:
      "We recommend gentle hand washing with mild detergent, drying in shade, and ironing on low heat. Avoid bleach or harsh dry cleaning to preserve the woven border and devotional markings.",
    sort_order: 6,
    is_active: 1,
  },
  {
    id: "faq_7",
    question: "How can I place an order?",
    answer:
      "Visit the DHEERO™ Irumudi Rumala product page, select your preferred colour variant and quantity, click Add to Cart or Buy Now, and complete your delivery and payment details at checkout.",
    sort_order: 7,
    is_active: 1,
  },
  {
    id: "faq_8",
    question: "Do you offer wholesale orders?",
    answer:
      "Yes! DHEERO™ (Dheer Eco Essentials) supports both retail and wholesale/bulk orders for pilgrim groups, Sabarimala Mandali committees, and devotional stores. Use our Contact page or WhatsApp Support (+91 7207147749) for bulk inquiries.",
    sort_order: 8,
    is_active: 1,
  },
  {
    id: "faq_9",
    question: "How can I track my order?",
    answer:
      "Once your order is confirmed and shipped, you can track its live status (Pending, Confirmed, Processing, Shipped, Out for Delivery, Delivered) in your My Account dashboard or by contacting WhatsApp Support with your Order ID.",
    sort_order: 9,
    is_active: 1,
  },
  {
    id: "faq_10",
    question: "What is your return and refund policy?",
    answer:
      "Unused, unwashed products in their original packaging are eligible for return or replacement within 7 days of delivery in case of transit damage or manufacturing defects. Please review our Return & Refund Policy pages for full terms.",
    sort_order: 10,
    is_active: 1,
  },
  {
    id: "faq_11",
    question: "How can I contact customer support?",
    answer:
      "Reach us anytime via Phone or WhatsApp at +91 7207147749, or email dheergopichand@gmail.com. Our team at Khammam, Telangana responds promptly to all retail and wholesale queries.",
    sort_order: 11,
    is_active: 1,
  },
];

export const DEFAULT_SETTINGS: Record<string, string> = {
  business_name: "Dheer Eco Essentials",
  brand_name: "DHEERO™",
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
  instagram_url: "https://instagram.com",
  hero_heading: "A Journey of Faith.\nA Tradition of Devotion.",
  hero_subheading: "DHEERO™ – Thoughtfully designed essentials for the sacred journey.",
  hero_mantra: "Swamiye Saranam Ayyappa",
  about_intro:
    "DHEERO™ is a genuine Indian brand dedicated to thoughtfully designed headwear inspired by Indian tradition, comfort and contemporary lifestyle.",
  craft_intro:
    "Every DHEERO™ Irumudi Rumala is created with attention to proportion, breathable comfort, respectful devotional markings, and neat presentation.",
};
