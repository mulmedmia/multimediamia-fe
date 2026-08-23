"use client";

import {
  useAdminStatsCategories,
  useAdminStatsProducts,
  useAdminStatsRegistrations,
  useAdminStatsSubmissions,
} from "@/hooks/admin-use-stats";
import { Users, UploadCloud, Filter, Package } from "lucide-react";

export default function AdminDashboardPage() {
  const {
    data: categories,
    isLoading: loadingCategories,
    error: errorCategories,
  } = useAdminStatsCategories();

  const {
    data: submissions,
    isLoading: loadingSubmissions,
    error: errorSubmissions,
  } = useAdminStatsSubmissions();

  const {
    data: products,
    isLoading: loadingProducts,
    error: errorProducts,
  } = useAdminStatsProducts();

  const {
    data: registrations,
    isLoading: loadingRegistrations,
    error: errorRegistrations,
  } = useAdminStatsRegistrations();

  const totalCategories = categories?.meta?.total || 0;
  const totalSubmissions = submissions?.meta?.total || 0;
  const totalProducts = products?.meta?.total || 0;
  const totalRegistrations = registrations?.meta?.total || 0;

  const stats = [
    {
      title: "Total Kategori",
      value: totalCategories,
      icon: Filter,
      loading: loadingCategories,
      error: errorCategories,
    },
    {
      title: "Total Pengumpulan",
      value: totalSubmissions,
      icon: UploadCloud,
      loading: loadingSubmissions,
      error: errorSubmissions,
    },
    {
      title: "Total Produk",
      value: totalProducts,
      icon: Package,
      loading: loadingProducts,
      error: errorProducts,
    },
    {
      title: "Total Pendaftar",
      value: totalRegistrations,
      icon: Users,
      loading: loadingRegistrations,
      error: errorRegistrations,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header text */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Dashboard Admin
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Selamat datang! Kelola kompetisi dari sini.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="mia-card p-5 sm:p-6 shadow-xl flex items-center justify-between transition-all"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                {stat.loading ? (
                  <div className="h-8 w-16 bg-muted/50 rounded-lg animate-pulse"></div>
                ) : stat.error ? (
                  <p className="text-sm text-destructive font-medium">Error</p>
                ) : (
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">
                    {Number(stat.value).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="bg-[#E01C20] p-3 sm:p-3.5 rounded-2xl text-white shadow-lg shadow-red-900/30 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent activity container */}
      <div className="mia-card p-6 sm:p-8 shadow-xl space-y-3">
        <h2 className="text-xl font-bold text-foreground">Aktivitas Terbaru</h2>
        <p className="text-sm text-muted-foreground">
          Belum ada aktivitas untuk ditampilkan
        </p>
      </div>
    </div>
  );
}
