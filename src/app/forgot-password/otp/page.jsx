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
import { useResetPassword } from "@/hooks/user-use-forgot-password";
import Cookies from "js-cookie";
import { Eye, EyeOff } from "lucide-react";

export default function OtpPage() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const inputsRef = React.useRef([]);

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
    
    if (newPassword !== confirmPassword) {
      return;
    }
    
    handleResetPassword(email, otp, newPassword);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-red-50 via-white to-indigo-50 dark:from-red-900/20 dark:via-black dark:to-black p-4">
      <AuthHeader />
      <Card className="w-full max-w-md shadow-2xl bg-card/80 dark:bg-black/50 backdrop-blur-lg border-2 dark:border-gray-800">
        <form onSubmit={handleSubmit}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription className="text-muted-foreground">
              Masukkan kode OTP dan password baru Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Kode OTP : </Label>
              <div className="flex gap-2 justify-center">
                {otpArray.map((digit, idx) => (
                  <Input
                    key={idx}
                    ref={(el) => (inputsRef.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-10 h-12 text-center text-lg font-bold border-2 border-red-300 dark:border-red-700 focus:border-red-600 dark:focus:border-red-400 rounded"
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

            <div className="space-y-2">
              <Label htmlFor="newPassword">Password Baru</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password baru"
                  className="border-2 border-red-300 dark:border-red-700 focus:border-red-600 dark:focus:border-red-400 pr-10"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Konfirmasi password baru"
                  className="border-2 border-red-300 dark:border-red-700 focus:border-red-600 dark:focus:border-red-400 pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  Password tidak cocok!
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-red-600 to-red-700 dark:to-black text-white hover:from-red-700 hover:to-red-800 dark:hover:to-gray-900 shadow-lg"
              disabled={loading || newPassword !== confirmPassword}
            >
              {loading ? "Memproses..." : "Reset Password"}
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
