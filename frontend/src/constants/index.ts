// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
  },
  USERS: {
    PROFILE: "/users/profile",
    UPDATE_PROFILE: "/users/update-profile",
    ADDRESS: "/users/address",
  },
  PRODUCTS: {
    BASE: "/products",
    CATEGORIES: "/products/categories",
    BRANDS: "/products/brands",
    SEARCH: "/products/search",
  },
  CART: {
    BASE: "/cart",
    ADD_ITEM: "/cart/add",
    UPDATE_ITEM: "/cart/update",
    REMOVE_ITEM: "/cart/remove",
    CLEAR: "/cart/clear",
  },
  WISHLIST: {
    BASE: "/wishlist",
    ADD_ITEM: "/wishlist/add",
    REMOVE_ITEM: "/wishlist/remove",
  },
  ORDERS: {
    BASE: "/orders",
    CREATE: "/orders/create",
    USER_ORDERS: "/orders/user",
    ORDER_DETAILS: "/orders/:id",
  },
  PAYMENTS: {
    BASE: "/payments",
    CREATE_SESSION: "/payments/create-checkout-session",
    PROCESS: "/payments/process",
    VERIFY: "/payments/verify/:sessionId",
    WEBHOOK: "/payments/webhook",
  },
  COUPONS: {
    BASE: "/coupons",
    VALIDATE: "/coupons/validate",
    USER_COUPONS: "/coupons/user",
  },
  REVIEWS: {
    BASE: "/reviews",
    PRODUCT_REVIEWS: "/reviews/product/:productId",
    ADD_REVIEW: "/reviews/add",
    UPDATE_REVIEW: "/reviews/update/:id",
    DELETE_REVIEW: "/reviews/delete/:id",
  },
  ANALYTICS: {
    BASE: "/analytics",
    OVERVIEW: "/analytics/overview",
    SALES: "/analytics/sales",
    USERS: "/analytics/users",
  },
  ADMIN: {
    BASE: "/admin",
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    PRODUCTS: "/admin/products",
    ORDERS: "/admin/orders",
  },
};

// Application constants
export const APP_CONSTANTS = {
  PAGE_SIZES: [10, 20, 30, 50, 100],
  DEFAULT_PAGE_SIZE: 20,
  MAX_IMAGE_SIZE_MB: 5,
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  RATING_OPTIONS: [1, 2, 3, 4, 5],
  SIZES: ["XS", "S", "M", "L", "XL", "XXL"],
  COLORS: [
    "Black",
    "White",
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Pink",
    "Purple",
    "Brown",
    "Gray",
  ],
  ORDER_STATUS: [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
  ],
  PAYMENT_METHODS: [
    "CREDIT_CARD",
    "DEBIT_CARD",
    "PAYPAL",
    "STRIPE",
    "RAZORPAY",
    "CASH_ON_DELIVERY",
  ],
  SHIPPING_METHODS: [
    {
      id: "standard",
      name: "Standard Shipping",
      price: 5.99,
      estimatedDays: "5-7 business days",
    },
    {
      id: "express",
      name: "Express Shipping",
      price: 12.99,
      estimatedDays: "2-3 business days",
    },
    {
      id: "overnight",
      name: "Overnight Shipping",
      price: 24.99,
      estimatedDays: "1 business day",
    },
  ],
};

// Routes
export const ROUTES = {
  HOME: "/",
  SHOP: "/shop",
  PRODUCT_DETAIL: "/product/:id",
  CATEGORY: "/category/:slug",
  BRAND: "/brand/:slug",
  CART: "/cart",
  WISHLIST: "/wishlist",
  CHECKOUT: "/checkout",
  ORDER_CONFIRMATION: "/order-confirmation/:id",
  ACCOUNT: "/account",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password/:token",
  VERIFY_EMAIL: "/verify-email/:token",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_USERS: "/admin/users",
  NOT_FOUND: "*",
};

// Role constants
export const USER_ROLES = {
  ADMIN: "admin",
  CUSTOMER: "customer",
};

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  CART: "cart",
  WISHLIST: "wishlist",
};
