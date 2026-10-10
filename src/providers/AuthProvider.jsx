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
          if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
            Cookies.remove("authToken", { path: "/" });
            setUser(null);
          } else {
            // Segera isi user awal dari payload JWT agar route guards tidak menendang ke /login
            setUser({
              users_id: decodedToken.userId,
              email: decodedToken.email,
              role: decodedToken.role,
            });

            try {
              const profile = await getProfile();
              if (profile?.data) {
                setUser(profile.data);
              }
            } catch (err) {
              // HANYA hapus token jika server merespons 401 Unauthorized.
              // Jika Render sedang cold-start atau jaringan lambat, JANGAN hapus token!
              if (err.response?.status === 401) {
                setUser(null);
                Cookies.remove("authToken", { path: "/" });
              }
            }
          }
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
        Cookies.remove("authToken", { path: "/" });
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  const login = (userData) => {
    setUser(userData);
    const role = userData?.role;
    let target = "/dashboard";
    if (role === "ADMIN") {
      target = "/admin/dashboard";
    } else if (role === "JURI") {
      target = "/juri/manage-submission";
    } else if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      target = searchParams.get("redirect") || "/dashboard";
    }

    // Gunakan window.location.href untuk navigasi langsung agar browser mengirimkan cookie root ke middleware
    if (typeof window !== "undefined") {
      window.location.href = target;
    } else {
      router.replace(target);
    }
  };

  const logout = () => {
    Cookies.remove("authToken", { path: "/" });
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    } else {
      router.replace("/login");
    }
  };

  const editProfile = (newProfile) => {
    setUser((prev) => ({ ...prev, ...newProfile }));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    editProfile,
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
