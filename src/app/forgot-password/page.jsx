"use client";

import React, { useState } from "react";
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
import { useRequestOtp } from "@/hooks/user-use-forgot-password";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const { loading, message, messageType, handleRequestOtp } = useRequestOtp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleRequestOtp(email);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-red-50 via-white to-indigo-50 dark:from-red-900/20 dark:via-black dark:to-black p-4">
      <AuthHeader />
      <Card className="w-full max-w-md shadow-2xl bg-card/80 dark:bg-black/50 backdrop-blur-lg border-2 dark:border-gray-800">
        <form onSubmit={handleSubmit}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Lupa Password?
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Masukkan email Anda dan kami akan mengirimkan kode OTP untuk
              reset password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@example.com"
                  className="pl-10 border-2 border-red-300 dark:border-red-700 focus:border-red-600 dark:focus:border-red-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 dark:to-black text-white hover:from-red-700 hover:to-red-800 dark:hover:to-gray-900 shadow-lg"
              disabled={loading}
            >
              {loading ? "Mengirim..." : "Kirim Kode OTP"}
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
          <CardFooter className="flex justify-center text-sm p-3">
            <p>
              Sudah ingat password?{" "}
              <Link
                href="/login"
                className="font-semibold text-red-600 dark:text-red-400 hover:underline"
              >
                Login di sini
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
