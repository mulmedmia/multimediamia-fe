"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
import { LightningBoltIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export default function OtpPage() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");
  const [resendLoading, setResendLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("pendingEmail") || "";
    setEmail(savedEmail);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!/^\d{6}$/.test(otp)) {
      setMessage("OTP harus terdiri dari 6 digit angka.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Verifikasi berhasil! Anda bisa login sekarang.");
        setMessageType("success");
        localStorage.removeItem("pendingEmail");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setMessage("OTP tidak valid atau sudah kadaluarsa.");
        setMessageType("error");
      }
    } catch (err) {
      setMessage("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setMessage("Email tidak ditemukan. Silakan daftar terlebih dahulu.");
      setMessageType("error");
      return;
    }

    setResendLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/request-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Kode OTP baru telah dikirim ke email Anda.");
        setMessageType("success");
      } else {
        setMessage("Gagal mengirim ulang OTP. Silakan coba lagi.");
        setMessageType("error");
      }
    } catch (err) {
      setMessage("Terjadi kesalahan jaringan. Silakan coba lagi.");
      setMessageType("error");
    } finally {
      setResendLoading(false);
    }
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
              <Label htmlFor="otp">Kode OTP</Label>
              <Input
                id="otp"
                type="text"
                maxLength={6}
                pattern="[0-9]*"
                placeholder="123456"
                required
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-red-600 to-red-700 dark:to-black text-white hover:from-red-700 hover:to-red-800 dark:hover:to-gray-900 shadow-lg"
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
                onClick={handleResendOtp}
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
