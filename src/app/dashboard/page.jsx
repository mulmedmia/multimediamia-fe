"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";
import { CompetitionRegistrationForm } from "@/components/forms/CompetitionRegistrationForm";
import { MyRegistrationsList } from "@/components/dashboard/MyRegistrationsList";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import Footer from "@/components/layout/Footer";

export default function DashboardPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">Memverifikasi sesi...</div>
    );
  }

  return (
    <>
      <DashboardHeader />
      <main className="pt-20 bg-gray-50 dark:bg-gray-950 min-h-screen">
        <div className="container mx-auto py-8 px-4">
          <section className="mb-12">
            <h1 className="text-3xl font-bold mb-4">Lomba yang Anda Ikuti</h1>
            <MyRegistrationsList />
          </section>
          <section>
            <h2 className="text-3xl font-bold mb-4 text-center">Daftar Lomba Baru</h2>
            <div className="p-8 bg-card rounded-lg shadow-lg max-w-lg mx-auto">
              <CompetitionRegistrationForm />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}