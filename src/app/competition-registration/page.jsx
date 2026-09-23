"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CompetitionRegistrationForm } from "@/components/forms/CompetitionRegistrationForm";
import { RegistrationSuccessSinglePage } from "@/components/forms/RegistrationSuccessSinglePage";
import { useAuthContext } from "@/providers/AuthProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useMyRegistrations } from "@/hooks/user-use-registration";

function CompetitionRegistrationPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");
  const { user, isLoading } = useAuthContext();
  const [successRegistration, setSuccessRegistration] = useState(null);

  const { data: registrations } = useMyRegistrations(user?.users_id);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }

    if (
      !successRegistration &&
      Array.isArray(registrations) &&
      registrations.find((reg) => reg.category_id === String(categoryId))
    ) {
      router.replace("/dashboard");
    }
  }, [isLoading, user, router, registrations, categoryId, successRegistration]);

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

      <main className="min-h-screen relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full flex items-center justify-center">
        {successRegistration ? (
          <RegistrationSuccessSinglePage
            registration={successRegistration}
            onClose={() => router.push("/dashboard")}
          />
        ) : (
          <div className="mia-card p-6 sm:p-10 shadow-2xl space-y-8 w-full">
            {/* Page Title Section - Centered */}
            <div className="space-y-2 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                Pendaftaran Lomba
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Pilih kategori dan lengkapi detail pendaftaran Anda di MIA 2026
              </p>
            </div>

            <CompetitionRegistrationForm
              defaultCategoryId={categoryId}
              onSuccessRegistration={(data) => setSuccessRegistration(data)}
            />
          </div>
        )}
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
