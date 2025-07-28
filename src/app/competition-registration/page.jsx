"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CompetitionRegistrationForm } from "@/components/forms/CompetitionRegistrationForm";
import { useAuthContext } from "@/providers/AuthProvider";
import { AuthHeader } from "@/components/auth-header";

function CompetitionRegistrationPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");
  const { user, isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Memuat...</p>
      </div>
    );
  }

  if (!user) return null;

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
          <CompetitionRegistrationForm defaultCategoryId={categoryId} />
        </CardContent>
      </Card>
    </div>
  );
}

export default function CompetitionRegistrationPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><p>Memuat...</p></div>}>
      <CompetitionRegistrationPageInner />
    </Suspense>
  );
}