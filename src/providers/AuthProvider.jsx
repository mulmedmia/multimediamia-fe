"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { getProfile } from "@/services/auth.service";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const token = Cookies.get("authToken");
        if (token) {
          const decodedToken = jwtDecode(token);
          if (decodedToken.exp * 1000 < Date.now()) {
            Cookies.remove("authToken");
            setUser(null);
          } else {
            try {
              const profile = await getProfile();
              setUser(profile.data);
            } catch {
              setUser(null);
              Cookies.remove("authToken");
            }
          }
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
        Cookies.remove("authToken");
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  const login = (userData) => {
    setUser(userData);
    if (userData.role === "ADMIN") {
      router.push("/admin/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  const logout = () => {
    Cookies.remove("authToken");
    setUser(null);
    window.location.href = "/login";
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
