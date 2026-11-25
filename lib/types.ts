export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
  role: "customer" | "admin";
  created_at: string;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  hero_image: string;
  accent_color: string;
  primary_color: string;
  bg_color: string;
  is_active: number;
  is_published: number;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  color_name: string;
  color_hex: string;
  marking_description: string;
  price: number;
  stock: number;
  is_available: number;
  primary_image: string;
  gallery_images: string[];
  frames_360: string[];
  sort_order: number;
}

export interface Product {
  id: string;
  collection_id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  product_type: string;
  category: string;
  target_audience: string;
  dimensions: string;
  weight: string;
  fabric_summary: string;
  care_instructions: string;
  base_price: number;
  mrp_price: number;
  is_active: number;
  created_at: string;
  variants: ProductVariant[];
}

export interface CartItem {
  productId: string;
  productName: string;
  variantId: string;
  colorName: string;
  colorHex: string;
  sku: string;
  price: number;
  image: string;
  quantity: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  product_name: string;
  color_name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_mobile: string;
  shipping_address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  payment_reference: string | null;
  order_status: string;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  items?: OrderItem[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: number;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  mobile: string;
  address_line: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  is_default: number;
}
