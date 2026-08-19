"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CompetitionRegistrationForm } from "@/components/forms/CompetitionRegistrationForm";
import { useAuthContext } from "@/providers/AuthProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
      <div className="min-h-screen w-full bg-background mia-connected-bg flex items-center justify-center text-foreground">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ring mx-auto"></div>
          <p className="text-base text-muted-foreground">
            Memuat pendaftaran...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen w-full bg-background mia-connected-bg text-foreground relative overflow-hidden selection:bg-primary selection:text-white flex flex-col justify-between">
      <Header />

      <main className="min-h-screen relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full flex items-center">
        {/* Competition Form Card Container */}
        <div className="mia-card p-6 sm:p-10 shadow-2xl space-y-8">
          {/* Page Title Section - Centered */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Pendaftaran Lomba
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Pilih kategori dan lengkapi detail pendaftaran Anda di MIA 2026
            </p>
          </div>

          <CompetitionRegistrationForm defaultCategoryId={categoryId} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CompetitionRegistrationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-background mia-connected-bg flex items-center justify-center text-foreground">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ring mx-auto"></div>
            <p className="text-base text-muted-foreground">
              Memuat pendaftaran...
            </p>
          </div>
        </div>
      }
    >
      <CompetitionRegistrationPageInner />
    </Suspense>
  );
}
