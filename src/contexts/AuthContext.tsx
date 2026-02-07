"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { getApiBase } from "@/lib/apiBase";

type AuthContextValue = {
  authenticated: boolean;
  loading: boolean;
  checkAuth: () => Promise<void>;
  setAuthenticated: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticatedState] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch(`${getApiBase()}/api/auth/check`, {
        credentials: "include",
      });
      const data = await response.json();
      setAuthenticatedState(!!data.authenticated);
    } catch {
      setAuthenticatedState(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const setAuthenticated = useCallback((value: boolean) => {
    setAuthenticatedState(value);
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value: AuthContextValue = {
    authenticated: loading ? false : authenticated,
    loading,
    checkAuth,
    setAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
