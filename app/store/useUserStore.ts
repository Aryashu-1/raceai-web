// src/store/useUserStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types/user";

interface UserState {
  user: User | null;
  token: string | null;
  loading: boolean;

  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearUser: () => void;
  setLoading: (state: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      clearUser: () => set({ user: null, token: null }),
      setLoading: (state) => set({ loading: state }),
    }),
    {
      name: "race-ai-user-storage", // key in localStorage
    }
  )
);
