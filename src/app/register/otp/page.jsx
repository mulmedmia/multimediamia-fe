"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AuthHeader } from "@/components/auth-header";
import { useOtp } from "@/hooks/use-auth";
import Cookies from "js-cookie";
import { InfoCircledIcon } from "@radix-ui/react-icons";

export default function OtpPage() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const inputsRef = useRef([]);

  const {
    loading,
    resendLoading,
    message,
    messageType,
    handleVerifyOtp,
    handleResendOtp,
  } = useOtp();

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
    handleVerifyOtp(email, otp);
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#FFF9F5]">
              Verifikasi OTP
            </h1>
            <p className="text-sm text-[#AAB1BD] leading-relaxed">
              Masukkan 6 digit kode yang dikirim ke{" "}
              <span className="font-bold text-[#FFF9F5]">{email || "email Anda"}</span>
            </p>
          </div>

          {/* Reminder Cek Inbox & Spam */}
          <div className="bg-[#141824]/90 border border-white/10 rounded-xl p-3 flex items-start gap-2.5 text-left shadow-inner">
            <InfoCircledIcon className="w-4 h-4 text-[#E01C20] shrink-0 mt-0.5" />
            <p className="text-xs text-[#AAB1BD] leading-relaxed">
              Belum menerima kode? Mohon periksa folder <strong className="text-[#FFF9F5] font-semibold">Inbox</strong> dan <strong className="text-[#FFF9F5] font-semibold">Spam / Junk</strong> di email Anda.
            </p>
          </div>

          <div className="space-y-4 pt-1">
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
            {loading ? "Memverifikasi..." : "Verifikasi"}
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
