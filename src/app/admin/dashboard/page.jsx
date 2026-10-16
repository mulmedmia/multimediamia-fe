"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useAdminRegistrations } from "@/hooks/admin-use-pendaftar";
import { useAdminSubmissions } from "@/hooks/admin-use-submission";
import { useAdminCategories } from "@/hooks/admin-use-categories";
import { useAdminProducts } from "@/hooks/admin-use.product";
import { useAdminMissions } from "@/hooks/admin-use-missions";
import { useAdminJuri } from "@/hooks/admin-use-juri";
import { useAdminRedemptions } from "@/hooks/admin-use-reddem";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LayoutDashboard,
  Users,
  UploadCloud,
  Target,
  ShoppingBag,
  FolderTree,
  Package,
  ShieldCheck,
  CheckCircle2,
  Clock3,
  AlertCircle,
  XCircle,
  RefreshCw,
  ArrowUpRight,
  Activity,
  Calendar,
  Sparkles,
  ChevronRight,
  Layers,
} from "lucide-react";

export default function AdminDashboardPage() {
  // Query 5 recent registrations (also provides meta.total)
  const {
    data: regData,
    isLoading: loadingReg,
    isFetching: fetchingReg,
    refetch: refetchReg,
  } = useAdminRegistrations({ page: 1, limit: 5 });

  // Query 5 recent submissions (also provides meta.total)
  const {
    data: subData,
    isLoading: loadingSub,
    isFetching: fetchingSub,
    refetch: refetchSub,
  } = useAdminSubmissions({ page: 1, limit: 5 });

  // Query categories
  const {
    data: catData,
    isLoading: loadingCat,
    isFetching: fetchingCat,
    refetch: refetchCat,
  } = useAdminCategories({ limit: 100 });

  // Query products
  const {
    data: prodData,
    isLoading: loadingProd,
    isFetching: fetchingProd,
    refetch: refetchProd,
  } = useAdminProducts({ limit: 100 });

  // Query missions
  const {
    data: missionsData,
    isLoading: loadingMissions,
    isFetching: fetchingMissions,
    refetch: refetchMissions,
  } = useAdminMissions();

  // Query juri
  const {
    data: juriData,
    isLoading: loadingJuri,
    isFetching: fetchingJuri,
    refetch: refetchJuri,
  } = useAdminJuri();

  // Query redemptions count
  const {
    data: redData,
    isLoading: loadingRed,
    isFetching: fetchingRed,
    refetch: refetchRed,
  } = useAdminRedemptions({ page: 1, limit: 1 });

  const isRefreshing =
    fetchingReg ||
    fetchingSub ||
    fetchingCat ||
    fetchingProd ||
    fetchingMissions ||
    fetchingJuri ||
    fetchingRed;

  const handleRefreshAll = () => {
    refetchReg();
    refetchSub();
    refetchCat();
    refetchProd();
    refetchMissions();
    refetchJuri();
    refetchRed();
  };

  // Extract totals and collections
  const totalRegistrations = regData?.meta?.total || 0;
  const recentRegistrations = useMemo(() => {
    return Array.isArray(regData?.registrations) ? regData.registrations : [];
  }, [regData?.registrations]);

  const totalSubmissions = subData?.meta?.total || 0;
  const recentSubmissions = useMemo(() => {
    return Array.isArray(subData?.submissions) ? subData.submissions : [];
  }, [subData?.submissions]);

  const categories = useMemo(() => {
    return Array.isArray(catData?.categories)
      ? catData.categories
      : Array.isArray(catData)
      ? catData
      : [];
  }, [catData]);
  const totalCategories = catData?.meta?.total ?? categories.length;

  const products = useMemo(() => {
    return Array.isArray(prodData?.products)
      ? prodData.products
      : Array.isArray(prodData)
      ? prodData
      : [];
  }, [prodData]);
  const totalProducts = prodData?.meta?.total ?? products.length;

  const missions = useMemo(() => {
    return Array.isArray(missionsData?.missions)
      ? missionsData.missions
      : Array.isArray(missionsData)
      ? missionsData
      : [];
  }, [missionsData]);
  const totalMissions = missionsData?.meta?.total ?? missions.length;
  const activeMissionsCount = missions.filter((m) => m.status === "ACTIVE").length;

  const juriList = useMemo(() => {
    return Array.isArray(juriData)
      ? juriData
      : Array.isArray(juriData?.juri)
      ? juriData.juri
      : [];
  }, [juriData]);
  const totalJuri = juriList.length;

  const totalRedemptions = redData?.meta?.total || 0;

  // Helper date formatter
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

  // Helper submission status badge
  const getSubmissionStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 w-fit font-medium">
            <CheckCircle2 className="h-3 w-3" /> Disetujui
          </Badge>
        );
      case "REVISION":
        return (
          <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 w-fit font-medium">
            <AlertCircle className="h-3 w-3" /> Revisi
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 w-fit font-medium">
            <XCircle className="h-3 w-3" /> Ditolak
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 w-fit font-medium">
            <Clock3 className="h-3 w-3" /> Menunggu
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Admin Panel</span>
            <span>/</span>
            <span className="text-foreground font-medium">Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <LayoutDashboard className="h-7 w-7 text-[#E01C20]" />
            <span>Dashboard Utama</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Pusat komando dan ringkasan metrik kompetisi Multimedia In Action (MIA) 2026.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sistem Online</span>
          </div>
          <Button
            variant="outline"
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="h-10 px-4 rounded-xl border-border/50 bg-input/20 hover:bg-input/40 text-foreground text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Primary KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pendaftar */}
        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">Total Tim Terdaftar</p>
              {loadingReg ? (
                <Skeleton className="h-7 w-14 bg-white/5 rounded-md mt-0.5" />
              ) : (
                <p className="text-xl font-bold text-foreground">
                  {totalRegistrations.toLocaleString("id-ID")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Karya Dikumpulkan */}
        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">Karya Dikumpulkan</p>
              {loadingSub ? (
                <Skeleton className="h-7 w-14 bg-white/5 rounded-md mt-0.5" />
              ) : (
                <p className="text-xl font-bold text-foreground">
                  {totalSubmissions.toLocaleString("id-ID")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Misi Harian */}
        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Target className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">Misi Harian</p>
              {loadingMissions ? (
                <Skeleton className="h-7 w-14 bg-white/5 rounded-md mt-0.5" />
              ) : (
                <div className="flex items-baseline gap-1.5">
                  <p className="text-xl font-bold text-foreground">{totalMissions}</p>
                  <span className="text-[11px] text-amber-400">({activeMissionsCount} aktif)</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Merchandise & Redeem */}
        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">Penukaran Reward</p>
              {loadingRed ? (
                <Skeleton className="h-7 w-14 bg-white/5 rounded-md mt-0.5" />
              ) : (
                <div className="flex items-baseline gap-1.5">
                  <p className="text-xl font-bold text-foreground">{totalRedemptions}</p>
                  <span className="text-[11px] text-purple-400">Ditebus</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#0F121A]/60 border border-border/30 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-muted-foreground">Kategori Lomba</p>
            <p className="text-base font-bold text-foreground mt-0.5">
              {loadingCat ? "-" : `${totalCategories} Kategori`}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <FolderTree className="h-4 w-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0F121A]/60 border border-border/30 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-muted-foreground">Dewan Juri</p>
            <p className="text-base font-bold text-foreground mt-0.5">
              {loadingJuri ? "-" : `${totalJuri} Juri`}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0F121A]/60 border border-border/30 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-muted-foreground">Item Merchandise</p>
            <p className="text-base font-bold text-foreground mt-0.5">
              {loadingProd ? "-" : `${totalProducts} Produk`}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Package className="h-4 w-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0F121A]/60 border border-border/30 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-muted-foreground">Status Database</p>
            <p className="text-base font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Normal
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Activity className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#E01C20]" />
            <span>Akses Cepat Modul Admin</span>
          </h2>
          <span className="text-xs text-muted-foreground">Navigasi pintas manajemen</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            href="/admin/pendaftar"
            className="group p-3.5 rounded-2xl bg-[#0F121A]/80 border border-border/40 hover:border-blue-500/40 hover:bg-blue-500/[0.03] transition-all flex flex-col justify-between gap-3 shadow-sm cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                <Users className="h-4 w-4" />
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-blue-400 transition-colors" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground group-hover:text-blue-400 transition-colors">
                Verifikasi Pendaftar
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {totalRegistrations} pendaftar
              </p>
            </div>
          </Link>

          <Link
            href="/admin/pengumpulan"
            className="group p-3.5 rounded-2xl bg-[#0F121A]/80 border border-border/40 hover:border-emerald-500/40 hover:bg-emerald-500/[0.03] transition-all flex flex-col justify-between gap-3 shadow-sm cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <UploadCloud className="h-4 w-4" />
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-emerald-400 transition-colors" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground group-hover:text-emerald-400 transition-colors">
                Evaluasi Karya
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {totalSubmissions} pengumpulan
              </p>
            </div>
          </Link>

          <Link
            href="/admin/misi"
            className="group p-3.5 rounded-2xl bg-[#0F121A]/80 border border-border/40 hover:border-amber-500/40 hover:bg-amber-500/[0.03] transition-all flex flex-col justify-between gap-3 shadow-sm cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <Target className="h-4 w-4" />
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-amber-400 transition-colors" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground group-hover:text-amber-400 transition-colors">
                Kelola Misi
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {totalMissions} misi aktif
              </p>
            </div>
          </Link>

          <Link
            href="/admin/category"
            className="group p-3.5 rounded-2xl bg-[#0F121A]/80 border border-border/40 hover:border-cyan-500/40 hover:bg-cyan-500/[0.03] transition-all flex flex-col justify-between gap-3 shadow-sm cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                <FolderTree className="h-4 w-4" />
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-cyan-400 transition-colors" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground group-hover:text-cyan-400 transition-colors">
                Kategori Lomba
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {totalCategories} kategori
              </p>
            </div>
          </Link>

          <Link
            href="/admin/product"
            className="group p-3.5 rounded-2xl bg-[#0F121A]/80 border border-border/40 hover:border-pink-500/40 hover:bg-pink-500/[0.03] transition-all flex flex-col justify-between gap-3 shadow-sm cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform">
                <Package className="h-4 w-4" />
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-pink-400 transition-colors" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground group-hover:text-pink-400 transition-colors">
                Kelola Produk
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {totalProducts} merchandise
              </p>
            </div>
          </Link>

          <Link
            href="/admin/manage-redeem"
            className="group p-3.5 rounded-2xl bg-[#0F121A]/80 border border-border/40 hover:border-purple-500/40 hover:bg-purple-500/[0.03] transition-all flex flex-col justify-between gap-3 shadow-sm cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-purple-400 transition-colors" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground group-hover:text-purple-400 transition-colors">
                Riwayat Redeem
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {totalRedemptions} transaksi
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Tables Grid (Recent Registrations & Recent Submissions) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Pendaftar Terbaru */}
        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <CardHeader className="p-4 sm:p-5 border-b border-border/40 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm sm:text-base font-bold text-foreground">
                  Pendaftar Terbaru
                </CardTitle>
                <p className="text-[11px] text-muted-foreground">
                  Peserta kompetisi yang baru mendaftar
                </p>
              </div>
            </div>

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl"
            >
              <Link href="/admin/pendaftar" className="flex items-center gap-1">
                <span>Lihat Semua</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>

          <CardContent className="p-0 flex-1">
            {loadingReg ? (
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-white/5 rounded-xl" />
                ))}
              </div>
            ) : recentRegistrations.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <Users className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Belum ada data pendaftar terbaru</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border/40 hover:bg-transparent">
                      <TableHead className="text-muted-foreground font-semibold text-xs py-3 pl-5 bg-white/[0.02]">
                        Peserta
                      </TableHead>
                      <TableHead className="text-muted-foreground font-semibold text-xs py-3 bg-white/[0.02]">
                        Kategori
                      </TableHead>
                      <TableHead className="text-muted-foreground font-semibold text-xs py-3 bg-white/[0.02]">
                        Verifikasi
                      </TableHead>
                      <TableHead className="text-muted-foreground font-semibold text-xs py-3 bg-white/[0.02] whitespace-nowrap">
                        Created By
                      </TableHead>
                      <TableHead className="text-muted-foreground font-semibold text-xs py-3 bg-white/[0.02] whitespace-nowrap">
                        Updated By
                      </TableHead>
                      <TableHead className="text-muted-foreground font-semibold text-xs py-3 pr-5 text-right bg-white/[0.02]">
                        Waktu
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentRegistrations.map((r) => (
                      <TableRow
                        key={r.registration_id}
                        className="hover:bg-white/[0.02] transition-colors border-b border-border/30"
                      >
                        <TableCell className="py-3 pl-5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs flex-shrink-0">
                              {r.user?.name ? r.user.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div className="min-w-0 max-w-[140px] sm:max-w-[180px]">
                              <p className="font-semibold text-foreground text-xs truncate">
                                {r.user?.name || "Tanpa Nama"}
                              </p>
                              <p className="text-[10px] text-muted-foreground truncate">
                                {r.user?.email || "-"}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-3 text-xs">
                          <span className="inline-block px-2 py-0.5 rounded-lg bg-white/[0.04] border border-border/30 text-foreground text-[11px] truncate max-w-[120px]">
                            {r.category?.name || "Umum"}
                          </span>
                        </TableCell>

                        <TableCell className="py-3">
                          {r.is_verified ? (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 w-fit font-medium">
                              <CheckCircle2 className="h-2.5 w-2.5" /> Lolos
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 w-fit font-medium">
                              <Clock3 className="h-2.5 w-2.5" /> Pending
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell className="py-3 text-[11px] text-muted-foreground whitespace-nowrap">
                          {r.created_by_name || "-"}
                        </TableCell>

                        <TableCell className="py-3 text-[11px] text-muted-foreground whitespace-nowrap">
                          {r.updated_by_name || "-"}
                        </TableCell>

                        <TableCell className="py-3 pr-5 text-right text-[11px] text-muted-foreground whitespace-nowrap">
                          {formatDateDisplay(r.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 2: Pengumpulan Karya Terbaru */}
        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <CardHeader className="p-4 sm:p-5 border-b border-border/40 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <UploadCloud className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm sm:text-base font-bold text-foreground">
                  Pengumpulan Karya Terbaru
                </CardTitle>
                <p className="text-[11px] text-muted-foreground">
                  Karya peserta yang baru dikumpulkan
                </p>
              </div>
            </div>

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-xl"
            >
              <Link href="/admin/pengumpulan" className="flex items-center gap-1">
                <span>Lihat Semua</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>

          <CardContent className="p-0 flex-1">
            {loadingSub ? (
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-white/5 rounded-xl" />
                ))}
              </div>
            ) : recentSubmissions.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <UploadCloud className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Belum ada pengumpulan karya terbaru</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border/40 hover:bg-transparent">
                      <TableHead className="text-muted-foreground font-semibold text-xs py-3 pl-5 bg-white/[0.02]">
                        Judul Karya
                      </TableHead>
                      <TableHead className="text-muted-foreground font-semibold text-xs py-3 bg-white/[0.02]">
                        Kategori
                      </TableHead>
                      <TableHead className="text-muted-foreground font-semibold text-xs py-3 bg-white/[0.02]">
                        Status
                      </TableHead>
                      <TableHead className="text-muted-foreground font-semibold text-xs py-3 bg-white/[0.02] whitespace-nowrap">
                        Created By
                      </TableHead>
                      <TableHead className="text-muted-foreground font-semibold text-xs py-3 bg-white/[0.02] whitespace-nowrap">
                        Updated By
                      </TableHead>
                      <TableHead className="text-muted-foreground font-semibold text-xs py-3 pr-5 text-right bg-white/[0.02]">
                        Waktu
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentSubmissions.map((s) => (
                      <TableRow
                        key={s.submission_id}
                        className="hover:bg-white/[0.02] transition-colors border-b border-border/30"
                      >
                        <TableCell className="py-3 pl-5">
                          <div className="min-w-0 max-w-[150px] sm:max-w-[190px]">
                            <p className="font-semibold text-foreground text-xs truncate">
                              {s.title || "Tanpa Judul"}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate">
                              {s.user?.name || "-"}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell className="py-3 text-xs">
                          <span className="inline-block px-2 py-0.5 rounded-lg bg-white/[0.04] border border-border/30 text-foreground text-[11px] truncate max-w-[120px]">
                            {s.category?.name || "Umum"}
                          </span>
                        </TableCell>

                        <TableCell className="py-3">
                          {getSubmissionStatusBadge(s.status)}
                        </TableCell>

                        <TableCell className="py-3 text-[11px] text-muted-foreground whitespace-nowrap">
                          {s.created_by_name || "-"}
                        </TableCell>

                        <TableCell className="py-3 text-[11px] text-muted-foreground whitespace-nowrap">
                          {s.updated_by_name || "-"}
                        </TableCell>

                        <TableCell className="py-3 pr-5 text-right text-[11px] text-muted-foreground whitespace-nowrap">
                          {formatDateDisplay(s.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Timeline Stage & Categories Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alur Tahapan Kompetisi (2 Cols) */}
        <Card className="lg:col-span-2 bg-[#0F121A]/80 border-border/40 rounded-2xl shadow-xl">
          <CardHeader className="p-4 sm:p-5 border-b border-border/40 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[#E01C20]">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm sm:text-base font-bold text-foreground">
                  Tahapan & Alur Kompetisi MIA 2026
                </CardTitle>
                <p className="text-[11px] text-muted-foreground">
                  Roadmap pelaksanaan kompetisi Multimedia In Action
                </p>
              </div>
            </div>
            <Badge className="bg-[#E01C20]/10 text-[#E01C20] border border-[#E01C20]/20 text-[10px] px-2.5 py-0.5 rounded-full">
              Fase Berjalan
            </Badge>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-border/30 relative overflow-hidden">
                <div className="flex items-start justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.2 rounded-full">
                    Aktif
                  </Badge>
                </div>
                <h4 className="text-xs font-bold text-foreground mb-1">
                  Registrasi & Pembayaran
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Peserta membuat akun, mengisi formulir pendaftaran, dan diverifikasi oleh admin.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-border/30 relative overflow-hidden">
                <div className="flex items-start justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.2 rounded-full">
                    Aktif
                  </Badge>
                </div>
                <h4 className="text-xs font-bold text-foreground mb-1">
                  Misi Harian & Submit Karya
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Pengerjaan tantangan berkala serta pengunggahan proposal dan hasil karya digital.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-border/30 relative overflow-hidden">
                <div className="flex items-start justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <Badge className="bg-white/10 text-muted-foreground border border-border/40 text-[10px] px-2 py-0.2 rounded-full">
                    Mendatang
                  </Badge>
                </div>
                <h4 className="text-xs font-bold text-foreground mb-1">
                  Penjurian & Evaluasi Skor
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Dewan juri spesialis menilai karya berdasarkan rubrik penilaian dan kategori.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-border/30 relative overflow-hidden">
                <div className="flex items-start justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
                    4
                  </span>
                  <Badge className="bg-white/10 text-muted-foreground border border-border/40 text-[10px] px-2 py-0.2 rounded-full">
                    Mendatang
                  </Badge>
                </div>
                <h4 className="text-xs font-bold text-foreground mb-1">
                  Awarding & Grand Final
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Pengumuman juara masing-masing kategori, pemberian plakat, hadiah, dan trofi.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ringkasan Kategori (1 Col) */}
        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl shadow-xl flex flex-col">
          <CardHeader className="p-4 sm:p-5 border-b border-border/40 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm sm:text-base font-bold text-foreground">
                  Kategori Kompetisi
                </CardTitle>
                <p className="text-[11px] text-muted-foreground">
                  {totalCategories} kategori lomba aktif
                </p>
              </div>
            </div>

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-xl"
            >
              <Link href="/admin/category" className="flex items-center gap-1">
                <span>Kelola</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
            {loadingCat ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full bg-white/5 rounded-xl" />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="py-8 text-center">
                <FolderTree className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Belum ada kategori lomba dibuat</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {categories.slice(0, 6).map((cat) => (
                  <div
                    key={cat.category_id}
                    className="p-2.5 rounded-xl bg-white/[0.02] border border-border/30 flex items-center justify-between hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="min-w-0 max-w-[160px]">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {cat.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {cat.type === "TEAM" ? "Kelompok" : "Individu"} • Rp{" "}
                        {Number(cat.price || 0).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <Badge
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        cat.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {cat.status || "ACTIVE"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full h-9 rounded-xl border-border/50 bg-input/20 hover:bg-input/40 text-foreground text-xs font-medium cursor-pointer"
            >
              <Link href="/admin/category">Lihat Seluruh Kategori</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
