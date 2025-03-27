"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function useAuthCheck() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const checkAuth = useCallback(async () => {
    try {
      console.log("Checking authentication...");
      const res = await axios.get("../api/auth/status", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      console.log("Auth response:", res.data);
      setIsAuthenticated(res.data.isAuthenticated);
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return { isAuthenticated, setIsAuthenticated, checkAuth };
}
