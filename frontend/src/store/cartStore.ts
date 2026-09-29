import { create } from "zustand";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const sameVariant = (a: CartItem, b: Pick<CartItem, "productId" | "size" | "color">) =>
  a.productId === b.productId && a.size === b.size && a.color === b.color;

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,
  addItem: (item) => {
    set((state) => {
      const existingItem = state.items.find((i) => sameVariant(i, item));
      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map((i) =>
          sameVariant(i, item) ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        newItems = [
          ...state.items,
          {
            ...item,
            id: `${item.productId}-${item.size || "os"}-${item.color || "def"}-${Date.now()}`,
          },
        ];
      }

      const totalItems = newItems.reduce((sum, row) => sum + row.quantity, 0);
      const totalPrice = newItems.reduce((sum, row) => sum + row.price * row.quantity, 0);

      return { items: newItems, totalItems, totalPrice };
    });
  },
  removeItem: (itemId) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== itemId);
      const totalItems = newItems.reduce((sum, row) => sum + row.quantity, 0);
      const totalPrice = newItems.reduce((sum, row) => sum + row.price * row.quantity, 0);
      return { items: newItems, totalItems, totalPrice };
    });
  },
  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }

    set((state) => {
      const newItems = state.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      const totalItems = newItems.reduce((sum, row) => sum + row.quantity, 0);
      const totalPrice = newItems.reduce((sum, row) => sum + row.price * row.quantity, 0);
      return { items: newItems, totalItems, totalPrice };
    });
  },
  clearCart: () => {
    set({ items: [], totalItems: 0, totalPrice: 0 });
  },
}));
