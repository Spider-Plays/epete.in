import { create } from "zustand";

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, "id">) => void;
  removeItem: (productId: string) => void;
  hasItem: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  addItem: (item) => {
    set((state) => {
      // Avoid duplicates
      if (state.items.some((i) => i.productId === item.productId)) {
        return state;
      }
      const newItems = [
        ...state.items,
        {
          ...item,
          id: Math.random().toString(36).substr(2, 9),
        },
      ];
      return { items: newItems };
    });
  },
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    }));
  },
  hasItem: (productId) => {
    return get().items.some((item) => item.productId === productId);
  },
  clearWishlist: () => {
    set({ items: [] });
  },
}));
