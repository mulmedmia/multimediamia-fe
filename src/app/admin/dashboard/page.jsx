"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, UploadCloud, Building2, Package } from "lucide-react";

const fetchStats = async (endpoint) => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${API_URL}${endpoint}?limit=1&page=1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return 0;
    }

    const data = await response.json();

    // Cek struktur response dari API
    if (data && data.meta && typeof data.meta.total === "number") {
      return data.meta.total;
    } else if (
      data &&
      data.data &&
      data.data.meta &&
      typeof data.data.meta.total === "number"
    ) {
      return data.data.meta.total;
    } else {
      return 0;
    }
  } catch (error) {
    return 0;
  }
};

export default function AdminDashboardPage() {
  const {
    data: totalCategories = 0,
    isLoading: loadingCategories,
    error: errorCategories,
  } = useQuery({
    queryKey: ["admin-stats-categories"],
    queryFn: () => fetchStats("/categories"),
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: totalSubmissions = 0,
    isLoading: loadingSubmissions,
    error: errorSubmissions,
  } = useQuery({
    queryKey: ["admin-stats-submissions"],
    queryFn: () => fetchStats("/submissions"),
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: totalProducts = 0,
    isLoading: loadingProducts,
    error: errorProducts,
  } = useQuery({
    queryKey: ["admin-stats-products"],
    queryFn: () => fetchStats("/products"),
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: totalRegistrations = 0,
    isLoading: loadingRegistrations,
    error: errorRegistrations,
  } = useQuery({
    queryKey: ["admin-stats-registrations"],
    queryFn: () => fetchStats("/registrations"),
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const stats = [
    {
      title: "Total Kategori",
      value: totalCategories,
      icon: Package,
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
      icon: Building2,
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
          Dashboard Admin
        </h1>
        <p className="mt-1 text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
          Selamat datang, Kelola kompetisi dari sini.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {stat.title}
                </p>
                {stat.loading ? (
                  <div className="h-8 w-16 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                ) : stat.error ? (
                  <p className="text-sm text-red-500">Error</p>
                ) : (
                  <p className="text-2xl font-bold text-black dark:text-white">
                    {Number(stat.value).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                <Icon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
        <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
          Aktivitas Terbaru
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Belum ada aktivitas terbaru untuk ditampilkan.
        </p>
      </div>
    </div>
  );
}
