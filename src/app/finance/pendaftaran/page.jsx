"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAdminRegistrations, useRegistrationStats } from "@/hooks/admin-use-pendaftar";
import { getAllUserCategories } from "@/services/user-category.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CreditCard,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Layers,
  Users,
  RefreshCw,
  ExternalLink,
  XCircle,
  FileText,
  User,
  MessageSquare,
} from "lucide-react";
import FinanceVerifyModal from "./FinanceVerifyModal";
import FinanceDetailModal from "./FinanceDetailModal";

const PAGE_SIZE = 10;

// Helper function parse team members
const parseTeamMembers = (teamMembersString) => {
  if (!teamMembersString) return [];
  try {
    const parsed =
      typeof teamMembersString === "string"
        ? JSON.parse(teamMembersString)
        : teamMembersString;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return teamMembersString
      .split(",")
      .map((member) => member.trim().replace(/['"[\]]/g, ""))
      .filter((member) => member.length > 0);
  }
};

export default function FinancePendaftaranPage() {
  // Filters & Pagination State
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState("ALL");
  const [financeStatusFilter, setFinanceStatusFilter] = useState("ALL");

  // Modal State
  const [detailData, setDetailData] = useState(null);
  const [verifyData, setVerifyData] = useState(null);

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

  // Categories Dropdown Data
  const {
    data: categories = [],
    isLoading: loadingCategories,
  } = useQuery({
    queryKey: ["user-categories-dropdown"],
    queryFn: getAllUserCategories,
    staleTime: 1000 * 60 * 10,
  });

  // Query registrations
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useAdminRegistrations({
    page,
    limit: PAGE_SIZE,
    category_id: categoryId === "ALL" ? undefined : categoryId,
    search: searchTerm,
    is_verified_finance: financeStatusFilter === "ALL" ? undefined : financeStatusFilter,
  });

  // Query native aggregate stats from PostgreSQL
  const {
    data: statsData,
    isFetching: isFetchingStats,
    refetch: refetchStats,
  } = useRegistrationStats({
    category_id: categoryId === "ALL" ? undefined : categoryId,
  });

  const registrations = useMemo(() => {
    return Array.isArray(data?.registrations) ? data.registrations : [];
  }, [data?.registrations]);

  const meta = data?.meta || {
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 1,
    total: 0,
  };

  const totalPages = meta.totalPages || 1;

  // Helper date display
  const formatDateDisplay = (dateString) => {
    if (!dateString) return "-";
    try {
      return (
        new Date(dateString).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }) + " WIB"
      );
    } catch {
      return dateString;
    }
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setCategoryId("ALL");
    setFinanceStatusFilter("ALL");
    setPage(1);
  };

  const handleRefreshAll = () => {
    refetch();
    refetchStats();
  };

  const hasActiveFilters =
    searchTerm || categoryId !== "ALL" || financeStatusFilter !== "ALL";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Finance Panel</span>
            <span>/</span>
            <span className="text-foreground font-medium">Pendaftaran</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <CreditCard className="h-7 w-7 text-[#E01C20]" />
            <span>Verifikasi Pembayaran Peserta</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Periksa bukti transfer dan konfirmasi kelayakan pembayaran pendaftaran peserta kompetisi MIA 2026.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            onClick={handleRefreshAll}
            disabled={isFetching || isFetchingStats}
            className="h-10 px-4 rounded-xl border-border/50 bg-input/20 hover:bg-input/40 text-foreground text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching || isFetchingStats ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pendaftar */}
        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Pendaftar</p>
              <h4 className="text-xl sm:text-2xl font-bold text-foreground mt-0.5">
                {statsData?.total ?? meta.total ?? 0}
              </h4>
            </div>
          </CardContent>
        </Card>

        {/* Pembayaran Valid */}
        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Pembayaran Valid</p>
              <h4 className="text-xl sm:text-2xl font-bold text-emerald-400 mt-0.5">
                {statsData?.verified_finance ?? 0}
              </h4>
            </div>
          </CardContent>
        </Card>

        {/* Menunggu Verifikasi Finance */}
        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Menunggu Verifikasi</p>
              <h4 className="text-xl sm:text-2xl font-bold text-amber-400 mt-0.5">
                {statsData?.not_verified_finance ?? 0}
              </h4>
            </div>
          </CardContent>
        </Card>

        {/* Pendaftar Tim */}
        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Pendaftar Tim</p>
              <h4 className="text-xl sm:text-2xl font-bold text-purple-400 mt-0.5">
                {statsData?.team ?? 0}
              </h4>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-border/30 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama, email, atau tim..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 h-10 bg-input/20 border-border/50 text-xs sm:text-sm rounded-xl focus:border-[#E01C20] focus:ring-1 focus:ring-[#E01C20]"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Category Filter */}
              <div className="w-full sm:w-48">
                <Select
                  value={categoryId}
                  onValueChange={(val) => {
                    setCategoryId(val);
                    setPage(1);
                  }}
                  disabled={loadingCategories}
                >
                  <SelectTrigger className="h-10 bg-input/20 border-border/50 text-xs rounded-xl">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0F121A] border-border/40 text-foreground">
                    <SelectItem value="ALL">Semua Kategori</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.category_id} value={cat.category_id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Finance Filter */}
              <div className="w-full sm:w-48">
                <Select
                  value={financeStatusFilter}
                  onValueChange={(val) => {
                    setFinanceStatusFilter(val);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-10 bg-input/20 border-border/50 text-xs rounded-xl">
                    <SelectValue placeholder="Status Pembayaran" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0F121A] border-border/40 text-foreground">
                    <SelectItem value="ALL">Semua Status Finance</SelectItem>
                    <SelectItem value="true">Pembayaran Valid</SelectItem>
                    <SelectItem value="false">Belum Dicek</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-muted-foreground">Filter aktif:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 border border-border/40 text-foreground">
                  Pencarian: "{searchTerm}"
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      setSearchTerm("");
                    }}
                    className="hover:text-[#E01C20] ml-0.5"
                  >
                    ×
                  </button>
                </span>
              )}
              {categoryId !== "ALL" && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Kategori: {categories.find((c) => c.category_id === categoryId)?.name || categoryId}
                  <button
                    type="button"
                    onClick={() => setCategoryId("ALL")}
                    className="hover:text-purple-200 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              )}
              {financeStatusFilter !== "ALL" && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Finance: {financeStatusFilter === "true" ? "Pembayaran Valid" : "Belum Dicek"}
                  <button
                    type="button"
                    onClick={() => setFinanceStatusFilter("ALL")}
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
                Gagal memuat data pendaftar.
              </p>
              <Button
                size="sm"
                onClick={handleRefreshAll}
                className="bg-[#E01C20] hover:bg-[#c4181c] text-xs font-semibold rounded-xl"
              >
                Coba Lagi
              </Button>
            </div>
          ) : registrations.length === 0 ? (
            <div className="py-16 px-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-border/40 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <CreditCard className="h-8 w-8 text-[#E01C20]/60" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                {hasActiveFilters
                  ? "Tidak ada pendaftar yang cocok"
                  : "Belum ada pendaftar"}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {hasActiveFilters
                  ? "Coba sesuaikan kata kunci pencarian atau ubah filter kategori/status."
                  : "Belum ada data pendaftar yang masuk ke sistem."}
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
                      Kategori Lomba
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Tipe / Tim
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Waktu Registrasi
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Bukti Pembayaran
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Status Finance
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Diverifikasi Oleh
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 pr-6 text-right bg-[#141824] sticky right-0 z-20 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.5)] border-l border-border/40">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((reg) => {
                    const members = parseTeamMembers(reg.team_members);

                    return (
                      <TableRow
                        key={reg.registration_id}
                        className="group hover:bg-white/[0.02] transition-colors border-b border-border/30"
                      >
                        {/* Peserta */}
                        <TableCell className="py-3.5 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-border/40 flex items-center justify-center text-foreground font-bold text-xs flex-shrink-0 select-none">
                              {reg.user?.name ? reg.user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground text-xs sm:text-sm truncate max-w-[150px] sm:max-w-[200px]">
                                {reg.user?.name || "Tanpa Nama"}
                              </p>
                              <p className="text-[11px] text-muted-foreground truncate max-w-[150px] sm:max-w-[200px]">
                                {reg.user?.email || "-"}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Kategori Lomba */}
                        <TableCell className="py-3.5">
                          <Badge
                            variant="outline"
                            className="text-xs px-2.5 py-0.5 rounded-lg border-border/50 bg-white/[0.02] text-foreground"
                          >
                            {reg.category?.category_name || "-"}
                          </Badge>
                        </TableCell>

                        {/* Tipe / Tim */}
                        <TableCell className="py-3.5">
                          {reg.team_name ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 font-medium text-foreground text-xs">
                                <Users className="h-3.5 w-3.5 text-purple-400 flex-shrink-0" />
                                <span className="truncate max-w-[140px] font-semibold text-purple-300">
                                  {reg.team_name}
                                </span>
                              </div>
                              {members.length > 0 && (
                                <p className="text-[11px] text-muted-foreground">
                                  {members.length} Anggota
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              Individu
                            </span>
                          )}
                        </TableCell>

                        {/* Waktu Registrasi */}
                        <TableCell className="py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
                            <span>{formatDateDisplay(reg.created_at)}</span>
                          </div>
                        </TableCell>

                        {/* Bukti Pembayaran / Berkas */}
                        <TableCell className="py-3.5">
                          {reg.file_url ? (
                            <a
                              href={reg.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 font-medium"
                              title="Buka Berkas Bukti Pembayaran di Google Drive"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              <span>Buka Bukti</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">-</span>
                          )}
                        </TableCell>

                        {/* Status Finance */}
                        <TableCell className="py-3.5">
                          <div className="space-y-1">
                            <Badge
                              className={`text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit ${
                                reg.is_verified_finance
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              }`}
                            >
                              {reg.is_verified_finance ? (
                                <>
                                  <CheckCircle2 className="h-3 w-3" /> Valid
                                </>
                              ) : (
                                <>
                                  <Clock className="h-3 w-3" /> Belum Dicek
                                </>
                              )}
                            </Badge>
                            {reg.finance_notes && (
                              <p className="text-[11px] text-muted-foreground truncate max-w-[180px] flex items-center gap-1" title={reg.finance_notes}>
                                <MessageSquare className="h-3 w-3 shrink-0 text-emerald-400/70" />
                                <span>{reg.finance_notes}</span>
                              </p>
                            )}
                          </div>
                        </TableCell>

                        {/* Diverifikasi Oleh */}
                        <TableCell className="py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                          {reg.verified_finance_by_name ? (
                            <div>
                              <p className="font-medium text-foreground">{reg.verified_finance_by_name}</p>
                              {reg.verified_finance_at && (
                                <p className="text-[10px] text-muted-foreground/70">
                                  {formatDateDisplay(reg.verified_finance_at)}
                                </p>
                              )}
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>

                        {/* Aksi */}
                        <TableCell className="py-3.5 pr-6 text-right sticky right-0 bg-[#0F121A] group-hover:bg-[#141824] z-10 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.5)] border-l border-border/40 transition-colors">
                          <div className="flex items-center justify-start gap-1.5">
                            {/* Tombol Detail */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDetailData(reg)}
                              className="h-8 px-2.5 bg-input/40 hover:bg-white/10 border-border/50 text-foreground text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Lihat Detail Pendaftaran & Pembayaran"
                            >
                              <Eye className="h-3.5 w-3.5 text-blue-400" />
                              <span className="hidden sm:inline">Detail</span>
                            </Button>

                            {/* Tombol Verifikasi Pembayaran */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setVerifyData(reg)}
                              className={`h-8 px-2.5 bg-input/40 hover:bg-white/10 border-border/50 text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
                                reg.is_verified_finance
                                  ? "text-amber-400 hover:text-amber-300"
                                  : "text-emerald-400 hover:text-emerald-300"
                              }`}
                              title={
                                reg.is_verified_finance
                                  ? "Batalkan Verifikasi Pembayaran"
                                  : "Verifikasi Pembayaran Valid"
                              }
                            >
                              {reg.is_verified_finance ? (
                                <>
                                  <XCircle className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">Batal Verif</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">Verifikasi</span>
                                </>
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <div>
              Menampilkan Halaman <span className="font-bold text-foreground">{page}</span> dari{" "}
              <span className="font-bold text-foreground">{totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="h-8 px-3 rounded-lg border-border/50 bg-input/20 hover:bg-input/40 text-xs cursor-pointer"
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="h-8 px-3 rounded-lg border-border/50 bg-input/20 hover:bg-input/40 text-xs cursor-pointer"
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Modals */}
      <FinanceVerifyModal
        open={!!verifyData}
        onClose={() => setVerifyData(null)}
        data={verifyData}
      />
      <FinanceDetailModal
        open={!!detailData}
        onClose={() => setDetailData(null)}
        data={detailData}
      />
    </div>
  );
}
