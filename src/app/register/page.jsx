"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useRegister } from "@/hooks/use-auth";

const registerSchema = z.object({
  fullname: z.string().min(3, { message: "Nama lengkap minimal 3 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(6, { message: "Password minimal 6 karakter." }),
});

export default function RegisterPage() {

  const { loading, message, messageType, handleRegister } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data) => {
    handleRegister(data.fullname, data.email, data.password);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-red-50 via-white to-indigo-50 dark:from-red-900/20 dark:via-black dark:to-black p-4">
      <AuthHeader />
      <Card className="mt-5 w-full max-w-md shadow-2xl bg-card/80 dark:bg-black/50 backdrop-blur-lg border-2 dark:border-gray-800">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="text-center">
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
                {...register("fullname")}
              />
              {errors.fullname && (
                <p className="text-xs text-red-500 mt-1">{errors.fullname.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="account@gmail.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="******"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "Memproses Akun..." : "Buat Akun"}
            </Button>
            {message && (
              <p className={`text-sm text-center mt-2 ${messageType === "success" ? "text-green-600" : "text-red-500"}`}>
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
          <CardFooter className="flex justify-center text-sm mt-5">
            <p>
              Sudah punya akun?{" "}
              <Link href="/login" className="font-semibold text-red-600 dark:text-red-400 hover:underline">
                Masuk di sini
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}