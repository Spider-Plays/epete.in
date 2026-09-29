import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      // TODO: Implement redirect to login or logout user
      console.error("Unauthorized access");
    }
    return Promise.reject(error);
  }
);

export default api;

// Export specific service functions
export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  register: (data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) => api.post("/auth/register", data),
  logout: () => api.post("/auth/logout"),
  forgotPassword: (email: { email: string }) =>
    api.post("/auth/forgot-password", email),
  resetPassword: (data: {
    token: string;
    password: string;
  }) => api.post("/auth/reset-password", data),
};

export const productAPI = {
  getProducts: (params?: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) => api.get("/products", { params }),
  getProductById: (id: string) => api.get(`/products/${id}`),
  createProduct: (data: FormData) =>
    api.post("/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateProduct: (id: string, data: FormData) =>
    api.put(`/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
};

export const cartAPI = {
  getCart: () => api.get("/cart"),
  addToCart: (data: {
    productId: string;
    quantity: number;
    size?: string;
    color?: string;
  }) => api.post("/cart", data),
  updateCartItem: (itemId: string, data: { quantity: number }) =>
    api.put(`/cart/${itemId}`, data),
  removeFromCart: (itemId: string) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete("/cart"),
};

export const wishlistAPI = {
  getWishlist: () => api.get("/wishlist"),
  addToWishlist: (productId: string) =>
    api.post("/wishlist", { productId }),
  removeFromWishlist: (productId: string) =>
    api.delete(`/wishlist/${productId}`),
};

export const orderAPI = {
  getOrders: () => api.get("/orders"),
  getOrderById: (id: string) => api.get(`/orders/${id}`),
  createOrder: (data: {
    cartItems: Array<{
      productId: string;
      quantity: number;
      price: number;
      size?: string;
      color?: string;
    }>;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    paymentMethod: string;
  }) => api.post("/orders", data),
  updateOrderStatus: (id: string, status: string) =>
    api.put(`/orders/${id}/status`, { status }),
};

export const paymentAPI = {
  createCheckoutSession: (data: {
    amount: number;
    currency: string;
    successUrl: string;
    cancelUrl: string;
  }) => api.post("/payments/create-checkout-session", data),
  processPayment: (data: {
    token: string;
    amount: number;
    currency: string;
  }) => api.post("/payments/process", data),
  verifyPayment: (sessionId: string) =>
    api.get(`/payments/verify/${sessionId}`),
};

export const couponAPI = {
  validateCoupon: (code: string) =>
    api.post("/coupons/validate", { code }),
  getUserCoupons: () => api.get("/coupons/user"),
};

export const reviewAPI = {
  getProductReviews: (productId: string) =>
    api.get(`/reviews/product/${productId}`),
  addReview: (data: {
    productId: string;
    rating: number;
    comment: string;
    title?: string;
  }) => api.post("/reviews", data),
  updateReview: (id: string, data: {
    rating: number;
    comment: string;
    title?: string;
  }) => api.put(`/reviews/${id}`, data),
  deleteReview: (id: string) => api.delete(`/reviews/${id}`),
};
