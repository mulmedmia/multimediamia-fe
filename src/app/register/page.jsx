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
  PersonIcon,
} from "@radix-ui/react-icons";
import { AuthHeader } from "@/components/auth-header";
import { useRegister } from "@/hooks/use-auth";

const registerSchema = z
  .object({
    fullname: z
      .string()
      .trim()
      .min(3, { message: "Nama lengkap minimal 3 karakter." })
      .max(100, { message: "Nama lengkap maksimal 100 karakter." })
      .regex(/^[a-zA-Z0-9\s'.,-]+$/, {
        message: "Nama tidak boleh mengandung tag HTML atau simbol khusus.",
      }),
    email: z.string().email({ message: "Format email tidak valid." }),
    password: z.string().min(6, { message: "Password minimal 6 karakter." }),
    confirmPassword: z.string().min(6, { message: "Konfirmasi password minimal 6 karakter." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok dengan password.",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { loading, message, messageType, handleRegister } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data) => {
    handleRegister(data.fullname, data.email, data.password);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0D14] mia-connected-bg p-4 relative overflow-hidden selection:bg-[#E01C20] selection:text-white">
      <AuthHeader />

      <div className="w-full max-w-md mia-card p-8 shadow-2xl relative z-10 my-16 sm:my-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Card Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#FFF9F5]">
              Buat Akun Baru
            </h1>
            <p className="text-sm text-[#AAB1BD]">
              Isi data di bawah ini untuk memulai perjalanan kreatif Anda.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {/* Fullname Field */}
            <div className="space-y-1.5">
              <label htmlFor="fullname" className="block text-sm font-semibold text-[#FFF9F5]">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AAB1BD]">
                  <PersonIcon className="w-4 h-4" />
                </div>
                <input
                  id="fullname"
                  type="text"
                  placeholder="Nama Lengkap Anda"
                  required
                  {...register("fullname")}
                  className="w-full bg-[#141824] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-[#FFF9F5] placeholder-[#99A1AF] focus:border-[#E01C20] focus:ring-1 focus:ring-[#E01C20] transition-all outline-none"
                />
              </div>
              {errors.fullname && (
                <p className="text-xs text-[#E01C20] mt-1 font-medium">
                  {errors.fullname.message}
                </p>
              )}
            </div>

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

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#FFF9F5]">
                Konfirmasi Password
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AAB1BD]">
                  <LockClosedIcon className="w-4 h-4" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  {...register("confirmPassword")}
                  className="w-full bg-[#141824] border border-white/10 rounded-xl py-3 pl-10 pr-10 text-sm text-[#FFF9F5] placeholder-[#99A1AF] focus:border-[#E01C20] focus:ring-1 focus:ring-[#E01C20] transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#AAB1BD] hover:text-[#FFF9F5] focus:text-[#FFF9F5] cursor-pointer"
                  aria-label={
                    showConfirmPassword ? "Sembunyikan konfirmasi password" : "Lihat konfirmasi password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOpenIcon className="w-4 h-4" />
                  ) : (
                    <EyeClosedIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-[#E01C20] mt-1 font-medium">
                  {errors.confirmPassword.message}
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
            {loading ? "Memproses Akun..." : "Buat Akun"}
          </button>

          {/* Helper Link */}
          <div className="pt-2 text-center text-sm text-[#AAB1BD]">
            <p>
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#E01C20] hover:underline"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
