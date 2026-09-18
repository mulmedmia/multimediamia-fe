"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AuthHeader } from "@/components/auth-header";
import { useResetPassword } from "@/hooks/user-use-forgot-password";
import Cookies from "js-cookie";
import {
  EyeOpenIcon,
  EyeClosedIcon,
  LockClosedIcon,
} from "@radix-ui/react-icons";

export default function ResetPasswordOtpPage() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const inputsRef = useRef([]);

  const {
    loading,
    resendLoading,
    message,
    messageType,
    handleResetPassword,
    handleResendOtp,
  } = useResetPassword();

  useEffect(() => {
    const savedEmail = Cookies.get("pendingEmail") || "";
    setEmail(savedEmail);
  }, []);

  useEffect(() => {
    setOtp(otpArray.join(""));
  }, [otpArray]);

  // Countdown timer effect
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleOtpChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (val.length > 1) return;
    const newArr = [...otpArray];
    newArr[idx] = val;
    setOtpArray(newArr);

    if (val && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otpArray[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
    handleResetPassword(email, otp, newPassword);
  };

  const triggerResend = async () => {
    if (countdown > 0 || resendLoading) return;
    await handleResendOtp(email);
    setCountdown(120); // 120s for second time and onwards
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0D14] mia-connected-bg p-4 relative overflow-hidden selection:bg-[#E01C20] selection:text-white">
      <AuthHeader />

      <div className="w-full max-w-md mia-card p-8 shadow-2xl relative z-10 my-16 sm:my-0">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#FFF9F5]">
              Reset Password
            </h1>
            <p className="text-sm text-[#AAB1BD] leading-relaxed">
              Masukkan kode OTP yang dikirim ke{" "}
              <span className="font-bold text-[#FFF9F5]">{email || "email Anda"}</span> dan password baru Anda.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {/* OTP Code */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-center text-[#FFF9F5]">
                Kode OTP
              </label>
              <div className="flex gap-2 justify-center">
                {otpArray.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputsRef.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-11 h-13 bg-[#141824] border border-white/10 text-[#FFF9F5] focus:border-[#E01C20] focus:ring-1 focus:ring-[#E01C20] rounded-xl font-bold text-xl text-center shadow-sm outline-none transition-all"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    autoFocus={idx === 0}
                    onPaste={(e) => {
                      const paste = e.clipboardData
                        .getData("text")
                        .replace(/[^0-9]/g, "");
                      if (paste.length === 6) {
                        setOtpArray(paste.split(""));
                        inputsRef.current[5]?.focus();
                        e.preventDefault();
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label htmlFor="newPassword" className="block text-sm font-semibold text-[#FFF9F5]">
                Password Baru
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AAB1BD]">
                  <LockClosedIcon className="w-4 h-4" />
                </div>
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password baru"
                  className="w-full bg-[#141824] border border-white/10 rounded-xl py-3 pl-10 pr-10 text-sm text-[#FFF9F5] placeholder-[#99A1AF] focus:border-[#E01C20] focus:ring-1 focus:ring-[#E01C20] transition-all outline-none"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#AAB1BD] hover:text-[#FFF9F5] focus:text-[#FFF9F5] cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOpenIcon className="w-4 h-4" />
                  ) : (
                    <EyeClosedIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
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
                  placeholder="Konfirmasi password baru"
                  className="w-full bg-[#141824] border border-white/10 rounded-xl py-3 pl-10 pr-10 text-sm text-[#FFF9F5] placeholder-[#99A1AF] focus:border-[#E01C20] focus:ring-1 focus:ring-[#E01C20] transition-all outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#AAB1BD] hover:text-[#FFF9F5] focus:text-[#FFF9F5] cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOpenIcon className="w-4 h-4" />
                  ) : (
                    <EyeClosedIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-[#E01C20] mt-1 font-medium">
                  Password tidak cocok!
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
            disabled={loading || newPassword !== confirmPassword}
            className="mia-btn-primary w-full py-3.5 text-base shadow-lg shadow-red-900/30 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? "Memproses..." : "Reset Password"}
          </button>

          {/* Helper Link with Countdown */}
          <div className="pt-2 text-center text-sm text-[#AAB1BD]">
            <p>
              Belum menerima kode?{" "}
              <button
                type="button"
                onClick={triggerResend}
                disabled={resendLoading || countdown > 0}
                className="font-semibold text-[#E01C20] hover:underline cursor-pointer disabled:opacity-50 disabled:no-underline"
              >
                {resendLoading
                  ? "Mengirim ulang..."
                  : countdown > 0
                  ? `Kirim ulang OTP (${countdown}s)`
                  : "Kirim ulang OTP"}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
