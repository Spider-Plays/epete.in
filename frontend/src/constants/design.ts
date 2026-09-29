export const PRODUCT_SIZES = ["S", "M", "L", "XL", "XXL"] as const;

/** Four popular E-PETE tee colours */
export const PRODUCT_COLORS = [
  { name: "Red", hex: "#e11f26" },
  { name: "Olive", hex: "#556B2F" },
  { name: "Black", hex: "#1a1a1a" },
  { name: "Navy", hex: "#1e3a5f" },
] as const;

export type ProductColorName = (typeof PRODUCT_COLORS)[number]["name"];

export const BRAND = {
  name: "E-PETE",
  nameKannada: "ಇ-ಪೇಟೆ",
  tagline: "ಭಾವಗಳ ಬಜಾರು",
  subtitle: "Wear what feels like you",
  logo: "/images/brand/logo.jpg",
  instagram: "https://www.instagram.com/epete.in/",
  whatsapp: "https://wa.me/919066227744",
  phoneDisplay: "+91 90662 27744",
};

export const NAV_LINKS = [
  { label: "READY-TO-WEAR", to: "/shop?category=men", badge: "NEW", badgeTone: "secondary" as const },
  { label: "GRAPHIC TEES", to: "/shop?category=women", badge: "HOT", badgeTone: "primary" as const },
  { label: "KANNADA PRINTS", to: "/shop?search=Kannada" },
  { label: "CUSTOM PRINTS", to: "/shop?search=Custom" },
  { label: "NEW ARRIVALS", to: "/shop?sort=newest" },
  { label: "SALE", to: "/shop?sort=sale" },
];

export const CATEGORY_CHIPS = [
  "Baarisu Kannada",
  "Hampi",
  "Bettada Jeeva",
  "Nagu Naguta",
  "Graphic Tees",
  "100% Cotton",
  "180 GSM",
  "Made in India",
];

export const SHOP_CATEGORIES = [
  {
    name: "Baarisu Tees",
    slug: "baarisu",
    badge: "Hot",
    image: "/images/designs/baarisu-red.jpg",
  },
  {
    name: "Hampi",
    slug: "hampi",
    badge: "New",
    image: "/images/designs/hampi-white.jpg",
  },
  {
    name: "Bettada Jeeva",
    slug: "bettada",
    image: "/images/designs/bettada-white.jpg",
  },
  {
    name: "Nagu Naguta",
    slug: "nagu",
    image: "/images/designs/nagu-black.jpg",
  },
  {
    name: "Olive Drop",
    slug: "olive",
    image: "/images/designs/baarisu-olive.jpg",
  },
  {
    name: "Navy Classics",
    slug: "navy",
    image: "/images/designs/baarisu-navy.jpg",
  },
  {
    name: "Black Essentials",
    slug: "black",
    image: "/images/designs/baarisu-black.jpg",
  },
];

export const HERO_IMAGE = "/images/designs/baarisu-red.jpg";

export const MOOD_LOOKS = [
  {
    title: "ಬಾರಿಸು ಕನ್ನಡ ಡಿಂಡಿಮವ",
    cta: "SHOP BAARISU",
    image: "/images/designs/baarisu-olive.jpg",
  },
  {
    title: "ಹಂಪಿ — Vijayanagara Glory",
    cta: "SHOP HAMPI",
    image: "/images/designs/hampi-white.jpg",
  },
  {
    title: "ನಗುನಗುತಾ ನಲಿ ನಲಿ",
    cta: "SHOP NAGU",
    image: "/images/designs/nagu-navy.jpg",
  },
];

/** Free shipping threshold in INR */
export const FREE_SHIPPING_THRESHOLD = 999;
export const STANDARD_SHIPPING = 79;
