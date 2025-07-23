"use client";

import { useState } from "react";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import {
  GitHubLogoIcon,
  EyeOpenIcon,
  EyeClosedIcon,
} from "@radix-ui/react-icons";
import { AuthHeader } from "@/components/auth-header";

import { useAuth } from "@/hooks/use-auth";
import { useAuthContext } from "@/providers/AuthProvider";

const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(1, { message: "Password tidak boleh kosong." }),
});

export default function LoginPage() {
  const router = useRouter();
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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-indigo-50 dark:from-red-900/20 dark:via-black dark:to-black p-4">
      <AuthHeader />
      <Card className="w-full max-w-md shadow-2xl bg-card/80 dark:bg-black/50 backdrop-blur-lg border-2 dark:border-gray-800 mt-16 sm:mt-0">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Selamat Datang Kembali
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Masukkan email dan password Anda untuk masuk.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 mt-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="account@gmail.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="******"
                  {...register("password")}
                  className="pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Lihat password"
                  }
                >
                  {showPassword ? (
                    <EyeOpenIcon className="w-5 h-5" />
                  ) : (
                    <EyeClosedIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            {message && (
              <p
                className={`text-sm text-center ${
                  messageType === "success" ? "text-green-600" : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}
            <Button type="submit" disabled={loading} className="w-full mt-4">
              {loading ? "Loading..." : "Masuk"}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center text-sm mt-5">
            <p>
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-semibold text-red-600 dark:text-red-400 hover:underline"
              >
                Daftar di sini
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
