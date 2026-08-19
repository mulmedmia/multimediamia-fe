"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthHeader } from "@/components/auth-header";
import { useRequestOtp } from "@/hooks/user-use-forgot-password";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const { loading, message, messageType, handleRequestOtp } = useRequestOtp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleRequestOtp(email);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0D14] mia-connected-bg p-4 relative overflow-hidden selection:bg-[#E01C20] selection:text-white">
      <AuthHeader />

      <div className="w-full max-w-md mia-card p-8 shadow-2xl relative z-10 my-16 sm:my-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#FFF9F5]">
              Lupa Password?
            </h1>
            <p className="text-sm text-[#AAB1BD] leading-relaxed">
              Masukkan email Anda dan kami akan mengirimkan kode OTP untuk reset password.
            </p>
          </div>

          <div className="space-y-4 pt-2">
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
                  className="w-full bg-[#141824] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-[#FFF9F5] placeholder-[#99A1AF] focus:border-[#E01C20] focus:ring-1 focus:ring-[#E01C20] transition-all outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
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
            {loading ? "Mengirim..." : "Kirim Kode OTP"}
          </button>

          {/* Helper Link */}
          <div className="pt-2 text-center text-sm text-[#AAB1BD]">
            <p>
              Sudah ingat password?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#E01C20] hover:underline"
              >
                Login di sini
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
