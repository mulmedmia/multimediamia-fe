"use client";

import React from "react";
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

// Impor ikon Google jika diperlukan, atau gunakan ikon lain
// import { GoogleIcon } from "@/components/icons/GoogleIcon";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-red-50 via-white to-indigo-50 dark:from-red-900/20 dark:via-black dark:to-black p-4">
      <Card className="w-full max-w-md shadow-2xl bg-card/80 dark:bg-black/50 backdrop-blur-lg border-2 dark:border-gray-800">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-black rounded-xl flex items-center justify-center shadow-lg">
              <LightningBoltIcon className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-700 bg-clip-text text-transparent">
              Multimedia in Action
            </h1>
          </div>
          <CardTitle className="text-2xl font-bold">
            Selamat Datang Kembali
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Masukkan email dan password Anda untuk masuk.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@contoh.com"
              required
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
            <Input id="password" type="password" required />
          </div>
          <Button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-700 dark:to-black text-white hover:from-red-700 hover:to-red-800 dark:hover:to-gray-900 shadow-lg"
          >
            Masuk
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
          <Button variant="outline" className="w-full">
            <GitHubLogoIcon className="mr-2 h-4 w-4" />
            Login dengan GitHub
          </Button>
        </CardContent>
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
  );
}