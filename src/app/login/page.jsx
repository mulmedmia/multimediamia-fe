"use client";

import React, { useState } from "react";
import Link from "next/link";
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
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { AuthHeader } from "@/components/auth-header";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, message, messageType, handleLogin } = useAuth();

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-50 via-white to-indigo-50 dark:from-red-900/20 dark:via-black dark:to-black">
      <AuthHeader />
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl bg-card/80 dark:bg-black/50 backdrop-blur-lg border-2 dark:border-gray-800 mt-16 sm:mt-0">
          <form onSubmit={onSubmit}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {message && (
                <p
                  className={`text-sm text-center ${
                    messageType === "success"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                >
                  {message}
                </p>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-700 dark:to-black text-white hover:from-red-700 hover:to-red-800 dark:hover:to-gray-900 shadow-lg"
              >
                {loading ? "Loading..." : "Masuk"}
              </Button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Atau lanjutkan dengan
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-full" type="button">
                <GitHubLogoIcon className="mr-2 h-4 w-4" />
                Login dengan GitHub
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
    </div>
  );
}