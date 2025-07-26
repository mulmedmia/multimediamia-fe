"use client";

import { useMyRedemptions } from "@/hooks/user-use-gamifikasi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Package, Calendar, Coins } from "lucide-react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default function HistoryPesananPage() {
  const { data, isLoading, isError } = useMyRedemptions();

  if (isLoading) {
    return (
      <main className="container mx-auto py-8 px-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="container mx-auto py-20 px-4">
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardContent className="flex items-center gap-3 p-6">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <p className="text-red-800 dark:text-red-200">
              Gagal memuat data history penukaran. Silakan coba lagi.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <>
      <DashboardHeader />
    <main className="container mx-auto py-20 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            History Penukaran
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Riwayat penukaran poin Anda dengan berbagai produk
          </p>
        </div>

        {/* Stats Card */}
        {data && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    Total Penukaran
                  </p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {data.meta?.total || 0} item
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        {data && data.redemptions.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300 dark:border-gray-700">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Belum ada riwayat penukaran
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Anda belum melakukan penukaran poin dengan produk apapun.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {data?.redemptions.map((item) => (
              <Card key={item.redemption_id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                        <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {item.product?.name}
                          </h3>
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Berhasil
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(item.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Coins className="h-4 w-4" />
                            <span>{item.points_used} poin</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Harga</p>
                      <p className="font-semibold text-orange-600 dark:text-orange-400">
                        {item.product?.price} poin
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination info */}
        {data && data.meta && data.meta.totalPages > 1 && (
          <Card className="bg-gray-50 dark:bg-gray-900">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Halaman {data.meta.page} dari {data.meta.totalPages} 
                ({data.meta.total} total item)
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
    </>
  );
}