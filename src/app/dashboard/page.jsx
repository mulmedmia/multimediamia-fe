"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";
import { CompetitionRegistrationForm } from "@/components/forms/CompetitionRegistrationForm";
import { MyRegistrationsList } from "@/components/dashboard/MyRegistrationsList";
import { CompetitionDashboard } from "@/components/dashboard/CompetitionDashboard";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import Footer from "@/components/layout/Footer";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Memverifikasi sesi...
      </div>
    );
  }

  if (selectedRegistration) {
    return (
      <>
        <DashboardHeader />
        <main className="pt-20 bg-gray-50 dark:bg-gray-950 min-h-screen">
          <div className="container mx-auto py-8 px-4">
            <Button
              variant="outline"
              onClick={() => setSelectedRegistration(null)}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Lomba
            </Button>
            <CompetitionDashboard registration={selectedRegistration} />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <DashboardHeader />
      <main className="pt-20 bg-gray-50 dark:bg-gray-950 min-h-screen">
        <div className="container mx-auto py-8 px-4">
          <section className="mb-12">
            <h1 className="text-3xl font-bold mb-4">Lomba yang Anda Ikuti</h1>
            <MyRegistrationsList onSelectRegistration={setSelectedRegistration} />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
