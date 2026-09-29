import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import api from "../services/api";

// Custom hook for authentication
export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout, register } =
    useAuthStore();

  const checkAuthStatus = useCallback(async () => {
    try {
      // TODO: Implement actual auth check with backend
      // For now, just check if we have a token in localStorage
      const storedToken = localStorage.getItem("token");
      if (storedToken && !isAuthenticated) {
        // TODO: Validate token with backend
        // For demo purposes, we'll just set authenticated to true
        // In a real app, you would call an endpoint to verify the token
      }
    } catch (error) {
      logout();
    }
  }, [isAuthenticated, logout]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    register,
  };
};

// Custom hook for cart functionality
export const useCart = () => {
  const { items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart } =
    useCartStore();

  const queryClient = useQueryClient();

  const { data: cartData, isLoading, error } = useQuery({
    queryKey: ["cart"],
    queryFn: () => api.get("/cart").then((res) => res.data),
    enabled: false,
  });

  const addToCart = useMutation({
    mutationFn: (productId: string) =>
      api.post("/cart", { productId, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const updateCartItemQuantity = useMutation({
    mutationFn: ({
      itemId,
      quantity,
    }: {
      itemId: string;
      quantity: number;
    }) => api.put(`/cart/${itemId}`, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeFromCart = useMutation({
    mutationFn: (itemId: string) => api.delete(`/cart/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    cartData,
    isLoading,
    error,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
  };
};

// Custom hook for wishlist functionality
export const useWishlist = () => {
  const { items, addItem, removeItem, hasItem, clearWishlist } =
    useWishlistStore();

  const queryClient = useQueryClient();

  const { data: wishlistData, isLoading, error } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => api.get("/wishlist").then((res) => res.data),
    enabled: false,
  });

  const addToWishlist = useMutation({
    mutationFn: (productId: string) =>
      api.post("/wishlist", { productId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const removeFromWishlist = useMutation({
    mutationFn: (productId: string) =>
      api.delete(`/wishlist/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  return {
    items,
    addItem,
    removeItem,
    hasItem,
    clearWishlist,
    wishlistData,
    isLoading,
    error,
    addToWishlist,
    removeFromWishlist,
  };
};

// Custom hook for products
export const useProducts = () => {
  const queryClient = useQueryClient();

  const {
    data: productsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => api.get("/products").then((res) => res.data.data),
  });

  const getProductById = (id: string) => {
    return useQuery({
      queryKey: ["product", id],
      queryFn: () => api.get(`/products/${id}`).then((res) => res.data),
    });
  };

  return {
    productsData,
    isLoading,
    error,
    getProductById,
  };
};

// Custom hook for orders
export const useOrders = () => {
  const queryClient = useQueryClient();

  const {
    data: ordersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.get("/orders").then((res) => res.data),
  });

  const getOrderById = (id: string) => {
    return useQuery({
      queryKey: ["order", id],
      queryFn: () => api.get(`/orders/${id}`).then((res) => res.data),
    });
  };

  return {
    ordersData,
    isLoading,
    error,
    getOrderById,
  };
};

// Utility hook for form handling with validation
export const useFormWithValidation = <T extends Record<string, any>>(
  initialValues: T,
  validateFn: (values: T) => Partial<T>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    const fieldErrors = validateFn(values);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldErrors[name] || "",
    }));
  };

  const handleSubmit = async (
    onSubmit: (values: T) => Promise<void> | void
  ) => {
    setIsSubmitting(true);
    const fieldErrors = validateFn(values);
    setErrors(fieldErrors);

    if (Object.keys(fieldErrors).length === 0) {
      try {
        await onSubmit(values);
      } catch (error) {
        // Handle submission error
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
};
