"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";
import { CompetitionDashboard } from "@/components/dashboard/CompetitionDashboard";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import Footer from "@/components/layout/Footer";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getMyRegistrations } from "@/services/competition.service.js";

export default function DashboardDetailPage({ params }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const [registrationId, setRegistrationId] = useState(null);
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  // Resolve dynamic params
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setRegistrationId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  // Fetch user registrations
  const {
    data: registrations,
    isLoading: registrationsLoading,
    isError: registrationsError,
  } = useQuery({
    queryKey: ["myRegistrations", user?.users_id],
    queryFn: () => getMyRegistrations(user.users_id),
    enabled: !!user?.users_id,
  });

  // Find specific registration by ID
  useEffect(() => {
    if (registrations && registrationId) {
      const foundRegistration = registrations.find(
        (reg) => String(reg.registration_id) === String(registrationId)
      );

      if (foundRegistration) {
        setSelectedRegistration(foundRegistration);
      } else {
        // Registration not found, redirect to main dashboard
        router.push("/dashboard");
      }
    }
  }, [registrations, registrationId, router]);

  // Auth checks
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Loading states
  if (loading || !user || registrationsLoading || !registrationId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  // Error states
  if (registrationsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p>Gagal memuat data pendaftaran.</p>
          <Button onClick={() => router.push("/dashboard")} className="mt-4">
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Registration not found
  if (!selectedRegistration) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            Pendaftaran Tidak Ditemukan
          </h2>
          <p className="text-muted-foreground mb-4">
            Pendaftaran dengan ID tersebut tidak ditemukan atau Anda tidak
            memiliki akses.
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardHeader />
      <main className="pt-20 bg-gray-50 dark:bg-gray-950 min-h-screen">
        <div className="container mx-auto py-8 px-4">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Lomba
          </Button>

          {/* Competition Dashboard */}
          <CompetitionDashboard registration={selectedRegistration} />
        </div>
      </main>
      <Footer />
    </>
  );
}
