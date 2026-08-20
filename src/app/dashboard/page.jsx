"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";
import { CompetitionRegistrationForm } from "@/components/forms/CompetitionRegistrationForm";
import { CompetitionDashboard } from "@/components/dashboard/CompetitionDashboard";
import { MyRegistrationsList } from "@/components/dashboard/MyRegistrationsList";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";

export default function DashboardPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [activeTab, setActiveTab] = useState("beranda");

  // Function untuk handle selection registration dengan tab
  const handleSelectRegistration = (registration, tab = "beranda") => {
    setSelectedRegistration(registration);
    setActiveTab(tab);
  };

  // Function untuk kembali ke list
  const handleBackToList = () => {
    setSelectedRegistration(null);
    setActiveTab("beranda");
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen w-full bg-background mia-connected-bg flex items-center justify-center text-foreground">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ring mx-auto"></div>
          <p className="text-base text-muted-foreground">
            Memverifikasi sesi...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background mia-connected-bg text-foreground relative selection:bg-primary selection:text-white flex flex-col justify-between">
      <DashboardHeader />
      <main className="relative z-10 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1 min-h-screen">
        {!selectedRegistration ? (
          <section className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                Lomba yang Anda Ikuti
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Kelola pendaftaran, kuis, dan pengumpulan berkas lomba Anda di
                MIA 2026
              </p>
            </div>
            <MyRegistrationsList
              onSelectRegistration={handleSelectRegistration}
            />
          </section>
        ) : (
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={handleBackToList}
                className="flex items-center gap-2 rounded-full bg-input/40 border border-white/20 hover:border-white/40 hover:bg-input text-foreground text-xs sm:text-sm px-4 h-9 cursor-pointer transition-all font-medium shadow-sm"
              >
                ← Kembali ke Daftar Lomba
              </Button>
            </div>
            <CompetitionDashboard
              registration={selectedRegistration}
              initialTab={activeTab}
            />
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
