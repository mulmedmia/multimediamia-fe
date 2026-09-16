"use client";

import { useState } from "react";
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  EyeOpenIcon,
  EyeClosedIcon,
  EnvelopeClosedIcon,
  LockClosedIcon,
} from "@radix-ui/react-icons";
import { AuthHeader } from "@/components/auth-header";
import { useAuth } from "@/hooks/use-auth";
import { useAuthContext } from "@/providers/AuthProvider";

const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(1, { message: "Password tidak boleh kosong." }),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { loading, message, messageType, handleLogin } = useAuth();
  const { login } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const loginData = await handleLogin(data.email, data.password);
    if (loginData) {
      login(loginData.data.user);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0D14] mia-connected-bg p-4 relative overflow-hidden selection:bg-[#E01C20] selection:text-white">
      <AuthHeader />

      <div className="w-full max-w-md mia-card p-8 shadow-2xl relative z-10 my-16 sm:my-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#FFF9F5]">
              Selamat Datang Kembali
            </h1>
            <p className="text-sm text-[#AAB1BD]">
              Masukkan email dan password Anda untuk masuk.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-semibold text-[#FFF9F5]">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AAB1BD]">
                  <EnvelopeClosedIcon className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="account@gmail.com"
                  required
                  {...register("email")}
                  className="w-full bg-[#141824] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-[#FFF9F5] placeholder-[#99A1AF] focus:border-[#E01C20] focus:ring-1 focus:ring-[#E01C20] transition-all outline-none"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-[#E01C20] mt-1 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-semibold text-[#FFF9F5]">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AAB1BD]">
                  <LockClosedIcon className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  {...register("password")}
                  className="w-full bg-[#141824] border border-white/10 rounded-xl py-3 pl-10 pr-10 text-sm text-[#FFF9F5] placeholder-[#99A1AF] focus:border-[#E01C20] focus:ring-1 focus:ring-[#E01C20] transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#AAB1BD] hover:text-[#FFF9F5] focus:text-[#FFF9F5] cursor-pointer"
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Lihat password"
                  }
                >
                  {showPassword ? (
                    <EyeOpenIcon className="w-4 h-4" />
                  ) : (
                    <EyeClosedIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-[#E01C20] mt-1 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {message && (
            <p
              className={`text-sm text-center font-medium ${
                messageType === "success" ? "text-[#00B445]" : "text-[#E01C20]"
              }`}
            >
              {message}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mia-btn-primary w-full py-3.5 text-base shadow-lg shadow-red-900/30 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>

          {/* Helper Links */}
          <div className="space-y-1 pt-2 text-center text-sm text-[#AAB1BD]">
            <p>
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#E01C20] hover:underline"
              >
                Daftar di sini
              </Link>
            </p>
            <p>
              Lupa Password?{" "}
              <Link
                href="/forgot-password"
                className="font-semibold text-[#E01C20] hover:underline"
              >
                Reset di sini
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
