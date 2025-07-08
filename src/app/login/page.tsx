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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const backendUrl = "http://localhost:5000/api/v1/auth/login";

      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Terjadi kesalahan saat login");
      }

      console.log("Login berhasil:", data);
      localStorage.setItem("authToken", data.data.token);
      alert("Login Berhasil! Anda akan diarahkan ke halaman utama.");
      window.location.href = "/";
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan saat login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-50 via-white to-indigo-50 dark:from-red-900/20 dark:via-black dark:to-black">
      <AuthHeader /> {/* Gunakan header baru di sini */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl bg-card/80 dark:bg-black/50 backdrop-blur-lg border-2 dark:border-gray-800 mt-16 sm:mt-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Selamat Datang Kembali
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Masukkan email dan password Anda untuk masuk.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@multimedia.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-xs text-red-600 dark:text-red-400 hover:underline"
                  >
                    Lupa password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                type="submit"
                className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-700 dark:to-black text-white hover:from-red-700 hover:to-red-800 dark:hover:to-gray-900 shadow-lg"
                disabled={loading}
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
          </form>
          <CardFooter className="flex justify-center text-sm">
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
        </Card>
      </div>
    </div>
  );
}
