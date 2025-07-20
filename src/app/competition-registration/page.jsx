"use client";

import React, { useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CompetitionRegistrationForm } from "@/components/forms/CompetitionRegistrationForm";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";
import { AuthHeader } from "@/components/auth-header";

export default function CompetitionRegistrationPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  // Tampilkan loading saat sistem sedang memeriksa status autentikasi
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Memuat...</p>
      </div>
    );
  }

if (!user) 
    return null;

  // Jika user sudah login, akan ditampilkan halaman pendaftaran
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-indigo-50 dark:from-red-900/20 dark:via-black dark:to-black p-4">
      <AuthHeader />
      <Card className="w-full max-w-lg shadow-2xl bg-card/80 dark:bg-black/50 backdrop-blur-lg border-2 dark:border-gray-800 mt-16 sm:mt-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Pendaftaran Lomba
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Pilih kategori dan lengkapi detail pendaftaran Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-5">
          {/* Tampilkan komponen form yang sudah dibuat */}
          <CompetitionRegistrationForm />
        </CardContent>
      </Card>
    </div>
  );
}
