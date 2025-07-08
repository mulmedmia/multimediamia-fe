"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import { LightningBoltIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullname,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Registrasi berhasil. OTP telah dikirim ke email Anda.");
        setMessageType("success");
        localStorage.setItem("pendingEmail", formData.email);
        // Redirect to OTP verification page
        router.push("/register/otp");
      } else {
        setMessage("Registrasi gagal. Email sudah terdaftar.");
        setMessageType("error");
      }
    } catch (err) {
      setMessage("Terjadi kesalahan jaringan. Silakan coba lagi.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-red-50 via-white to-indigo-50 dark:from-red-900/20 dark:via-black dark:to-black p-4">
      <Card className="w-full max-w-md shadow-2xl bg-card/80 dark:bg-black/50 backdrop-blur-lg border-2 dark:border-gray-800">
        <form onSubmit={handleSubmit}>
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-black rounded-xl flex items-center justify-center shadow-lg">
                <LightningBoltIcon className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-700 bg-clip-text text-transparent">
                Multimedia in Action
              </h1>
            </div>
            <CardTitle className="text-2xl font-bold">Buat Akun Baru</CardTitle>
            <CardDescription className="text-muted-foreground">
              Isi data di bawah ini untuk memulai perjalanan kreatif Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 mt-4">
              <Label htmlFor="fullname">Nama Lengkap</Label>
              <Input
                id="fullname"
                placeholder="John Doe"
                required
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@contoh.com"
                required
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                onChange={handleChange}
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-700 dark:to-black text-white hover:from-red-700 hover:to-red-800 dark:hover:to-gray-900 shadow-lg"
            >
              {loading ? "Memproses Akun..." : "Buat Akun"}
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

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Atau daftar dengan
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <GitHubLogoIcon className="mr-2 h-4 w-4" />
              Daftar dengan GitHub
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center text-sm">
            <p>
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="font-semibold text-red-600 dark:text-red-400 hover:underline"
              >
                Masuk di sini
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
