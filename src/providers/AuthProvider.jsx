"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import { getProfile } from '@/services/auth.service';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const decodedToken = jwtDecode(token);
          if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem("authToken");
            setUser(null);
          } else {
            const profile = await getProfile();
            setUser(profile.data);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Gagal memverifikasi user:", error);
        setUser(null);
        localStorage.removeItem("authToken");
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    window.location.href = '/login'; 
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