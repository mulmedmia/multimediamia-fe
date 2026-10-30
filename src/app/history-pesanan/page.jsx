"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";
import { useMyRedemptions } from "@/hooks/user-use-gamifikasi";
import { useMyRegistrations } from "@/hooks/user-use-registration";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import Footer from "@/components/layout/Footer";
import {
  AlertCircle,
  Package,
  Calendar,
  Trophy,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  RefreshCw,
  Zap,
  Gem,
} from "lucide-react";

export default function HistoryPesananPage() {
  const { user, loading: authLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const userId = user?.users_id || user?.userId;
  const { data: myRegistrations, isLoading: registrationsLoading } =
    useMyRegistrations(userId);

  const participatingCategories = useMemo(() => {
    if (!myRegistrations || !Array.isArray(myRegistrations)) return [];
    const map = new Map();
    myRegistrations.forEach((reg) => {
      const catId = reg.category_id || reg.category?.category_id;
      if (catId && !map.has(catId)) {
        map.set(catId, {
          category_id: catId,
          name: reg.category?.name || reg.category?.category_name || "Kompetisi",
          slug: reg.category?.slug,
          team_name: reg.team_name,
          diamond: Number(reg.diamond ?? 0),
          xp: Number(reg.xp ?? 0),
          registration_id: reg.registration_id,
        });
      }
    });
    return Array.from(map.values());
  }, [myRegistrations]);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  useEffect(() => {
    if (participatingCategories.length > 0) {
      if (
        !selectedCategoryId ||
        !participatingCategories.some((c) => c.category_id === selectedCategoryId)
      ) {
        setSelectedCategoryId(participatingCategories[0].category_id);
      }
    }
  }, [participatingCategories, selectedCategoryId]);

  const activeCategory = useMemo(() => {
    return (
      participatingCategories.find((c) => c.category_id === selectedCategoryId) ||
      participatingCategories[0] ||
      null
    );
  }, [participatingCategories, selectedCategoryId]);

  const { data, isLoading, isError, refetch } = useMyRedemptions({
    category_id: selectedCategoryId || undefined,
    registration_id: activeCategory?.registration_id || undefined,
    limit: 50,
  });

  return (
    <div className="min-h-screen bg-[#0A0D14] mia-connected-bg text-[#FFF9F5] flex flex-col justify-between selection:bg-[#E01C20] selection:text-white">
      <div>
        <DashboardHeader />

        <main className="pt-24 sm:pt-28 pb-16 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-8 md:space-y-10">
            
            {/* Eyebrow & Page Header */}
            <div className="text-center space-y-3 md:space-y-4 max-w-3xl mx-auto">
              <div className="mia-pill-badge mx-auto">
                <Trophy className="h-3.5 w-3.5 text-[#FED700]" />
                <span>Riwayat Penukaran Hadiah</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FFF9F5]">
                History <span className="text-[#E01C20]">Penukaran</span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-[#AAB1BD] leading-relaxed">
                Pantau seluruh riwayat penukaran XP dan Diamonds <span className="inline-block">💎</span> Anda dengan berbagai produk dan hadiah eksklusif MIA 2026.
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-6">
                {/* Stats Skeleton */}
                <div className="mia-card p-6 md:p-8 animate-pulse flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-14 h-14 bg-[#1E2939] rounded-2xl"></div>
                    <div className="space-y-2">
                      <div className="h-3 w-32 bg-[#1E2939] rounded"></div>
                      <div className="h-6 w-20 bg-[#1E2939] rounded"></div>
                    </div>
                  </div>
                  <div className="h-10 w-44 bg-[#1E2939] rounded-full self-stretch sm:self-auto"></div>
                </div>

                {/* List Skeleton */}
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="mia-card p-5 sm:p-6 animate-pulse flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-[#1E2939] flex-shrink-0"></div>
                        <div className="space-y-2.5 flex-1">
                          <div className="h-4 w-48 bg-[#1E2939] rounded"></div>
                          <div className="flex gap-2">
                            <div className="h-6 w-28 bg-[#1E2939] rounded-md"></div>
                            <div className="h-6 w-36 bg-[#1E2939] rounded-md"></div>
                          </div>
                        </div>
                      </div>
                      <div className="h-10 w-28 bg-[#1E2939] rounded-xl self-stretch sm:self-auto"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error State */}
            {!isLoading && isError && (
              <div className="mia-card border-[#E01C20]/40 p-8 md:p-12 text-center space-y-6 max-w-xl mx-auto">
                <div className="w-16 h-16 bg-[#E01C20]/15 border border-[#E01C20]/30 text-[#E01C20] rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(224,28,32,0.2)]">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#FFF9F5]">
                    Terjadi Kesalahan
                  </h2>
                  <p className="text-sm text-[#AAB1BD] max-w-md mx-auto">
                    Gagal memuat data riwayat penukaran hadiah. Silakan periksa koneksi internet Anda dan coba beberapa saat lagi.
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => refetch()}
                    className="mia-btn-secondary px-5 py-2.5 text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Coba Lagi</span>
                  </button>
                  <Link
                    href="/product"
                    className="mia-btn-primary px-5 py-2.5 text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Ke Katalog Produk</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Content Loaded */}
            {!isLoading && !isError && data && (
              <>
                {/* Stats Summary Card */}
                <div className="mia-card p-6 md:p-8 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-14 h-14 bg-[#E01C20]/15 border border-[#E01C20]/30 rounded-2xl flex items-center justify-center text-[#E01C20] flex-shrink-0 shadow-[0_0_15px_rgba(224,28,32,0.15)]">
                        <Package className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-[#AAB1BD] font-semibold mb-0.5">
                          Total Penukaran Berhasil
                        </p>
                        <p className="text-2xl sm:text-3xl font-bold text-[#FFF9F5]">
                          {data.meta?.total || data.redemptions?.length || 0}{" "}
                          <span className="text-sm sm:text-base font-normal text-[#AAB1BD]">
                            Item
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-stretch sm:justify-end">
                      {activeCategory && (
                        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold self-stretch sm:self-auto justify-center">
                          <span className="text-[#AAB1BD]">Tim:</span>
                          <span className="text-[#FFF9F5] font-bold">
                            {activeCategory.team_name || "-"}
                          </span>
                          <span className="text-border/40 select-none">|</span>
                          <span className="text-amber-400 flex items-center gap-1.5 font-bold">
                            <Zap className="h-3.5 w-3.5 fill-amber-400" />
                            {activeCategory.xp.toLocaleString()} XP
                          </span>
                          <span className="text-border/40 select-none">|</span>
                          <span className="text-cyan-400 flex items-center gap-1.5 font-bold">
                            <Gem className="h-3 w-3 fill-cyan-400" />
                            {activeCategory.diamond.toLocaleString()}
                          </span>
                        </div>
                      )}

                      <Link
                        href="/product"
                        className="mia-btn-secondary px-5 py-2.5 text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer transition-all self-stretch sm:self-auto justify-center group"
                      >
                        <ShoppingBag className="h-4 w-4 text-[#E01C20] group-hover:scale-110 transition-transform" />
                        <span>Tukar Hadiah</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Competition Category Filter Bar */}
                {registrationsLoading ? (
                  <div className="p-4 rounded-2xl bg-[#141824] border border-white/10 animate-pulse h-14"></div>
                ) : participatingCategories.length === 0 ? (
                  <div className="mia-card p-6 md:p-8 text-center border-amber-500/30 bg-amber-500/5 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div className="max-w-md mx-auto space-y-2">
                      <h3 className="text-lg font-bold text-[#FFF9F5]">
                        Belum Terdaftar di Kompetisi
                      </h3>
                      <p className="text-xs sm:text-sm text-[#AAB1BD] leading-relaxed">
                        Riwayat penukaran hadiah terhubung ke kompetisi yang Anda ikuti. Silakan daftar kompetisi untuk dapat menukarkan hadiah!
                      </p>
                    </div>
                    <Link
                      href="/competition-registration"
                      className="mia-btn-primary px-5 py-2.5 text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
                    >
                      <span>Daftar Kompetisi Sekarang</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 p-3.5 rounded-2xl bg-[#141824] border border-white/10">
                    <span className="text-xs font-semibold text-[#AAB1BD] px-1">
                      {participatingCategories.length > 1
                        ? "Filter Kategori Lomba:"
                        : "Kategori Lomba Anda:"}
                    </span>
                    {participatingCategories.length === 1 ? (
                      <div className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#E01C20] text-white shadow-[0_0_15px_rgba(224,28,32,0.3)] flex items-center gap-2">
                        <Trophy className="h-3.5 w-3.5" />
                        <span>{activeCategory?.name}</span>
                        {activeCategory?.team_name && (
                          <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-normal">
                            Tim: {activeCategory.team_name}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {participatingCategories.map((cat) => {
                          const isSelected = cat.category_id === selectedCategoryId;
                          return (
                            <button
                              key={cat.category_id}
                              type="button"
                              onClick={() => setSelectedCategoryId(cat.category_id)}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                                isSelected
                                  ? "bg-[#E01C20] text-white shadow-[0_0_15px_rgba(224,28,32,0.3)]"
                                  : "text-[#AAB1BD] bg-white/5 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              <Trophy
                                className={`h-3.5 w-3.5 ${
                                  isSelected ? "text-white" : "text-[#AAB1BD]"
                                }`}
                              />
                              <span>{cat.name}</span>
                              {cat.team_name && (
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] ${
                                    isSelected
                                      ? "bg-white/20 text-white"
                                      : "bg-white/5 text-[#AAB1BD]"
                                  }`}
                                >
                                  {cat.team_name}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Empty State */}
                {(!data.redemptions || data.redemptions.length === 0) ? (
                  <div className="mia-card p-8 md:p-14 text-center space-y-6 w-full">
                    <div className="w-16 h-16 bg-[#E01C20]/15 border border-[#E01C20]/30 text-[#E01C20] rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-[0_0_20px_rgba(224,28,32,0.2)]">
                      <Package className="h-8 w-8" />
                    </div>
                    <div className="space-y-2 max-w-md mx-auto">
                      <h3 className="text-xl sm:text-2xl font-bold text-[#FFF9F5]">
                        Belum Ada Riwayat Penukaran
                      </h3>
                      <p className="text-sm text-[#AAB1BD] leading-relaxed">
                        Anda belum melakukan penukaran Diamonds <span className="inline-block">💎</span> dengan hadiah apapun. Kumpulkan Diamonds melalui kompetisi dan tukarkan dengan hadiah favoritmu!
                      </p>
                    </div>
                    <div className="pt-2">
                      <Link
                        href="/product"
                        className="mia-btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2 cursor-pointer group"
                      >
                        <span>Jelajahi Katalog Hadiah</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* Redemptions List */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs sm:text-sm text-[#AAB1BD]">
                      <span className="font-medium">Daftar Transaksi</span>
                      <span className="bg-[#141824] px-3 py-1 rounded-full border border-white/10 text-[#FFF9F5] text-xs">
                        {data.redemptions.length} Penukaran
                      </span>
                    </div>

                    <div className="space-y-3">
                      {data.redemptions.map((item) => (
                        <div
                          key={item.redemption_id}
                          className="mia-card p-5 sm:p-6 hover:border-[#E01C20]/50 hover:shadow-[0_0_25px_rgba(224,28,32,0.12)] transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group"
                        >
                          {/* Left: Product & Transaction Info */}
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-[#141824] border border-white/10 flex items-center justify-center text-[#E01C20] flex-shrink-0 group-hover:border-[#E01C20]/40 group-hover:bg-[#E01C20]/10 transition-all">
                              <Package className="h-6 w-6" />
                            </div>

                            <div className="space-y-2 min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-bold text-base sm:text-lg text-[#FFF9F5] group-hover:text-[#E01C20] transition-colors truncate">
                                  {item.product?.name || "Produk Hadiah"}
                                </h3>
                                <span className="inline-flex items-center gap-1 bg-[#00B445]/15 text-[#00B445] border border-[#00B445]/30 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                                  <CheckCircle2 className="h-3 w-3" />
                                  <span>Berhasil</span>
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#AAB1BD]">
                                <div className="inline-flex items-center gap-1.5 bg-[#141824] border border-white/10 px-2.5 py-1 rounded-md">
                                  <Calendar className="h-3.5 w-3.5 text-[#E01C20]" />
                                  <span>
                                    {item.created_at
                                      ? new Date(item.created_at).toLocaleDateString("id-ID", {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })
                                      : "-"}
                                  </span>
                                </div>

                                <div className="inline-flex items-center gap-1.5 bg-[#141824] border border-white/10 px-2.5 py-1 rounded-md">
                                  <span className="text-[#AAB1BD]">Jumlah:</span>
                                  <span className="font-semibold text-[#FFF9F5]">
                                    {item.quantity || 1} item
                                  </span>
                                </div>

                                <div className="inline-flex items-center gap-1.5 bg-[#141824] border border-white/10 px-2.5 py-1 rounded-md">
                                  <span className="text-xs">💎</span>
                                  <span className="font-semibold text-[#FED700]">
                                    {item.points_used ?? item.product?.price ?? 0}
                                  </span>
                                  <span className="text-[#AAB1BD]">Diamonds Terpakai</span>
                                </div>

                                {Number(item.product?.reward_xp) > 0 && (
                                  <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-md font-medium">
                                    <Zap className="h-3.5 w-3.5" />
                                    <span>
                                      +{(Number(item.product.reward_xp) * (item.quantity || 1)).toLocaleString()} XP
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right: Point Price Box */}
                          <div className="w-full md:w-auto self-stretch md:self-auto bg-[#141824] border border-white/10 rounded-xl p-3 sm:px-5 sm:py-3 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-1 min-w-[140px] group-hover:border-[#E01C20]/20 transition-colors">
                            <span className="text-[11px] uppercase tracking-wider text-[#99A1AF] font-semibold">
                              Nilai Tukar
                            </span>
                            <span className="text-lg sm:text-xl font-bold text-[#FED700] flex items-center gap-1.5">
                              <span className="text-base">💎</span>
                              <span>{item.product?.price || item.points_used || 0}</span>
                              <span className="text-xs font-normal text-[#AAB1BD]">Diamonds</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pagination / Meta info */}
                {data.meta && data.meta.totalPages > 1 && (
                  <div className="mia-card p-4 flex items-center justify-center gap-3 text-xs sm:text-sm text-[#AAB1BD]">
                    <span>
                      Halaman <strong className="text-[#FFF9F5]">{data.meta.page}</strong> dari{" "}
                      <strong className="text-[#FFF9F5]">{data.meta.totalPages}</strong>
                    </span>
                    <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span>
                    <span>Total {data.meta.total} transaksi</span>
                  </div>
                )}
              </>
            )}

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
