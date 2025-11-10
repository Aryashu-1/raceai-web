"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useUserStore } from "../store/useUserStore";
import { User } from "../types/user";
import { authService } from "../services/authService";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, token, setUser, clearUser, setLoading, loading } = useUserStore();
  const [initialized, setInitialized] = useState(false);

 // Fetch current user from backend on first load
const refreshUser = async () => {
  try {
    setLoading(true);
    const user = await authService.me(); // returns User | null
    if (user) {
      setUser(user);
    } else {
      clearUser();
    }
  } catch (err) {
    console.error("AuthContext: Failed to refresh user", err);
    clearUser();
  } finally {
    setLoading(false);
    setInitialized(true);
  }
};


  const logout = () => {
    clearUser();
    fetch("/api/auth/logout", { method: "POST" });
  };

  useEffect(() => {
    if (!initialized) refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
