"use client";

import { Users, UploadCloud, Building2, Package } from "lucide-react";

// Example data for stat cards
const stats = [
  {
    title: "Total Kategori",
    value: "12",
    icon: Package,
  },
  {
    title: "Total Pengumpulan",
    value: "10",
    icon: UploadCloud,
  },
  {
    title: "Total Produk",
    value: "89",
    icon: Building2,
  },
  {
    title: "Total User",
    value: "20",
    icon: Users,
  },
];

export default function AdminDashboardPage() {
  return (
    // Main container for the dashboard page. 
    // No need for 'container' or 'px' classes here, as the parent layout handles it.
    <div className="space-y-8">
      
      {/* Page header with responsive typography */}
      <div>
        {/* Responsive font size for the main title. Larger on bigger screens. */}
        <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
          Dashboard Admin
        </h1>
        {/* Responsive font size for the subtitle. */}
        <p className="mt-1 text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
          Selamat datang, Kelola kompetisi dari sini.
        </p>
      </div>

      {/* Responsive grid for displaying stat cards. */}
      {/* It's 1 col on mobile, 2 on tablets (sm), and 4 on laptops (lg). */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            // A single stat card component.
            <div
              key={index}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-black dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                 <Icon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Other dashboard content can start here */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
         <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Aktivitas Terbaru</h2>
         {/* Placeholder for future content like a table or a list */}
         <p className="text-sm text-neutral-500 dark:text-neutral-400">Belum ada aktivitas terbaru untuk ditampilkan.</p>
      </div>
    </div>
  );
}