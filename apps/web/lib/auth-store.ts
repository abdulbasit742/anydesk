"use client";

import { create } from "zustand";
import { api } from "./api";

export interface WebUser {
  id: string;
  email: string;
  fullName: string;
  remoteDeskId: string;
  plan: string;
}

interface AuthState {
  user: WebUser | null;
  loading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (input: { email: string; password: string; fullName: string }) => Promise<void>;
  loadMe: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,
  async login(email, password) {
    set({ loading: true });
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("rd_access_token", data.data.tokens.accessToken);
    localStorage.setItem("rd_refresh_token", data.data.tokens.refreshToken);
    set({ user: data.data.user, loading: false, initialized: true });
  },
  async signup(input) {
    set({ loading: true });
    const { data } = await api.post("/auth/signup", input);
    localStorage.setItem("rd_access_token", data.data.tokens.accessToken);
    localStorage.setItem("rd_refresh_token", data.data.tokens.refreshToken);
    set({ user: data.data.user, loading: false, initialized: true });
  },
  async loadMe() {
    const token = localStorage.getItem("rd_access_token");
    if (!token) {
      set({ initialized: true });
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      set({ user: data.data, initialized: true });
    } catch {
      localStorage.removeItem("rd_access_token");
      localStorage.removeItem("rd_refresh_token");
      set({ user: null, initialized: true });
    }
  },
  logout() {
    localStorage.removeItem("rd_access_token");
    localStorage.removeItem("rd_refresh_token");
    set({ user: null, initialized: true });
  }
}));
