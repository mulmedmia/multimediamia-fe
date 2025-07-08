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

export default function RegisterPage() {
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
          <CardTitle className="text-2xl font-bold">Buat Akun Baru</CardTitle>
          <CardDescription className="text-muted-foreground">
            Isi data di bawah ini untuk memulai perjalanan kreatif Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullname">Nama Lengkap</Label>
            <Input id="fullname" placeholder="John Doe" required />
          </div>
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
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <Button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-700 dark:to-black text-white hover:from-red-700 hover:to-red-800 dark:hover:to-gray-900 shadow-lg"
          >
            Buat Akun
          </Button>
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
      </Card>
    </div>
  );
}