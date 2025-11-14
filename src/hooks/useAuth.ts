"use client";

import { useState, useEffect } from "react";

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/check");
      const data = await response.json();
      setAuthenticated(data.authenticated);
    } catch (error) {
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  return { authenticated, loading };
}

