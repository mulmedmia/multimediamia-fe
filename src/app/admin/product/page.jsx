"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { getSafeImageUrl } from "@/lib/image-loader";
import { useQuery } from "@tanstack/react-query";
import {
  useAdminProducts,
  useCreateAdminProduct,
  useUpdateAdminProduct,
  useDeleteAdminProduct,
} from "@/hooks/admin-use.product";
import { getAdminProducts } from "@/services/admin-product.service";
import { getAllUserCategories } from "@/services/user-category.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Layers,
  ShoppingBag,
  RefreshCw,
  X,
  Image as ImageIcon,
  Infinity as InfinityIcon,
  Zap,
} from "lucide-react";
import ProductForm from "./ProductForm";

const PAGE_SIZE = 10;

export default function AdminProductPage() {
  // State Filter & Pagination
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // State Modal
  const [openCreate, setOpenCreate] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);

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

  // Query Categories for filter dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ["user-categories-dropdown"],
    queryFn: getAllUserCategories,
    staleTime: 5 * 60 * 1000,
  });

  // Query Products
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useAdminProducts({
    limit: PAGE_SIZE,
    page,
    search: searchTerm || undefined,
    is_active: statusFilter === "ALL" ? undefined : statusFilter,
    category_id: categoryFilter === "ALL" ? undefined : categoryFilter,
    exact: categoryFilter !== "ALL" && categoryFilter !== "GLOBAL" ? true : undefined,
  });

  // Query Global Stats for top summary cards
  const { data: allStatsData } = useQuery({
    queryKey: ["admin-products-overall-stats"],
    queryFn: () => getAdminProducts({ page: 1, limit: 1000 }),
    staleTime: 1000 * 60,
  });

  // Mutations
  const createMutation = useCreateAdminProduct(() => setOpenCreate(false));
  const updateMutation = useUpdateAdminProduct(() => setEditData(null));
  const deleteMutation = useDeleteAdminProduct(() => setDeleteProduct(null));

  const products = useMemo(() => {
    return Array.isArray(data?.products) ? data.products : [];
  }, [data?.products]);

  const meta = data?.meta || {
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 1,
    total: 0,
  };

  const totalItems = meta.total || 0;
  const totalPages = meta.totalPages || 1;

  // Statistics calculation
  const stats = useMemo(() => {
    const list = allStatsData?.products || products;
    const total = allStatsData?.meta?.total ?? totalItems;
    const active = list.filter((p) => p.is_active).length;
    const inactive = list.filter((p) => !p.is_active).length;
    const totalStock = list.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
    return { total, active, inactive, totalStock };
  }, [allStatsData, products, totalItems]);

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setStatusFilter("ALL");
    setCategoryFilter("ALL");
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    searchTerm || statusFilter !== "ALL" || categoryFilter !== "ALL"
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Admin Panel</span>
            <span>/</span>
            <span className="text-foreground font-medium">Produk & Reward</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Package className="h-7 w-7 text-[#E01C20]" />
            <span>Kelola Produk & Merchandise</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Kelola katalog merchandise, ketersediaan stok, harga penukaran poin, dan status aktif produk.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-10 px-3.5 rounded-xl border-border/50 bg-input/20 hover:bg-input/40 text-foreground text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            onClick={() => setOpenCreate(true)}
            className="bg-gradient-to-r from-[#FF5722] to-[#E01C20] hover:from-[#e04515] hover:to-[#c4181c] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-red-900/30 h-10 px-4 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Produk Baru</span>
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
              <p className="text-xs text-muted-foreground">Total Produk</p>
              <p className="text-xl font-bold text-foreground">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Produk Aktif</p>
              <p className="text-xl font-bold text-foreground">{stats.active}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Nonaktif</p>
              <p className="text-xl font-bold text-foreground">{stats.inactive}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Stok Barang</p>
              <p className="text-xl font-bold text-foreground">{stats.totalStock}</p>
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
                placeholder="Cari nama atau deskripsi produk..."
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

            {/* Filter Kategori */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                Kategori:
              </span>
              <Select
                value={categoryFilter}
                onValueChange={(val) => {
                  setCategoryFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-40 sm:w-48 bg-input/40 border-border/50 rounded-xl text-xs text-foreground">
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent className="bg-[#141824] border-border/50 text-foreground max-h-64">
                  <SelectItem value="ALL">Semua Kategori</SelectItem>
                  <SelectItem value="GLOBAL">🌐 Khusus Global</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.category_id} value={c.category_id}>
                      {c.name || c.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                Status:
              </span>
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-36 sm:w-40 bg-input/40 border-border/50 rounded-xl text-xs text-foreground">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#141824] border-border/50 text-foreground">
                  <SelectItem value="ALL">Semua Status</SelectItem>
                  <SelectItem value="true">Aktif</SelectItem>
                  <SelectItem value="false">Nonaktif</SelectItem>
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
              {categoryFilter !== "ALL" && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Kategori:{" "}
                  {categoryFilter === "GLOBAL"
                    ? "🌐 Khusus Global"
                    : categories.find((c) => c.category_id === categoryFilter)?.name ||
                      categoryFilter}
                  <button
                    type="button"
                    onClick={() => setCategoryFilter("ALL")}
                    className="hover:text-blue-200 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              )}
              {statusFilter !== "ALL" && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Status: {statusFilter === "true" ? "Aktif" : "Nonaktif"}
                  <button
                    type="button"
                    onClick={() => setStatusFilter("ALL")}
                    className="hover:text-amber-200 ml-0.5"
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
                Gagal memuat data produk.
              </p>
              <Button
                size="sm"
                onClick={() => refetch()}
                className="bg-[#E01C20] hover:bg-[#c4181c] text-xs font-semibold rounded-xl"
              >
                Coba Lagi
              </Button>
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div className="py-16 px-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-border/40 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <Package className="h-8 w-8 text-[#E01C20]/60" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                {hasActiveFilters
                  ? "Tidak ada produk yang cocok"
                  : "Belum ada produk"}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {hasActiveFilters
                  ? "Coba sesuaikan kata kunci pencarian atau ganti filter status."
                  : "Belum ada produk atau merchandise yang ditambahkan ke sistem."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/40 hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 pl-6 bg-white/[0.02]">
                      Produk / Merchandise
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Harga
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Stok
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Status
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
                  {products.map((prod) => (
                    <TableRow
                      key={prod.product_id}
                      className="group hover:bg-white/[0.02] transition-colors border-b border-border/30"
                    >
                      {/* Thumbnail & Detail Produk */}
                      <TableCell className="py-3.5 pl-6">
                        <div className="flex items-center gap-3">
                          {prod.image_url ? (
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-border/50 bg-black/40 flex-shrink-0">
                              <Image
                                src={getSafeImageUrl(prod.image_url)}
                                alt={prod.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-xl border border-border/40 bg-white/[0.03] flex items-center justify-center text-muted-foreground flex-shrink-0">
                              <ImageIcon className="h-5 w-5 opacity-40" />
                            </div>
                          )}
                          <div className="min-w-0 max-w-[240px] sm:max-w-[340px]">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="font-semibold text-foreground text-xs sm:text-sm truncate">
                                {prod.name}
                              </p>
                              {prod.category?.name ? (
                                <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] px-1.5 py-0.2 rounded font-medium">
                                  {prod.category.name}
                                </Badge>
                              ) : (
                                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-1.5 py-0.2 rounded font-medium">
                                  🌐 Semua Kategori
                                </Badge>
                              )}
                              {prod.is_single_redeem && (
                                <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] px-1.5 py-0.2 rounded font-medium">
                                  1x Redeem
                                </Badge>
                              )}
                              {Number(prod.reward_xp) > 0 && (
                                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-1.5 py-0.2 rounded font-medium flex items-center gap-0.5">
                                  <Zap className="h-3 w-3" />
                                  <span>+{prod.reward_xp} XP</span>
                                </Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                              {prod.description || "-"}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Harga */}
                      <TableCell className="py-3.5 text-xs sm:text-sm font-semibold text-foreground whitespace-nowrap">
                        💎 {Number(prod.price).toLocaleString("id-ID")}
                      </TableCell>

                      {/* Stok */}
                      <TableCell className="py-3.5">
                        {prod.is_unlimited_stock ? (
                          <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] px-2 py-0.5 rounded font-medium flex items-center gap-1 w-fit">
                            <InfinityIcon className="h-3 w-3" />
                            <span>Tidak Terbatas</span>
                          </Badge>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="font-bold text-foreground">{prod.stock}</span>
                            {Number(prod.stock) <= 0 ? (
                              <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] px-1.5 py-0.2 rounded">
                                Habis
                              </Badge>
                            ) : Number(prod.stock) <= 5 ? (
                              <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] px-1.5 py-0.2 rounded">
                                Menipis
                              </Badge>
                            ) : null}
                          </div>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-3.5">
                        <Badge
                          className={`text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit ${
                            prod.is_active
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                          }`}
                        >
                          {prod.is_active ? (
                            <>
                              <CheckCircle2 className="h-3 w-3" /> Aktif
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-3 w-3" /> Nonaktif
                            </>
                          )}
                        </Badge>
                      </TableCell>

                      {/* Created By */}
                      <TableCell className="py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        {prod.created_by_name || "-"}
                      </TableCell>

                      {/* Updated By */}
                      <TableCell className="py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        {prod.updated_by_name || "-"}
                      </TableCell>

                      {/* Aksi */}
                      <TableCell className="py-3.5 pr-6 text-right sticky right-0 bg-[#0F121A] group-hover:bg-[#141824] z-10 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.5)] border-l border-border/40 transition-colors">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Tombol Edit */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditData(prod)}
                            className="h-8 px-2.5 bg-input/40 hover:bg-white/10 border-border/50 text-foreground text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Edit Produk"
                          >
                            <Edit2 className="h-3.5 w-3.5 text-blue-400" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>

                          {/* Tombol Hapus */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteProduct(prod)}
                            className="h-8 px-2.5 bg-input/40 hover:bg-red-500/10 hover:border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Hapus Produk"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Hapus</span>
                          </Button>
                        </div>
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
              produk {hasActiveFilters && "(hasil filter)"}
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

      {/* Create Dialog */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="bg-[#0A0D14] border border-border/50 text-[#FFF9F5] max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg sm:text-xl font-bold flex items-center gap-2.5 text-foreground">
              <Package className="h-5 w-5 text-[#E01C20]" />
              <span>Tambah Produk Baru</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Tambahkan produk merchandise baru ke katalog rewards penukaran.
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            onSubmit={createMutation.mutate}
            isLoading={createMutation.isPending}
            onCancel={() => setOpenCreate(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editData}
        onOpenChange={(open) => !open && setEditData(null)}
      >
        <DialogContent className="bg-[#0A0D14] border border-border/50 text-[#FFF9F5] max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg sm:text-xl font-bold flex items-center gap-2.5 text-foreground">
              <Edit2 className="h-5 w-5 text-[#E01C20]" />
              <span>Edit Produk</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Perbarui detail informasi, harga, jumlah stok, atau gambar produk.
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            initial={editData}
            onSubmit={(payload) =>
              updateMutation.mutate({ ...payload, id: editData?.product_id })
            }
            isLoading={updateMutation.isPending}
            onCancel={() => setEditData(null)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteProduct}
        onOpenChange={(open) => !open && setDeleteProduct(null)}
      >
        <DialogContent className="bg-[#0A0D14] border border-border/50 text-[#FFF9F5] max-w-md rounded-2xl p-6 shadow-2xl">
          <DialogHeader className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <DialogTitle className="text-lg font-bold text-center">
              Hapus Produk
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground text-center">
              Apakah Anda yakin ingin menghapus produk{" "}
              <span className="text-foreground font-semibold">
                &quot;{deleteProduct?.name}&quot;
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => setDeleteProduct(null)}
              className="rounded-xl text-xs text-muted-foreground hover:text-white"
            >
              Batal
            </Button>
            <Button
              onClick={() => deleteMutation.mutate(deleteProduct.product_id)}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold px-4 cursor-pointer"
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus Produk"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}