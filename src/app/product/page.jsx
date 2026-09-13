"use client";

import React, { useState, useEffect } from "react";
import {
  useProducts,
  useRedeemProduct,
} from "@/hooks/use-product-gamification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GiftIcon,
  CheckCircle,
  Loader2,
  Sparkles,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";

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
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const {
    data: apiData,
    isLoading,
    isError,
  } = useProducts({ page, limit: 10 });
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
      toast.success("Produk berhasil ditukar!", {
        style: { background: "#e6ffed", color: "#1a7f37" },
      });
      setSelectedProduct(null);
    }
    if (redeemMutation.isError) {
      toast.error(
        redeemMutation.error?.response?.data?.message ||
          "Gagal menukar produk!",
        { style: { background: "#ffeaea", color: "#c00" } },
      );
      setSelectedProduct(null);
    }
  }, [redeemMutation.isSuccess, redeemMutation.isError]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#151C28] text-gray-900 dark:text-[#FFF9F5] relative overflow-hidden font-sans">
      {/* Background Radial & Grid Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:hidden"></div>

      <div className="hidden dark:block absolute inset-0 -z-10 h-full w-full bg-[#151C28]">
        {/* Spotlights & Red Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-b from-[#810220]/40 via-[#E01C20]/15 to-transparent blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[550px] h-[350px] bg-gradient-to-t from-[#810220]/25 to-transparent blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </div>

      <Header />

      <main className="flex-grow container mx-auto pt-28 pb-16 px-4 md:px-6 lg:px-8 relative z-10">
        {/* Hero Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-[#E01C20] to-[#FF4500] text-[#FFF9F5] border-0 px-4 py-1.5 text-xs font-semibold shadow-lg inline-flex items-center gap-1.5 rounded-full">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Penukaran Poin & Rewards MIA</span>
          </Badge>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
            Tukar Produk{" "}
            <span className="bg-gradient-to-r from-[#E01C20] via-[#FF4500] to-[#FED700] bg-clip-text text-transparent">
              Hadiah Menarik
            </span>
          </h1>

          <p className="text-sm md:text-base text-gray-600 dark:text-[#AAB1BD] leading-relaxed max-w-2xl mx-auto">
            Tukarkan Diamonds yang telah Anda kumpulkan melalui berbagai
            aktivitas dan pencapaian dengan merchandise official eksklusif dari
            Multimedia in Action 2026.
          </p>

          <div className="w-24 h-1 bg-gradient-to-r from-[#E01C20] to-[#FF4500] mx-auto mt-6 rounded-full"></div>

          {isError && (
            <div className="mt-4 inline-block">
              <Badge className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 text-[11px] px-3 py-1 rounded-full">
                Preview Mode (Offline API)
              </Badge>
            </div>
          )}
        </div>

        {/* Product Cards Area */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card
                key={i}
                className="overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151C28]/60 shadow-sm"
              >
                <CardHeader className="pb-3 pt-5">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-40 w-full rounded-2xl" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <Skeleton className="h-11 w-full rounded-full mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-gray-50/50 dark:bg-[#1E2939]/30 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800 max-w-xl mx-auto">
            <div className="w-16 h-16 bg-[#E01C20]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8 text-[#E01C20]" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-[#FFF9F5]">
              Belum Ada Produk
            </h3>
            <p className="text-sm text-gray-500 dark:text-[#AAB1BD] max-w-md mx-auto">
              Saat ini belum ada merchandise atau hadiah penukaran poin yang
              tersedia. Silakan hubungi panitia.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card
                key={product.product_id}
                className="group overflow-hidden hover:shadow-[0_10px_30px_rgba(224,28,32,0.12)] transition-all duration-300 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151C28]/80 hover:border-[#E01C20]/50 dark:hover:border-[#E01C20]/60 hover:-translate-y-1 relative flex flex-col rounded-2xl"
              >
                {/* Image Section */}
                <div className="relative h-44 overflow-hidden bg-gradient-to-br from-red-950/20 via-black to-red-900/10">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10"></div>
                  <Image
                    src={product.image_url || "/placeholder-image.png"}
                    alt={product.name}
                    fill={true}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 z-20">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-black/75 text-[#FFF9F5] border border-white/10 backdrop-blur-md">
                      <GiftIcon className="h-3.5 w-3.5 mr-1.5 text-[#E01C20]" />
                      Merchandise
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-1 space-y-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-[#FFF9F5] line-clamp-1 group-hover:text-[#E01C20] transition-colors duration-300">
                      {product.name}
                    </CardTitle>
                    <p className="text-xs text-gray-600 dark:text-[#AAB1BD] line-clamp-2 leading-relaxed h-8">
                      {product.description ||
                        "Tidak ada deskripsi tersedia untuk produk hadiah ini."}
                    </p>
                  </div>

                  {/* Price & Stock info */}
                  <div className="flex items-center justify-between text-sm mt-auto pt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-bold text-[#E01C20] flex items-center">
                        <span className="mr-1 text-sm">💎</span>
                        {product.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-[#99A1AF]">
                        Diamonds
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 5
                          ? "bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300"
                      }`}
                    >
                      Stok: {product.stock}
                    </span>
                  </div>

                  {/* AlertDialog & Redeem Action */}
                  <AlertDialog
                    open={selectedProduct === product.product_id}
                    onOpenChange={(open) => !open && setSelectedProduct(null)}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        className="w-full mt-2 bg-[#E01C20] hover:bg-[#9D1416] text-[#FFF9F5] rounded-full font-semibold text-xs h-10 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        disabled={
                          (redeemMutation.isPending &&
                            selectedProduct === product.product_id) ||
                          !product.is_active ||
                          product.stock < 1
                        }
                        onClick={() => setSelectedProduct(product.product_id)}
                      >
                        {redeemMutation.isPending &&
                        selectedProduct === product.product_id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-[#FED700]" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-[#FED700]" />
                        )}
                        <span>Tukar Produk</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151C28]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-bold text-gray-900 dark:text-[#FFF9F5]">
                          Konfirmasi Penukaran Hadiah
                        </AlertDialogTitle>
                        <p className="text-sm text-gray-600 dark:text-[#AAB1BD] mt-2">
                          Apakah Anda yakin ingin menukar{" "}
                          <span className="font-bold text-[#E01C20]">
                            {product.name}
                          </span>{" "}
                          seharga{" "}
                          <span className="font-bold text-gray-900 dark:text-white">
                            💎 {product.price.toLocaleString()} Diamonds
                          </span>
                          ?
                        </p>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-4 gap-2">
                        <AlertDialogCancel className="rounded-full border border-gray-200 dark:border-gray-800 text-xs font-semibold h-10 cursor-pointer">
                          Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="rounded-full bg-[#E01C20] hover:bg-[#9D1416] text-[#FFF9F5] text-xs font-semibold h-10 cursor-pointer"
                          disabled={redeemMutation.isPending}
                          onClick={() =>
                            redeemMutation.mutate(product.product_id)
                          }
                        >
                          Ya, Tukar Hadiah
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination Section */}
        {!isLoading && products.length > 0 && meta.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12 bg-gray-50/50 dark:bg-[#1E2939]/80 p-2 rounded-full border border-gray-200 dark:border-gray-800 max-w-sm mx-auto shadow-sm backdrop-blur-md">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 text-xs px-4"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Sebelumnya
            </Button>
            <span className="text-xs text-gray-500 dark:text-[#99A1AF] font-medium">
              Halaman {meta.page} dari {meta.totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 text-xs px-4"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            >
              Berikutnya
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
