"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useProducts,
  useRedeemProduct,
} from "@/hooks/use-product-gamification";
import { useMyRedemptions } from "@/hooks/user-use-gamifikasi";
import { useMyRegistrations } from "@/hooks/user-use-registration";
import { Button } from "@/components/ui/button";
import {
  Gift,
  ShoppingBag,
  Zap,
  Gem,
  Clock,
  Trophy,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useUserProfile } from "@/hooks/user-use-profile";
import { useAuthContext } from "@/providers/AuthProvider";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import Footer from "@/components/layout/Footer";
import ProductCard from "./ProductCard";

// Fallback sample data for previewing UI when backend is offline
const SAMPLE_PRODUCTS_FALLBACK = [
  {
    product_id: "1",
    name: "T-Shirt Eksklusif MIA 2026",
    description:
      "Kaos official edisi terbatas Multimedia in Action 2026 berbahan katun combed premium berkualitas tinggi.",
    price_diamond: 150,
    stock: 24,
    is_active: true,
    image_url: null,
  },
  {
    product_id: "2",
    name: "Notebook & Pen Set MIA",
    description:
      "Set buku catatan hardcover dan pena gel dengan logo laser-cut MIA 2026 untuk mencatat ide kreatifmu.",
    price_diamond: 100,
    stock: 12,
    is_active: true,
    image_url: null,
  },
  {
    product_id: "3",
    name: "Gantungan Kunci Akrilik MIA",
    description:
      "Gantungan kunci bahan akrilik premium cetak dua sisi dengan desain maskot official MIA 2026.",
    price_diamond: 50,
    stock: 45,
    is_active: true,
    image_url: null,
  },
];

export default function ProductPage() {
  const { user, loading: authLoading } = useAuthContext();
  const { data: profile } = useUserProfile();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [outOfStockProductIds, setOutOfStockProductIds] = useState(() => new Set());

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

  const userDiamonds = Number(
    activeCategory?.diamond ?? 0
  );
  const userXp = Number(activeCategory?.xp ?? 0);

  const { data: redemptionsData } = useMyRedemptions({
    category_id: selectedCategoryId || undefined,
    registration_id: activeCategory?.registration_id || undefined,
    limit: 50,
  });
  const myRedemptions = Array.isArray(redemptionsData?.redemptions)
    ? redemptionsData.redemptions
    : [];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const {
    data: apiData,
    isLoading,
    isError,
  } = useProducts({
    page,
    limit: 10,
    category_id: selectedCategoryId || undefined,
  });
  const redeemMutation = useRedeemProduct();

  // Switch to fallback products if API fails so user can preview the UI redesign
  const data =
    apiData ||
    (isError
      ? { products: SAMPLE_PRODUCTS_FALLBACK, meta: { page: 1, totalPages: 1 } }
      : null);
  const products = data?.products || [];
  const meta = data?.meta || { page: 1, totalPages: 1 };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen w-full bg-[#0A0D14] flex items-center justify-center text-[#FFF9F5]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#E01C20] border-t-transparent mx-auto"></div>
          <p className="text-sm text-[#AAB1BD]">Memverifikasi sesi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0D14] mia-connected-bg text-[#FFF9F5] flex flex-col justify-between selection:bg-[#E01C20] selection:text-white">
      <div>
        <DashboardHeader />

        <main className="pt-24 sm:pt-28 pb-16 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-8 md:space-y-10">
            {/* Eyebrow & Page Header */}
            <div className="text-center space-y-3 md:space-y-4 max-w-3xl mx-auto">
              <div className="mia-pill-badge mx-auto">
                <Gift className="h-3.5 w-3.5 text-[#FED700]" />
                <span>Katalog Hadiah</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FFF9F5]">
                Tukar <span className="text-[#E01C20]">Hadiah</span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-[#AAB1BD] leading-relaxed">
                Tukarkan XP dan Diamonds <span className="inline-block">💎</span> yang telah tim Anda kumpulkan dengan berbagai hadiah eksklusif MIA 2026.
              </p>
            </div>

            {/* Top Summary / Action Card */}
            <div className="mia-card p-6 md:p-8 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-14 h-14 bg-[#E01C20]/15 border border-[#E01C20]/30 rounded-2xl flex items-center justify-center text-[#E01C20] flex-shrink-0 shadow-[0_0_15px_rgba(224,28,32,0.15)]">
                    <Gift className="h-7 w-7 text-[#E01C20]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#AAB1BD] font-semibold mb-0.5">
                      Katalog Hadiah Resmi
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-[#FFF9F5]">
                      {products.length}{" "}
                      <span className="text-sm sm:text-base font-normal text-[#AAB1BD]">
                        Item Tersedia
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-stretch sm:justify-end">
                  {activeCategory ? (
                    <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold self-stretch sm:self-auto justify-center">
                      <span className="text-[#AAB1BD]">Tim:</span>
                      <span className="text-[#FFF9F5] font-bold">
                        {activeCategory.team_name || "-"}
                      </span>
                      <span className="text-border/40 select-none">|</span>
                      <span className="text-amber-400 flex items-center gap-1.5 font-bold">
                        <Zap className="h-3.5 w-3.5 fill-amber-400" />
                        {userXp.toLocaleString()} XP
                      </span>
                      <span className="text-border/40 select-none">|</span>
                      <span className="text-cyan-400 flex items-center gap-1.5 font-bold">
                        <Gem className="h-3 w-3 fill-cyan-400" />
                        {userDiamonds.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold self-stretch sm:self-auto justify-center text-[#AAB1BD]">
                      <span>Belum terdaftar tim lomba</span>
                    </div>
                  )}

                  <Link
                    href="/history-pesanan"
                    className="mia-btn-secondary px-5 py-2.5 text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer transition-all self-stretch sm:self-auto justify-center group"
                  >
                    <Clock className="h-4 w-4 text-[#E01C20] group-hover:scale-110 transition-transform" />
                    <span>Riwayat Pesanan</span>
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
                    Saldo Diamonds dan XP terhubung ke masing-masing tim kompetisi (WIA, UIA, dll). Silakan daftar kompetisi terlebih dahulu untuk mendapatkan diamonds dan menukar produk hadiah!
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
                          onClick={() => {
                            setSelectedCategoryId(cat.category_id);
                            setPage(1);
                          }}
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

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="mia-card overflow-hidden animate-pulse flex flex-col"
                  >
                    <div className="h-48 w-full bg-[#1E2939]"></div>
                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="h-5 w-3/4 bg-[#1E2939] rounded-md"></div>
                        <div className="h-3 w-full bg-[#1E2939] rounded"></div>
                        <div className="h-3 w-2/3 bg-[#1E2939] rounded"></div>
                      </div>
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <div className="h-4 w-20 bg-[#1E2939] rounded"></div>
                        <div className="h-4 w-14 bg-[#1E2939] rounded-full"></div>
                      </div>
                      <div className="h-10 w-full bg-[#1E2939] rounded-full mt-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && products.length === 0 && (
              <div className="mia-card p-8 md:p-14 text-center space-y-6 w-full">
                <div className="w-16 h-16 bg-[#E01C20]/15 border border-[#E01C20]/30 text-[#E01C20] rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-[0_0_20px_rgba(224,28,32,0.2)]">
                  <ShoppingBag className="h-8 w-8 text-[#E01C20]" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#FFF9F5]">
                    Belum Ada Produk Hadiah
                  </h3>
                  <p className="text-sm text-[#AAB1BD] leading-relaxed">
                    Saat ini belum ada produk hadiah yang tersedia untuk ditukarkan. Silakan cek kembali beberapa saat lagi atau hubungi panitia.
                  </p>
                </div>
              </div>
            )}

            {/* Product Grid */}
            {!isLoading && products.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.product_id}
                    product={product}
                    activeCategory={activeCategory}
                    selectedCategoryId={selectedCategoryId}
                    myRedemptions={myRedemptions}
                    isOutOfStockLocal={outOfStockProductIds.has(product.product_id)}
                    onOutOfStock={(productId) =>
                      setOutOfStockProductIds((prev) => new Set(prev).add(productId))
                    }
                    redeemMutation={redeemMutation}
                  />
                ))}
              </div>
            )}

            {/* Pagination Section */}
            {!isLoading && products.length > 0 && meta.totalPages > 1 && (
              <div className="mia-card p-3 sm:p-4 flex items-center justify-between gap-4 max-w-md mx-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full cursor-pointer hover:bg-white/10 text-xs px-4 text-[#FFF9F5]"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Sebelumnya
                </Button>
                <span className="text-xs text-[#AAB1BD] font-medium">
                  Halaman <strong className="text-[#FFF9F5]">{meta.page}</strong> dari{" "}
                  <strong className="text-[#FFF9F5]">{meta.totalPages}</strong>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full cursor-pointer hover:bg-white/10 text-xs px-4 text-[#FFF9F5]"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                >
                  Berikutnya
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
