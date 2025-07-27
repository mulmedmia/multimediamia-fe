"use client";

import { useMyRedemptions } from "@/hooks/user-use-gamifikasi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Package, Calendar, Coins, Trophy, Sparkles } from "lucide-react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default function HistoryPesananPage() {
  const { data, isLoading, isError } = useMyRedemptions();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto py-8 px-4">
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-10 w-80 rounded-xl" />
              <Skeleton className="h-6 w-96 rounded-lg" />
            </div>
            <Skeleton className="h-32 w-full rounded-2xl" />
            <div className="grid gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto py-20 px-4">
          <Card className="border-red-200 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950 dark:border-red-800 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="flex items-center gap-4 p-8">
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-1">
                  Terjadi Kesalahan
                </h3>
                <p className="text-red-700 dark:text-red-300">
                  Gagal memuat data history penukaran. Silakan coba lagi.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <>
      <DashboardHeader />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto py-20 px-2 sm:px-4">
          <div className="space-y-8">
            {/* Enhanced Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-950 dark:to-pink-950 rounded-full mb-4">
                <Trophy className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                  Riwayat Pencapaian
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-red-600 to-pink-600 dark:from-white dark:via-red-400 dark:to-pink-400 bg-clip-text text-transparent">
                History Penukaran
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Riwayat penukaran <span className="inline-flex items-center gap-1 font-semibold text-red-600 dark:text-red-400">Diamonds <span role="img" aria-label="diamond">💎</span></span> Anda dengan berbagai produk menarik
              </p>
            </div>

            {/* Enhanced Stats Card */}
            {data && (
              <Card className="bg-gradient-to-r from-red-500 via-red-600 to-pink-600 dark:from-red-600 dark:via-red-700 dark:to-pink-700 border-0 shadow-2xl rounded-3xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-pink-500/20"></div>
                <CardContent className="p-8 relative">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-white/20 dark:bg-black/20 rounded-2xl backdrop-blur-sm">
                        <Package className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <p className="text-red-100 dark:text-red-200 font-medium mb-1">
                          Total Penukaran Berhasil
                        </p>
                        <p className="text-4xl font-bold text-white">
                          {data.meta?.total || 0} <span className="text-2xl font-normal">item</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
                      <Sparkles className="h-4 w-4 text-yellow-200 animate-pulse delay-75" />
                      <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse delay-150" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Content */}
            {data && data.redemptions.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-lg">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="p-6 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-950 dark:to-pink-950 rounded-full mb-6">
                    <Package className="h-16 w-16 text-red-400 dark:text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Belum ada riwayat penukaran
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center text-lg max-w-md">
                    Anda belum melakukan penukaran <span className="inline-flex items-center gap-1 font-semibold text-red-600 dark:text-red-400">Diamonds <span role="img" aria-label="diamond">💎</span></span> dengan produk apapun. Mulai tukarkan Diamonds Anda sekarang!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {data?.redemptions.map((item, index) => (
                  <Card 
                    key={item.redemption_id} 
                    className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border-0 shadow-lg rounded-2xl overflow-hidden group"
                  >
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                        <div className="flex items-start gap-4 sm:gap-6 flex-1 w-full">
                          <div className="relative">
                            <div className="p-4 bg-gradient-to-r from-red-500 to-pink-500 dark:from-red-600 dark:to-pink-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                              <Package className="h-8 w-8 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                          </div>
                          <div className="flex-1 space-y-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 flex-wrap">
                              <h3 className="font-bold text-gray-900 dark:text-white text-xl">
                                {item.product?.name}
                              </h3>
                              <Badge 
                                variant="secondary" 
                                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-4 py-1 rounded-full font-medium shadow-md"
                              >
                                ✓ Berhasil
                              </Badge>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                                <Calendar className="h-4 w-4 text-red-500" />
                                <span className="font-medium">
                                  {new Date(item.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                                <span className="text-lg" role="img" aria-label="diamond">💎</span>
                                <span className="font-medium">{item.points_used} Diamonds</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 p-4 rounded-xl min-w-[120px]">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Harga Tukar</p>
                          <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent flex items-center gap-1 justify-end">
                            {item.product?.price} <span className="text-lg" role="img" aria-label="diamond">Diamonds</span>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Enhanced Pagination info */}
            {data && data.meta && data.meta.totalPages > 1 && (
              <Card className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border-0 shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">
                        Halaman {data.meta.page} dari {data.meta.totalPages}
                      </p>
                    </div>
                    <div className="hidden sm:block w-px h-4 bg-gray-400 dark:bg-gray-500"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {data.meta.total} total item
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </>
  );
}