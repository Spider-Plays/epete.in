import { create } from "zustand";
import { authAPI } from "../services/api";

type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin";
};

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) => Promise<void>;
  hydrate: () => void;
}

function persist(user: AuthUser | null, token: string | null) {
  if (user && token) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

function readStored(): Pick<AuthState, "user" | "token" | "isAuthenticated"> {
  try {
    const token = localStorage.getItem("token");
    const raw = localStorage.getItem("user");
    if (!token || !raw) return { user: null, token: null, isAuthenticated: false };
    const user = JSON.parse(raw) as AuthUser;
    return { user, token, isAuthenticated: true };
  } catch {
    return { user: null, token: null, isAuthenticated: false };
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  ...readStored(),
  hydrate: () => set(readStored()),
  login: async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { user, accessToken } = res.data.data;
    persist(user, accessToken);
    set({ user, token: accessToken, isAuthenticated: true });
  },
  logout: () => {
    persist(null, null);
    set({ user: null, token: null, isAuthenticated: false });
  },
  register: async (userData) => {
    const res = await authAPI.register(userData);
    const { user, accessToken } = res.data.data;
    persist(user, accessToken);
    set({ user, token: accessToken, isAuthenticated: true });
  },
}));
