"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { getSafeImageUrl } from "@/lib/image-loader";
import { useQuery } from "@tanstack/react-query";
import { useAdminRedemptions } from "@/hooks/admin-use-redeem";
import { getAllRedemptions } from "@/services/admin-redeem.service";
import { useAdminProducts } from "@/hooks/admin-use.product";
import { useAdminCategories } from "@/hooks/admin-use-categories";
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
  FileSpreadsheet,
  Phone,
  ExternalLink,
} from "lucide-react";
import { exportToExcel } from "@/lib/export-excel";
import { useAuthContext } from "@/providers/AuthProvider";
import { toast } from "sonner";

const PAGE_SIZE = 10;

export default function ManageRedemptionPage() {
  const { user } = useAuthContext();

  // State Filter & Pagination
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [productFilter, setProductFilter] = useState("ALL");

  // Export State
  const [isExporting, setIsExporting] = useState(false);

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

  // Query Categories for dropdown filter
  const { data: categoriesData } = useAdminCategories({ limit: 100 });
  const categories = categoriesData?.categories || [];

  // Query Products for dropdown filter
  const { data: productsData } = useAdminProducts({ limit: 100 });
  const products = productsData?.products || [];

  // Products filtered by selected category
  const availableProducts = useMemo(() => {
    if (categoryFilter === "ALL") return products;
    return products.filter((p) => String(p.category_id) === String(categoryFilter));
  }, [products, categoryFilter]);

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
    category_id: categoryFilter === "ALL" ? undefined : categoryFilter,
    product_id: productFilter === "ALL" ? undefined : productFilter,
  });

  // Global Stats Query for top cards
  const { data: allStatsData } = useQuery({
    queryKey: ["admin-redeem-overall-stats"],
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
      list.map((r) => r.registration_id || r.user_id).filter(Boolean)
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
    setCategoryFilter("ALL");
    setProductFilter("ALL");
    setPage(1);
  };

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      toast.info("Sedang menyiapkan data redeem product untuk diekspor...");

      const res = await getAllRedemptions({
        page: 1,
        limit: 1000,
        search: searchTerm || undefined,
        product_id: productFilter === "ALL" ? undefined : productFilter,
        category_id: categoryFilter === "ALL" ? undefined : categoryFilter,
      });

      const list = Array.isArray(res?.redemptions) ? res.redemptions : [];

      if (list.length === 0) {
        toast.warning("Tidak ada data redeem untuk diekspor.");
        return;
      }

      const columns = [
        { header: "No", key: "no", width: 8, align: "center" },
        { header: "ID Transaksi", key: "redemption_id", width: 28 },
        { header: "ID Pendaftaran", key: "registration_id", width: 28 },
        { header: "Waktu Penukaran", key: "created_at", width: 22, align: "center" },
        { header: "Nama Peserta", key: "user_name", width: 25 },
        { header: "Tim Lomba", key: "team_name", width: 25 },
        { header: "Email", key: "user_email", width: 26 },
        { header: "Nomor WhatsApp", key: "whatsapp_number", width: 20 },
        { header: "Nama Produl", key: "product_name", width: 25 },
        { header: "Jumlah", key: "quantity", width: 14, align: "center" },
        { header: "Diamond Digunakan", key: "points_used", width: 20, align: "center" },
        { header: "Status Penukaran", key: "status", width: 18, align: "center" },
      ];

      const rows = list.map((item, index) => {
        return {
          no: index + 1,
          redemption_id: item.redemption_id || "-",
          registration_id: item.registration_id || "-",
          created_at: formatDateDisplay(item.created_at),
          user_name: item.user?.name || "-",
          team_name: item.registration?.team_name || "-",
          user_email: item.user?.email || "-",
          whatsapp_number: item.user?.whatsapp_number || item.user?.whatsapp || "-",
          product_name: item.product?.name || "-",
          quantity: `${item.quantity || 1} item`,
          points_used: `${(item.points_used ?? 0).toLocaleString("id-ID")} Diamond`,
          status: "Berhasil Ditebus",
        };
      });

      await exportToExcel({
        pageTitle: "MANAGE REDEEM",
        accountName: user?.name || user?.email || "Admin MIA",
        fileName: `MIA2026_Data_Redeem_Product_${new Date().toISOString().slice(0, 10)}`,
        columns,
        data: rows,
      });

      toast.success(`Berhasil mengekspor ${rows.length} data redeem product!`);
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Gagal mengekspor data: " + (err.message || "Terjadi kesalahan"));
    } finally {
      setIsExporting(false);
    }
  };

  const hasActiveFilters =
    searchTerm || categoryFilter !== "ALL" || productFilter !== "ALL";

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
            <span>Riwayat Redeem Produk</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Pantau riwayat penukaran product dan penggunaan poin Diamond oleh peserta kompetisi.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap justify-end">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-10 px-4 rounded-xl border-border/50 bg-input/20 hover:bg-input/40 text-foreground text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button
            onClick={handleExportExcel}
            disabled={isExporting}
            className="h-10 px-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            {isExporting ? (
              <RefreshCw className="h-4 w-4 animate-spin text-emerald-400" />
            ) : (
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            )}
            <span>{isExporting ? "Mengekspor..." : "Export Excel"}</span>
          </Button>
        </div>
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
              <p className="text-xs text-muted-foreground">Jenis Produk</p>
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
                placeholder="Cari nama peserta atau produk..."
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

            {/* Filter Dropdowns (Kategori & Produk) */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Filter Kategori Lomba */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  Kategori:
                </span>
                <Select
                  value={categoryFilter}
                  onValueChange={(val) => {
                    setCategoryFilter(val);
                    setPage(1);
                    // Jika produk yang dipilih tidak sesuai dengan kategori yang baru, reset pilihan produk
                    if (val !== "ALL" && productFilter !== "ALL") {
                      const p = products.find(
                        (prod) => String(prod.product_id) === String(productFilter)
                      );
                      if (p && String(p.category_id) !== String(val)) {
                        setProductFilter("ALL");
                      }
                    }
                  }}
                >
                  <SelectTrigger className="h-9 w-40 sm:w-44 bg-input/40 border-border/50 rounded-xl text-xs text-foreground truncate">
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141824] border-border/50 text-foreground max-h-64">
                    <SelectItem value="ALL">Semua Kategori</SelectItem>
                    <SelectItem value="GLOBAL">🌐 Khusus Global</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.category_id} value={String(c.category_id)}>
                        {c.name || c.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <SelectTrigger className="h-9 w-40 sm:w-44 bg-input/40 border-border/50 rounded-xl text-xs text-foreground truncate">
                    <SelectValue placeholder="Semua Produk" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141824] border-border/50 text-foreground max-h-64">
                    <SelectItem value="ALL">Semua Produk</SelectItem>
                    {availableProducts.map((p) => (
                      <SelectItem key={p.product_id} value={String(p.product_id)}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
              {categoryFilter !== "ALL" && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Kategori:{" "}
                  {categoryFilter === "GLOBAL"
                    ? "🌐 Khusus Global"
                    : categories.find(
                        (c) => String(c.category_id) === String(categoryFilter)
                      )?.name || categoryFilter}
                  <button
                    type="button"
                    onClick={() => setCategoryFilter("ALL")}
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
                  : "Belum ada peserta yang menukarkan poin Diamond dengan product."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/40 hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 pl-6 bg-white/[0.02]">
                      Tim & Ketua
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Kategori
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Produk
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
                          <div className="w-9 h-9 rounded-xl bg-[#E01C20]/15 border border-[#E01C20]/30 flex items-center justify-center text-[#FED700] font-bold text-xs flex-shrink-0 select-none">
                            {r.registration?.team_name.charAt(0).toUpperCase() || "-"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground text-xs sm:text-sm truncate max-w-[160px] sm:max-w-[220px]">
                              {r.registration?.team_name || "Tanpa Nama Tim"}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate max-w-[160px] sm:max-w-[220px]">
                              Ketua: {r.registration?.team_leader_name || r.user?.name || "-"}
                            </p>
                            <p className="text-[10px] text-muted-foreground/70 truncate max-w-[160px] sm:max-w-[220px]">
                              {r.user?.email || "-"}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Kategori Kompetisi */}
                      <TableCell className="py-3.5 text-center">
                        <Badge className="bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[11px] px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap">
                          {r.registration?.category_name || r.category?.name || r.product?.category?.name || "Kompetisi"}
                        </Badge>
                      </TableCell>

                      {/* Produk */}
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-3">
                          {r.product?.image_url ? (
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-border/50 bg-black/40 flex-shrink-0">
                              <Image
                                src={getSafeImageUrl(r.product.image_url)}
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
                            <p className="font-medium text-foreground text-xs truncate">
                              {r.product?.name || "Produk Dihapus"}
                            </p>
                            <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                              {(r.category?.name || r.product?.category?.name) ? (
                                <Badge className="bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[10px] px-1.5 py-0 rounded font-medium">
                                  {r.category?.name || r.product?.category?.name}
                                </Badge>
                              ) : (
                                <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] px-1.5 py-0 rounded font-medium">
                                  🌐 Semua Kategori
                                </Badge>
                              )}
                              {r.product?.price && (
                                <span className="text-[11px] text-muted-foreground">
                                  @Harga: 💎 {Number(r.product.price).toLocaleString("id-ID")}
                                </span>
                              )}
                            </div>
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
              Detail Penukaran Produk
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

            {detailData?.registration_id && (
              <div className="flex justify-between items-center py-0.5 border-b border-border/20">
                <span className="text-muted-foreground">ID Pendaftaran:</span>
                <span className="font-mono text-muted-foreground text-[11px] truncate max-w-[180px]">
                  {detailData.registration_id}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center py-0.5 border-b border-border/20">
              <span className="text-muted-foreground">Nama Peserta:</span>
              <span className="font-semibold text-foreground truncate max-w-[200px]">
                {detailData?.user?.name || "-"}
              </span>
            </div>

            {detailData?.registration?.team_name && (
              <div className="flex justify-between items-center py-0.5 border-b border-border/20">
                <span className="text-muted-foreground">Tim Lomba:</span>
                <span className="font-semibold text-blue-400 truncate max-w-[200px]">
                  {detailData.registration.team_name}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center py-0.5 border-b border-border/20">
              <span className="text-muted-foreground">Email:</span>
              <span className="text-muted-foreground truncate max-w-[200px]">
                {detailData?.user?.email || "-"}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5 border-b border-border/20">
              <span className="text-muted-foreground">Nomor WhatsApp:</span>
              {detailData?.user?.whatsapp_number || detailData?.user?.whatsapp ? (
                <a
                  href={`https://wa.me/${(detailData?.user?.whatsapp_number || detailData?.user?.whatsapp).replace(/[^0-9]/g, "").replace(/^0/, "62")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 hover:underline inline-flex items-center gap-1 font-medium text-xs"
                  title="Hubungi via WhatsApp"
                >
                  <Phone className="h-3 w-3" />
                  <span>{detailData?.user?.whatsapp_number || detailData?.user?.whatsapp}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-muted-foreground/40 italic">Belum diisi</span>
              )}
            </div>

            <div className="flex justify-between items-center py-0.5 border-b border-border/20">
              <span className="text-muted-foreground">Produk:</span>
              <span className="font-semibold text-foreground truncate max-w-[200px]">
                {detailData?.product?.name || "-"}
              </span>
            </div>

            {(detailData?.registration?.category_name || detailData?.category?.name || detailData?.product?.category?.name) && (
              <div className="flex justify-between items-center py-0.5 border-b border-border/20">
                <span className="text-muted-foreground">Kategori Lomba:</span>
                <Badge className="bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[10px] px-2 py-0.5 rounded font-medium">
                  {detailData?.registration?.category_name || detailData?.category?.name || detailData?.product?.category?.name}
                </Badge>
              </div>
            )}

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