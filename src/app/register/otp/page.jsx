"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AuthHeader } from "@/components/auth-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOtp } from "@/hooks/use-auth";


export default function OtpPage() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const inputsRef = React.useRef([]);

  const {
    loading,
    resendLoading,
    message,
    messageType,
    handleVerifyOtp,
    handleResendOtp,
  } = useOtp();

  useEffect(() => {
    const savedEmail = localStorage.getItem("pendingEmail") || "";
    setEmail(savedEmail);
  }, []);

  // Gabungkan array ke string OTP
  useEffect(() => {
    setOtp(otpArray.join(""));
  }, [otpArray]);

  // Handler untuk setiap input
  const handleOtpChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (val.length > 1) return;
    const newArr = [...otpArray];
    newArr[idx] = val;
    setOtpArray(newArr);

    // Fokus ke input berikutnya jika ada
    if (val && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  // Handler untuk backspace
  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otpArray[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleVerifyOtp(email, otp);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-red-50 via-white to-indigo-50 dark:from-red-900/20 dark:via-black dark:to-black p-4">
      <AuthHeader />
      <Card className="w-full max-w-md shadow-2xl bg-card/80 dark:bg-black/50 backdrop-blur-lg border-2 dark:border-gray-800">
        <form onSubmit={handleSubmit}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Verifikasi OTP</CardTitle>
            <CardDescription className="text-muted-foreground">
              Masukkan 6 digit kode yang dikirim ke email Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 mt-5">
              <Label htmlFor="otp">Kode OTP : </Label>
              <div className="flex gap-2 justify-center">
                {otpArray.map((digit, idx) => (
                  <Input
                    key={idx}
                    ref={el => inputsRef.current[idx] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-10 h-12 text-center text-lg font-bold border-2 border-red-300 dark:border-red-700 focus:border-red-600 dark:focus:border-red-400 rounded"
                    value={digit}
                    onChange={e => handleOtpChange(e, idx)}
                    onKeyDown={e => handleOtpKeyDown(e, idx)}
                    autoFocus={idx === 0}
                    onPaste={e => {
                      const paste = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
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

            <Button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-red-600 to-red-700 dark:to-black text-white hover:from-red-700 hover:to-red-800 dark:hover:to-gray-900 shadow-lg"
              disabled={loading}
            >
              {loading ? "Memverifikasi..." : "Verifikasi"}
            </Button>

            {message && (
              <p
                className={`text-sm text-center mt-2 ${
                  messageType === "success"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-500 dark:text-red-400"
                }`}
              >
                {message}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex justify-center text-sm mt-3">
            <p>
              Belum menerima kode?{" "}
              <span
                onClick={() => handleResendOtp(email)}
                className="cursor-pointer font-semibold text-red-600 dark:text-red-400 hover:underline"
              >
                {resendLoading ? "Mengirim ulang..." : "Kirim ulang OTP"}
              </span>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}