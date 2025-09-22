"use client";

import React, { useState } from "react";
import {
  useProducts,
  useRedeemProduct,
} from "@/hooks/use-product-gamification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GiftIcon, CheckCircle, Loader2 } from "lucide-react";
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
import { toast } from "sonner";
import Header from "@/components/layout/Header";

export default function ProductPage() {
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { data, isLoading, isError } = useProducts({ page, limit: 10 });
  const redeemMutation = useRedeemProduct();

  const products = data?.products || [];
  const meta = data?.meta || { page: 1, totalPages: 1 };

  React.useEffect(() => {
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
        { style: { background: "#ffeaea", color: "#c00" } }
      );
      setSelectedProduct(null);
    }
  }, [redeemMutation.isSuccess, redeemMutation.isError]);

  return (
    <>
      <Header />
      <div className="w-full min-h-screen py-20 px-4 bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-red-700 dark:text-red-400 mb-2">
              Tukar Produk Hadiah
            </h1>
            <p className="text-muted-foreground">
              Tukarkan Diamonds dengan hadiah menarik di bawah ini.
            </p>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card
                  key={i}
                  className="border border-gray-100 dark:border-gray-900 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 animate-pulse"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-40 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-10 w-full rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-red-600 dark:text-red-400">
              Gagal memuat produk.
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Tidak ada produk tersedia.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {products.map((product) => (
                <Card
                  key={product.product_id}
                  className="border border-gray-100 dark:border-gray-900 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <GiftIcon className="h-5 w-5 text-red-600" />
                      <CardTitle className="text-lg font-bold">
                        {product.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="relative h-40 rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={product.image_url || "/placeholder-image.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.jpg";
                        }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-red-700 dark:text-red-400">
                        💎 {product.price.toLocaleString()}
                      </span>
                      <span className="text-xs px-2 py-2 rounded bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                        Stok: {product.stock}
                      </span>
                    </div>
                    <AlertDialog
                      open={selectedProduct === product.product_id}
                      onOpenChange={(open) => !open && setSelectedProduct(null)}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                          size="lg"
                          disabled={
                            (redeemMutation.isPending &&
                              selectedProduct === product.product_id) ||
                            !product.is_active ||
                            product.stock < 1
                          }
                          onClick={() => setSelectedProduct(product.product_id)}
                        >
                          <span className="flex items-center justify-center gap-2">
                            {redeemMutation.isPending &&
                            selectedProduct === product.product_id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                            Tukar Produk
                          </span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Apakah Anda yakin ingin menukar produk{" "}
                            <span className="font-bold">{product.name}</span>?
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-red-600 hover:bg-red-700 text-white">
                            Batal
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={redeemMutation.isPending}
                            onClick={() =>
                              redeemMutation.mutate(product.product_id)
                            }
                          >
                            Ya, Tukar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Sebelumnya
            </Button>
            <span className="text-sm text-muted-foreground">
              Halaman {meta.page} dari {meta.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
