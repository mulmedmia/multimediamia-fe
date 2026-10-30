"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { getSafeImageUrl } from "@/lib/image-loader";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useProducts,
  useRedeemProduct,
} from "@/hooks/use-product-gamification";
import { useMyRedemptions } from "@/hooks/user-use-gamifikasi";
import { useMyRegistrations } from "@/hooks/user-use-registration";
import { Button } from "@/components/ui/button";
import {
  Gift,
  CheckCircle2,
  Loader2,
  ShoppingBag,
  Clock,
  AlertCircle,
  Infinity as InfinityIcon,
  Plus,
  Minus,
  Zap,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { useUserProfile } from "@/hooks/user-use-profile";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useAuthContext } from "@/providers/AuthProvider";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

// Fallback sample data for previewing UI when backend is offline
const SAMPLE_PRODUCTS_FALLBACK = [
  {
    product_id: "1",
    name: "T-Shirt Eksklusif MIA 2026",
    description:
      "Kaos official edisi terbatas Multimedia in Action 2026 berbahan katun combed premium berkualitas tinggi.",
    price: 150,
    stock: 24,
    is_active: true,
    image_url: null,
  },
  {
    product_id: "2",
    name: "Notebook & Pen Set MIA",
    description:
      "Set buku catatan hardcover dan pena gel dengan logo laser-cut MIA 2026 untuk mencatat ide kreatifmu.",
    price: 100,
    stock: 12,
    is_active: true,
    image_url: null,
  },
  {
    product_id: "3",
    name: "Gantungan Kunci Akrilik MIA",
    description:
      "Gantungan kunci bahan akrilik premium cetak dua sisi dengan desain maskot official MIA 2026.",
    price: 50,
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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [redeemQuantity, setRedeemQuantity] = useState(1);

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
    activeCategory?.diamond ?? profile?.points ?? user?.points ?? 0
  );
  const userXp = Number(activeCategory?.xp ?? 0);

  const { data: redemptionsData } = useMyRedemptions({
    category_id: selectedCategoryId || undefined,
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

  useEffect(() => {
    if (redeemMutation.isSuccess) {
      const earnedXp = redeemMutation.data?.earned_xp;
      toast.success(
        earnedXp > 0
          ? `Produk berhasil ditukar! Selamat, Anda mendapatkan +${earnedXp.toLocaleString()} XP! ⚡`
          : "Produk berhasil ditukar!",
        {
          style: { background: "#e6ffed", color: "#1a7f37" },
        }
      );
      setSelectedProduct(null);
      setRedeemQuantity(1);
    }
    if (redeemMutation.isError) {
      toast.error(
        redeemMutation.error?.response?.data?.message ||
          "Gagal menukar produk!",
        { style: { background: "#ffeaea", color: "#c00" } },
      );
      setSelectedProduct(null);
      setRedeemQuantity(1);
    }
  }, [redeemMutation.isSuccess, redeemMutation.isError, redeemMutation.data]);

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
                <Gift className="h-3.5 w-3.5 text-amber-400" />
                <span>Katalog Hadiah</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FFF9F5]">
                Tukar <span className="text-[#E01C20]">Hadiah</span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-[#AAB1BD] leading-relaxed">
                Tukarkan Diamonds <span className="inline-block">💎</span> yang telah Anda kumpulkan dengan berbagai hadiah eksklusif MIA 2026.
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
                      <span className="text-[#FFF9F5] font-bold">{activeCategory.team_name || "-"}</span>
                      <span className="text-white/20">|</span>
                      <span className="text-[#FED700] font-bold flex items-center gap-1">
                        <span>💎</span>
                        {userDiamonds.toLocaleString()}
                      </span>
                      <span className="text-white/20">|</span>
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Zap className="h-3.5 w-3.5 fill-amber-400" />
                        {userXp.toLocaleString()} XP
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
                {products.map((product) => {
                  const isSingle = Boolean(product.is_single_redeem);
                  const isUnlimited = Boolean(product.is_unlimited_stock);
                  const hasXpReward = Number(product.reward_xp) > 0;
                  const alreadyClaimed =
                    isSingle &&
                    myRedemptions.some((r) => r.product_id === product.product_id);
                  const isOutOfStock = !isUnlimited && Number(product.stock) < 1;
                  const canRedeem = product.is_active && !isOutOfStock && !alreadyClaimed;

                  const currentQty = isSingle ? 1 : Math.max(1, redeemQuantity);
                  const totalCost = Number(product.price) * currentQty;
                  const earnedXp = hasXpReward ? Number(product.reward_xp) * currentQty : 0;
                  const remainingDiamonds = userDiamonds - totalCost;

                  const notClaimable = !canRedeem ||
                                      !activeCategory ||
                                      (redeemMutation.isPending &&
                                        selectedProduct === product.product_id)

                  return (
                    <div
                      key={product.product_id}
                      className="mia-card overflow-hidden hover:border-[#E01C20]/50 hover:shadow-[0_0_25px_rgba(224,28,32,0.12)] transition-all duration-300 relative flex flex-col group"
                    >
                      {/* Image Section */}
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-red-950/20 via-black to-red-900/10">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent z-10"></div>
                        <Image
                          src={getSafeImageUrl(product.image_url) || "/placeholder-image.png"}
                          alt={product.name}
                          fill={true}
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 flex-wrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#141824]/90 text-[#FFF9F5] border border-white/10 backdrop-blur-md">
                            <Gift className="h-3.5 w-3.5 text-[#E01C20]" />
                            {hasXpReward ? "Konversi EXP" : "Produk"}
                          </span>
                          {!product.category_id && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                              🌐 Semua Kategori
                            </span>
                          )}
                          {isSingle && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                              1x Redeem
                            </span>
                          )}
                          {hasXpReward && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                              <Zap className="h-3 w-3 text-emerald-400" />
                              +{product.reward_xp} XP / item
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-5 flex flex-col flex-1 space-y-4">
                        <div className="space-y-1">
                          <h3 className="text-base sm:text-lg font-bold text-[#FFF9F5] group-hover:text-[#E01C20] transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#AAB1BD] line-clamp-2 leading-relaxed  ">
                            {product.description ||
                              "Tidak ada deskripsi tersedia untuk produk hadiah ini."}
                          </p>
                        </div>

                        {/* Price & Stock info */}
                        <div className="flex items-center justify-between text-sm mt-auto pt-3 border-t border-white/10">
                          <div className="flex items-center gap-1.5">
                            <span className="text-base font-bold text-[#FED700] flex items-center gap-1">
                              <span className="text-sm">💎</span>
                              {product.price.toLocaleString()}
                            </span>
                            <span className="text-xs text-[#AAB1BD]">
                              Diamonds
                            </span>
                          </div>

                          {isUnlimited ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/15 text-purple-400 border border-purple-500/30">
                              <InfinityIcon className="h-3 w-3" />
                              <span>Stok: <span className="font-semibold">∞</span></span>
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                product.stock > 5
                                  ? "bg-[#00B445]/15 text-[#00B445] border border-[#00B445]/30"
                                  : product.stock > 0
                                  ? "bg-[#E01C20]/15 text-[#E01C20] border border-[#E01C20]/30"
                                  : "bg-zinc-500/15 text-zinc-400 border border-zinc-500/30"
                              }`}
                            >
                              {product.stock > 0 ? `Stok: ${product.stock}` : "Stok Habis"}
                            </span>
                          )}
                        </div>

                        {/* AlertDialog & Redeem Action */}
                        <AlertDialog
                          open={selectedProduct === product.product_id}
                          onOpenChange={(open) => {
                            if (!open) {
                              setSelectedProduct(null);
                              setRedeemQuantity(1);
                            }
                          }}
                        >
                          <AlertDialogTrigger asChild>
                            <button
                              className={cn(
                                "w-full mt-2 mia-btn-primary h-10 text-xs text-white font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                                notClaimable && "bg-emerald-600/20! text-emerald-300! border border-emerald-500/30 hover:shadow-none! hover:transform-none! cursor-default! opacity-100!"
                              )}
                              disabled={notClaimable}
                              onClick={() => {
                                setSelectedProduct(product.product_id);
                                setRedeemQuantity(1);
                              }}
                            >
                              {redeemMutation.isPending &&
                              selectedProduct === product.product_id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4  " />
                              )}
                              <span>
                                {!activeCategory
                                  ? "Daftar Lomba Dulu"
                                  : alreadyClaimed
                                  ? "Sudah Ditukar (1x)"
                                  : isOutOfStock
                                  ? "Stok Habis"
                                  : hasXpReward
                                  ? "Tukar ke XP"
                                  : "Tukar Produk"}
                              </span>
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-2xl border border-white/10 bg-[#0A0D14] text-[#FFF9F5] p-6 shadow-2xl max-w-md">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-lg font-bold text-[#FFF9F5]">
                                {hasXpReward ? "Konfirmasi Penukaran Diamond ke XP" : "Konfirmasi Penukaran Hadiah"}
                              </AlertDialogTitle>
                              <p className="text-sm text-[#AAB1BD] mt-2 leading-relaxed">
                                Apakah Anda yakin ingin menukar{" "}
                                <span className="font-bold text-[#FFF9F5]">
                                  {product.name}
                                </span>
                                ?
                              </p>
                            </AlertDialogHeader>

                            {/* Info khusus single redeem */}
                            {isSingle ? (
                              <div className="my-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
                                <span>
                                  Produk ini hanya dapat ditukarkan 1 kali per peserta (kuantitas terkunci 1 item).
                                </span>
                              </div>
                            ) : (
                              /* Quantity counter jika bukan single redeem */
                              <div className="my-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-semibold text-[#FFF9F5]">
                                    Jumlah Penukaran
                                  </p>
                                  <p className="text-[11px] text-[#AAB1BD]">
                                    {isUnlimited
                                      ? "Stok tidak terbatas"
                                      : `Tersedia: ${product.stock} item`}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    disabled={redeemQuantity <= 1}
                                    onClick={() =>
                                      setRedeemQuantity((q) => Math.max(1, q - 1))
                                    }
                                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[#FFF9F5] transition-colors cursor-pointer"
                                  >
                                    <Minus className="h-3.5 w-3.5" />
                                  </button>
                                  <input
                                    type="number"
                                    min="1"
                                    max={isUnlimited ? 999 : product.stock}
                                    value={redeemQuantity}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value, 10);
                                      if (isNaN(val) || val < 1) {
                                        setRedeemQuantity(1);
                                      } else {
                                        const maxVal = isUnlimited
                                          ? 999
                                          : product.stock;
                                        setRedeemQuantity(
                                          Math.min(maxVal, Math.max(1, val))
                                        );
                                      }
                                    }}
                                    className="w-14 h-8 rounded-lg bg-black/50 border border-white/20 text-center text-xs font-bold text-[#FFF9F5] focus:outline-none focus:border-[#E01C20]"
                                  />
                                  <button
                                    type="button"
                                    disabled={
                                      !isUnlimited &&
                                      redeemQuantity >= product.stock
                                    }
                                    onClick={() => {
                                      const maxVal = isUnlimited
                                        ? 999
                                        : product.stock;
                                      setRedeemQuantity((q) =>
                                        Math.min(maxVal, q + 1)
                                      );
                                    }}
                                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[#FFF9F5] transition-colors cursor-pointer"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Highlight Perolehan XP jika produk memiliki reward_xp */}
                            {hasXpReward && (
                              <div className="my-3 p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-emerald-900/20 border border-emerald-500/30 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                    <Zap className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <p className="text-[11px] text-[#AAB1BD]">Reward EXP Diperoleh</p>
                                    <p className="text-sm font-bold text-emerald-400">
                                      +{earnedXp.toLocaleString()} XP
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-[10px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded font-medium border border-emerald-500/20">
                                    1 item = +{product.reward_xp} XP
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Informasi Stok Diamond & Biaya */}
                            <div className="my-3 p-4 rounded-xl bg-white/[0.04] border border-white/10 space-y-2.5 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-[#AAB1BD]">
                                  Stok Diamond Anda:
                                </span>
                                <span className="font-bold text-[#FED700] flex items-center gap-1 text-sm">
                                  <span>💎</span> {userDiamonds.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[#AAB1BD]">
                                  Total Biaya {currentQty > 1 ? `(${currentQty} item)` : ""}:
                                </span>
                                <span className="font-bold text-[#E01C20] flex items-center gap-1 text-sm">
                                  - <span>💎</span> {totalCost.toLocaleString()}
                                </span>
                              </div>
                              {hasXpReward && (
                                <div className="flex items-center justify-between text-emerald-400">
                                  <span className="text-[#AAB1BD]">
                                    Total XP Didapatkan:
                                  </span>
                                  <span className="font-bold flex items-center gap-1 text-sm">
                                    <Zap className="h-3.5 w-3.5" /> +{earnedXp.toLocaleString()} XP
                                  </span>
                                </div>
                              )}
                              <div className="pt-2.5 border-t border-white/10 flex items-center justify-between">
                                <span className="font-medium text-[#FFF9F5]">
                                  Sisa Diamond:
                                </span>
                                <span
                                  className={`font-bold flex items-center gap-1 text-sm ${
                                    remainingDiamonds >= 0
                                      ? "text-[#00B445]"
                                      : "text-[#E01C20]"
                                  }`}
                                >
                                  <span>💎</span>{" "}
                                  {remainingDiamonds.toLocaleString()}
                                </span>
                              </div>
                            </div>

                            {userDiamonds < totalCost && (
                              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                                <span>
                                  Stok Diamond Anda tidak mencukupi untuk menukar{" "}
                                  {currentQty > 1 ? `${currentQty} item ` : ""}
                                  produk ini.
                                </span>
                              </div>
                            )}

                            <AlertDialogFooter className="gap-2">
                              <AlertDialogCancel className="rounded-full border border-white/15 bg-transparent hover:bg-white/5 text-[#FFF9F5] text-xs font-semibold h-10 cursor-pointer">
                                Batal
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="mia-btn-primary text-xs font-semibold h-10 px-5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={
                                  redeemMutation.isPending ||
                                  userDiamonds < totalCost ||
                                  !activeCategory
                                }
                                onClick={() =>
                                  redeemMutation.mutate({
                                    productId: product.product_id,
                                    quantity: currentQty,
                                    categoryId: selectedCategoryId || activeCategory?.category_id,
                                    registrationId: activeCategory?.registration_id,
                                  })
                                }
                              >
                                {redeemMutation.isPending &&
                                selectedProduct === product.product_id ? (
                                  <Loader2 className="h-4 w-4 animate-spin text-white mr-1.5" />
                                ) : null}
                                <span>{hasXpReward ? "Ya, Konversi ke XP" : "Ya, Tukar Hadiah"}</span>
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  );
                })}
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
