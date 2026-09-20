"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useAdminRedemptions } from "@/hooks/admin-use-reddem";
import { getAllRedemptions } from "@/services/admin-reddem.service";
import { useAdminProducts } from "@/hooks/admin-use.product";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  AlertCircle,
  Layers,
  Users,
  RefreshCw,
  X,
  Clock,
  Gem,
  Package,
  Eye,
  Image as ImageIcon,
} from "lucide-react";

const PAGE_SIZE = 10;

export default function ManageRedemptionPage() {
  // State Filter & Pagination
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [productFilter, setProductFilter] = useState("ALL");

  // Modal State
  const [detailData, setDetailData] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchInput.trim();
      if (trimmed !== searchTerm) {
        setSearchTerm(trimmed);
        setPage(1);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [searchInput, searchTerm]);

  // Query Redemptions
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useAdminRedemptions({
    page,
    limit: PAGE_SIZE,
    search: searchTerm || undefined,
    product_id: productFilter === "ALL" ? undefined : productFilter,
  });

  // Query Products for dropdown filter
  const { data: productsData } = useAdminProducts({ limit: 100 });
  const products = productsData?.products || [];

  // Global Stats Query for top cards
  const { data: allStatsData } = useQuery({
    queryKey: ["admin-reddem-overall-stats"],
    queryFn: () => getAllRedemptions({ page: 1, limit: 1000 }),
    staleTime: 1000 * 60,
  });

  const redemptions = useMemo(() => {
    return Array.isArray(data?.redemptions) ? data.redemptions : [];
  }, [data?.redemptions]);

  const meta = data?.meta || {
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 1,
    total: 0,
  };

  const totalItems = meta.total || 0;
  const totalPages = meta.totalPages || 1;

  // Calculate statistics
  const stats = useMemo(() => {
    const list = allStatsData?.redemptions || redemptions;
    const total = allStatsData?.meta?.total ?? totalItems;
    const totalPointsUsed = list.reduce(
      (acc, r) => acc + (Number(r.points_used) || 0),
      0
    );
    const uniqueProducts = new Set(
      list.map((r) => r.product_id).filter(Boolean)
    ).size;
    const uniqueUsers = new Set(
      list.map((r) => r.user_id).filter(Boolean)
    ).size;
    return { total, totalPointsUsed, uniqueProducts, uniqueUsers };
  }, [allStatsData, redemptions, totalItems]);

  // Format Date Display
  const formatDateDisplay = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB";
    } catch {
      return dateString;
    }
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setProductFilter("ALL");
    setPage(1);
  };

  const hasActiveFilters = searchTerm || productFilter !== "ALL";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Admin Panel</span>
            <span>/</span>
            <span className="text-foreground font-medium">Manage Redeem</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <ShoppingBag className="h-7 w-7 text-[#E01C20]" />
            <span>Riwayat Redeem Merchandise</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Pantau riwayat penukaran merchandise dan penggunaan poin Diamond oleh peserta kompetisi.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
          className="h-10 px-4 rounded-xl border-border/50 bg-input/20 hover:bg-input/40 text-foreground text-xs sm:text-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Penukaran</p>
              <p className="text-xl font-bold text-foreground">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Gem className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Diamond Ditebus</p>
              <p className="text-xl font-bold text-foreground">
                {stats.totalPointsUsed.toLocaleString("id-ID")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Jenis Merchandise</p>
              <p className="text-xl font-bold text-foreground">{stats.uniqueProducts}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Peserta Menukarkan</p>
              <p className="text-xl font-bold text-foreground">{stats.uniqueUsers}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl overflow-hidden shadow-xl">
        <CardHeader className="p-4 sm:p-6 border-b border-border/40">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Box */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari nama peserta atau merchandise..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 pr-8 h-9 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filter Produk */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                Produk:
              </span>
              <Select
                value={productFilter}
                onValueChange={(val) => {
                  setProductFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-44 sm:w-48 bg-input/40 border-border/50 rounded-xl text-xs text-foreground">
                  <SelectValue placeholder="Semua Produk" />
                </SelectTrigger>
                <SelectContent className="bg-[#141824] border-border/50 text-foreground">
                  <SelectItem value="ALL">Semua Produk</SelectItem>
                  {products.map((p) => (
                    <SelectItem key={p.product_id} value={String(p.product_id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-3">
              <span className="text-xs text-muted-foreground">Filter aktif:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Cari: &ldquo;{searchTerm}&rdquo;
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      setSearchTerm("");
                    }}
                    className="hover:text-blue-200 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              )}
              {productFilter !== "ALL" && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Produk:{" "}
                  {products.find((p) => String(p.product_id) === String(productFilter))
                    ?.name || productFilter}
                  <button
                    type="button"
                    onClick={() => setProductFilter("ALL")}
                    className="hover:text-purple-200 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-6 px-2 text-[11px] text-muted-foreground hover:text-white"
              >
                Reset Filter
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full bg-white/5 rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <div className="p-8 text-center space-y-3">
              <AlertCircle className="h-8 w-8 text-[#E01C20] mx-auto" />
              <p className="text-sm text-muted-foreground">
                Gagal memuat data riwayat redeem.
              </p>
              <Button
                size="sm"
                onClick={() => refetch()}
                className="bg-[#E01C20] hover:bg-[#c4181c] text-xs font-semibold rounded-xl"
              >
                Coba Lagi
              </Button>
            </div>
          ) : redemptions.length === 0 ? (
            /* Empty State */
            <div className="py-16 px-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-border/40 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <ShoppingBag className="h-8 w-8 text-[#E01C20]/60" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                {hasActiveFilters
                  ? "Tidak ada penukaran yang cocok"
                  : "Belum ada riwayat penukaran"}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {hasActiveFilters
                  ? "Coba sesuaikan kata kunci pencarian atau ganti filter produk."
                  : "Belum ada peserta yang menukarkan poin Diamond dengan merchandise."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/40 hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 pl-6 bg-white/[0.02]">
                      Peserta
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Produk Merchandise
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Poin Ditebus
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Status
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Waktu Penukaran
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02] whitespace-nowrap">
                      Created By
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02] whitespace-nowrap">
                      Updated By
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 pr-6 text-right bg-[#141824] sticky right-0 z-20 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.5)] border-l border-border/40">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {redemptions.map((r) => (
                    <TableRow
                      key={r.redemption_id}
                      className="group hover:bg-white/[0.02] transition-colors border-b border-border/30"
                    >
                      {/* Profil Peserta */}
                      <TableCell className="py-3.5 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs flex-shrink-0">
                            {r.user?.name ? r.user.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div className="min-w-0 max-w-[180px] sm:max-w-[240px]">
                            <p className="font-semibold text-foreground text-xs sm:text-sm truncate">
                              {r.user?.name || "Tanpa Nama"}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {r.user?.email || "-"}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Produk Merchandise */}
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-3">
                          {r.product?.image_url ? (
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-border/50 bg-black/40 flex-shrink-0">
                              <Image
                                src={r.product.image_url}
                                alt={r.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-xl border border-border/40 bg-white/[0.03] flex items-center justify-center text-muted-foreground flex-shrink-0">
                              <ImageIcon className="h-4 w-4 opacity-40" />
                            </div>
                          )}
                          <div className="min-w-0 max-w-[180px] sm:max-w-[240px]">
                            <p className="font-semibold text-foreground text-xs sm:text-sm truncate">
                              {r.product?.name || "Produk Dihapus"}
                            </p>
                            {r.product?.price && (
                              <p className="text-[11px] text-muted-foreground">
                                Nilai: Rp {Number(r.product.price).toLocaleString("id-ID")}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Poin Ditebus */}
                      <TableCell className="py-3.5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs">
                          <Gem className="h-3.5 w-3.5" />
                          <span>{(r.points_used ?? 0).toLocaleString("id-ID")} Diamond</span>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-3.5">
                        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit font-semibold">
                          <CheckCircle2 className="h-3 w-3" /> Berhasil Ditebus
                        </Badge>
                      </TableCell>

                      {/* Waktu Penukaran */}
                      <TableCell className="py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
                          <span>{formatDateDisplay(r.created_at)}</span>
                        </div>
                      </TableCell>

                      {/* Created By */}
                      <TableCell className="py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        {r.created_by_name || "-"}
                      </TableCell>

                      {/* Updated By */}
                      <TableCell className="py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        {r.updated_by_name || "-"}
                      </TableCell>

                      {/* Aksi */}
                      <TableCell className="py-3.5 pr-6 text-right sticky right-0 bg-[#0F121A] group-hover:bg-[#141824] z-10 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.5)] border-l border-border/40 transition-colors">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDetailData(r)}
                          className="h-8 px-2.5 bg-input/40 hover:bg-white/10 border-border/50 text-foreground text-xs rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Lihat Detail Transaksi"
                        >
                          <Eye className="h-3.5 w-3.5 text-blue-400" />
                          <span className="hidden sm:inline">Detail</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <div>
              Menampilkan{" "}
              <span className="text-foreground font-semibold">
                {(page - 1) * PAGE_SIZE + 1}
              </span>{" "}
              -{" "}
              <span className="text-foreground font-semibold">
                {Math.min(page * PAGE_SIZE, totalItems)}
              </span>{" "}
              dari{" "}
              <span className="text-foreground font-semibold">{totalItems}</span> total
              transaksi {hasActiveFilters && "(hasil filter)"}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="h-8 px-3 rounded-xl border-border/50 bg-input/20 text-foreground disabled:opacity-30 cursor-pointer"
              >
                Sebelumnya
              </Button>
              <div className="text-xs px-2 text-foreground font-medium">
                Halaman {page} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="h-8 px-3 rounded-xl border-border/50 bg-input/20 text-foreground disabled:opacity-30 cursor-pointer"
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Modal Detail Redeem */}
      <Dialog open={!!detailData} onOpenChange={(open) => !open && setDetailData(null)}>
        <DialogContent className="bg-[#0A0D14] border border-border/50 text-[#FFF9F5] max-w-md rounded-2xl p-6 shadow-2xl">
          <DialogHeader className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <DialogTitle className="text-lg font-bold text-center text-foreground">
              Detail Penukaran Merchandise
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground text-center">
              Informasi lengkap transaksi penukaran reward oleh peserta kompetisi.
            </DialogDescription>
          </DialogHeader>

          {/* Transaction Summary Card */}
          <div className="p-3.5 bg-[#0F121A] border border-border/40 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between items-center py-0.5 border-b border-border/20">
              <span className="text-muted-foreground">ID Transaksi:</span>
              <span className="font-mono text-muted-foreground text-[11px] truncate max-w-[180px]">
                {detailData?.redemption_id}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5 border-b border-border/20">
              <span className="text-muted-foreground">Nama Peserta:</span>
              <span className="font-semibold text-foreground truncate max-w-[200px]">
                {detailData?.user?.name || "-"}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5 border-b border-border/20">
              <span className="text-muted-foreground">Email:</span>
              <span className="text-muted-foreground truncate max-w-[200px]">
                {detailData?.user?.email || "-"}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5 border-b border-border/20">
              <span className="text-muted-foreground">Produk:</span>
              <span className="font-semibold text-foreground truncate max-w-[200px]">
                {detailData?.product?.name || "-"}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5 border-b border-border/20">
              <span className="text-muted-foreground">Diamond Digunakan:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <Gem className="h-3.5 w-3.5" />
                {(detailData?.points_used ?? 0).toLocaleString("id-ID")} Diamond
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5 border-b border-border/20">
              <span className="text-muted-foreground">Status Transaksi:</span>
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.2 rounded-full">
                Berhasil Ditebus
              </Badge>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-muted-foreground">Waktu Penukaran:</span>
              <span className="text-muted-foreground">
                {formatDateDisplay(detailData?.created_at)}
              </span>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDetailData(null)}
              className="w-full rounded-xl text-xs text-muted-foreground hover:text-white"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}