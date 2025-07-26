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
      <div className="flex items-center justify-center min-h-screen">
        Memverifikasi sesi...
      </div>
    );
  }

  return (
    <>
      <DashboardHeader />
      <main className="pt-20 bg-gray-50 dark:bg-gray-950 min-h-screen">
        <div className="container mx-auto py-8 px-4">
          {!selectedRegistration ? (
            <section className="mb-12">
              <h1 className="text-3xl font-bold mb-4">Lomba yang Anda Ikuti</h1>
              <MyRegistrationsList
                onSelectRegistration={handleSelectRegistration}
              />
            </section>
          ) : (
            <section className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="outline"
                  onClick={handleBackToList}
                  className="flex items-center gap-2"
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
        </div>
      </main>
      <Footer />
    </>
  );
}
