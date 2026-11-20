"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useAdminSubmissions,
  usePatchSubmissionFinalist,
} from "@/hooks/admin-use-submission";
import { getAllSubmissions } from "@/services/admin-submission.service";
import { getAllUserCategories } from "@/services/user-category.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  Trophy,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Layers,
  Users,
  RefreshCw,
  XCircle,
  X,
  User,
  Link2,
  Loader2,
  Award,
} from "lucide-react";
import SubmissionDetailModal from "../pengumpulan/SubmissionDetailModal";

const PAGE_SIZE = 10;
const MAX_FINALIST_PER_CATEGORY = 10;

export default function AdminManageFinalistPage() {
  // Filters & Pagination State
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState("ALL");
  const [phase, setPhase] = useState("ALL");
  const [finalistFilter, setFinalistFilter] = useState("ALL");
  const [pendingId, setPendingId] = useState(null);

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

  // Categories Dropdown Data
  const {
    data: categories = [],
    isLoading: loadingCategories,
  } = useQuery({
    queryKey: ["user-categories-dropdown"],
    queryFn: getAllUserCategories,
    staleTime: 1000 * 60 * 10,
  });

  // Query Submissions (hanya karya berstatus APPROVED yang dapat menjadi Top 10 Finalist)
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useAdminSubmissions({
    page,
    limit: PAGE_SIZE,
    category_id: categoryId === "ALL" ? undefined : categoryId,
    status: "APPROVED",
    is_finalist: finalistFilter === "ALL" ? undefined : finalistFilter,
    search: searchTerm || undefined,
    phase: phase === "ALL" ? undefined : phase,
    sort_by: "updated_at",
    order: "desc",
  });

  // Dedicated lightweight finalist stats query (accurate regardless of total submission count)
  const { data: finalistStatsData, refetch: refetchFinalistStats } = useQuery({
    queryKey: ["admin-finalist-stats"],
    queryFn: () => getAllSubmissions({ page: 1, limit: 100, status: "APPROVED", is_finalist: "true" }),
    staleTime: 1000 * 60 * 2,
  });

  // Lightweight total count query (only 1 row needed to read meta.total of APPROVED submissions)
  const { data: totalStatsData, refetch: refetchTotalStats } = useQuery({
    queryKey: ["admin-finalist-total-count"],
    queryFn: () => getAllSubmissions({ page: 1, limit: 1, status: "APPROVED" }),
    staleTime: 1000 * 60 * 2,
  });

  // Mutation
  const patchFinalist = usePatchSubmissionFinalist();

  const submissions = useMemo(() => {
    return Array.isArray(data?.submissions) ? data.submissions : [];
  }, [data?.submissions]);

  const meta = data?.meta || {
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 1,
    total: 0,
  };

  const totalItems = meta.total || 0;
  const totalPages = meta.totalPages || 1;

  // Calculate finalist statistics overall & per category
  const { totalSubmissions, totalFinalists, finalistCountByCategory } = useMemo(() => {
    const finalistList = Array.isArray(finalistStatsData?.submissions)
      ? finalistStatsData.submissions
      : [];
    const total = totalStatsData?.meta?.total ?? totalItems;
    const counts = {};

    for (const sub of finalistList) {
      if (sub.is_finalist) {
        const catKey = String(sub.category_id || sub.category?.category_id || "");
        if (catKey) {
          counts[catKey] = (counts[catKey] || 0) + 1;
        }
      }
    }

    return {
      totalSubmissions: total,
      totalFinalists: finalistStatsData?.meta?.total ?? finalistList.length,
      finalistCountByCategory: counts,
    };
  }, [finalistStatsData, totalStatsData, totalItems]);

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

  const renderStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit">
            <CheckCircle2 className="h-3 w-3" /> APPROVED
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit">
            <Clock className="h-3 w-3" /> PENDING
          </Badge>
        );
      case "REVISION":
        return (
          <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit">
            <Clock className="h-3 w-3" /> REVISION
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit">
            <XCircle className="h-3 w-3" /> REJECTED
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs border-border/50">
            {status || "PENDING"}
          </Badge>
        );
    }
  };

  const handleToggleFinalist = (sub, nextChecked) => {
    if (pendingId) return;
    setPendingId(sub.submission_id);
    patchFinalist.mutate(
      {
        id: sub.submission_id,
        is_finalist: Boolean(nextChecked),
      },
      {
        onSettled: () => {
          setPendingId(null);
        },
      }
    );
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setCategoryId("ALL");
    setFinalistFilter("ALL");
    setPhase("ALL");
    setPage(1);
  };

  const handleRefreshAll = () => {
    refetch();
    refetchFinalistStats();
    refetchTotalStats();
  };

  const hasActiveFilters =
    searchTerm ||
    categoryId !== "ALL" ||
    finalistFilter !== "ALL" ||
    phase !== "ALL";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Admin Panel</span>
            <span>/</span>
            <span className="text-foreground font-medium">Manage Finalist</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Trophy className="h-7 w-7 text-[#FED700]" />
            <span>Kelola Top 10 Finalist</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Centang karya peserta yang lolos menjadi Top 10 Finalist di setiap kategori lomba untuk ditampilkan pada halaman Show It.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap justify-end">
          <Button
            variant="outline"
            onClick={handleRefreshAll}
            disabled={isFetching}
            className="h-10 px-4 rounded-xl border-border/50 bg-input/20 hover:bg-input/40 text-foreground text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            <span>Refresh</span>
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
              <p className="text-xs text-muted-foreground">Total Karya Approved</p>
              <p className="text-xl font-bold text-foreground">{totalSubmissions}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#FED700]">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Finalist Terpilih</p>
              <p className="text-xl font-bold text-foreground">{totalFinalists}</p>
            </div>
          </CardContent>
        </Card>

        {categories.map((cat) => {
          const catCount = finalistCountByCategory[String(cat.category_id)] || 0;
          const isFull = catCount >= MAX_FINALIST_PER_CATEGORY;
          return (
            <Card
              key={cat.category_id}
              className={`bg-[#0F121A]/80 rounded-2xl ${
                isFull ? "border-emerald-500/40" : "border-border/40"
              }`}
            >
              <CardContent className="p-4 flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isFull
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                      : "bg-purple-500/10 border border-purple-500/20 text-purple-400"
                  }`}
                >
                  <Award className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground truncate">
                    Finalist {cat.slug || cat.category_name || cat.name}
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    {catCount}{" "}
                    <span className="text-xs font-medium text-muted-foreground">
                      / {MAX_FINALIST_PER_CATEGORY}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Table Card */}
      <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl overflow-hidden shadow-xl">
        <CardHeader className="p-4 sm:p-6 border-b border-border/40">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-3">
            {/* Search Box */}
            <div className="relative flex-1 min-w-xs max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari judul karya, nama tim, atau peserta..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 pr-8 h-9 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground truncate"
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

            {/* Filter Group */}
            <div className="flex flex-wrap items-center sm:justify-end gap-2">
              {/* Filter Tahap */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground whitespace-nowrap hidden md:inline">
                  Tahap:
                </span>
                <Select
                  value={phase}
                  onValueChange={(val) => {
                    setPhase(val);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-9 w-40 sm:w-44 bg-input/40 border-border/50 rounded-xl text-xs text-foreground">
                    <SelectValue placeholder="Semua Tahap" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141824] border-border/50 text-foreground">
                    <SelectItem value="ALL">Semua Tahap</SelectItem>
                    <SelectItem value="FINAL">Final Submission</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter Kategori */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground whitespace-nowrap hidden md:inline">
                  Kategori:
                </span>
                <Select
                  value={categoryId}
                  onValueChange={(val) => {
                    setCategoryId(val);
                    setPage(1);
                  }}
                  disabled={loadingCategories}
                >
                  <SelectTrigger className="h-9 w-40 sm:w-44 bg-input/40 border-border/50 rounded-xl text-xs text-foreground">
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141824] border-border/50 text-foreground">
                    <SelectItem value="ALL">Semua Kategori</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.category_id} value={String(cat.category_id)}>
                        {cat.category_name || cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filter Finalist */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground whitespace-nowrap hidden md:inline">
                  Finalist:
                </span>
                <Select
                  value={finalistFilter}
                  onValueChange={(val) => {
                    setFinalistFilter(val);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-9 w-36 sm:w-40 bg-input/40 border-amber-500/30 rounded-xl text-xs text-foreground">
                    <SelectValue placeholder="Semua Karya" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141824] border-border/50 text-foreground">
                    <SelectItem value="ALL">Semua Karya</SelectItem>
                    <SelectItem value="true">Top 10 Finalist</SelectItem>
                    <SelectItem value="false">Bukan Finalist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Active Filter Badges */}
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
              {categoryId !== "ALL" && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Kategori:{" "}
                  {categories.find((c) => String(c.category_id) === String(categoryId))
                    ?.category_name || categoryId}
                  <button
                    type="button"
                    onClick={() => setCategoryId("ALL")}
                    className="hover:text-purple-200 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              )}
              {finalistFilter !== "ALL" && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Finalist: {finalistFilter === "true" ? "Top 10 Finalist" : "Bukan Finalist"}
                  <button
                    type="button"
                    onClick={() => setFinalistFilter("ALL")}
                    className="hover:text-amber-100 ml-0.5"
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
                Gagal memuat data pengumpulan karya.
              </p>
              <Button
                size="sm"
                onClick={handleRefreshAll}
                className="bg-[#E01C20] hover:bg-[#c4181c] text-xs font-semibold rounded-xl"
              >
                Coba Lagi
              </Button>
            </div>
          ) : submissions.length === 0 ? (
            <div className="py-16 px-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-border/40 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <Trophy className="h-8 w-8 text-[#FED700]/60" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                {hasActiveFilters
                  ? "Tidak ada karya yang cocok"
                  : "Belum ada submission karya"}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {hasActiveFilters
                  ? "Coba ubah kata kunci pencarian atau ganti filter kategori/finalist."
                  : "Belum ada peserta yang mengumpulkan karya pada kompetisi."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/40 hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 pl-6 bg-white/[0.02]">
                      Peserta & Tim
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Kategori Lomba
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Judul Karya / Proyek
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Status
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Tampil di Show It
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Status Finalist
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Waktu Edit Terakhir
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 pr-6 text-right bg-[#141824] sticky right-0 z-20 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.5)] border-l border-border/40">
                      Aksi / Checklist Finalist
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((sub) => {
                    const isFinalist = Boolean(sub.is_finalist);
                    const isRowMutating = pendingId === sub.submission_id;
                    const rowCatId = String(sub.category_id || sub.category?.category_id || "");
                    const catFinalistCount = finalistCountByCategory[rowCatId] || 0;
                    const isEligible = sub.status === "APPROVED" && Boolean(sub.is_verified);
                    const isQuotaReached = !isFinalist && catFinalistCount >= MAX_FINALIST_PER_CATEGORY;
                    const isSelectDisabled = !isFinalist && (!isEligible || isQuotaReached);

                    return (
                      <TableRow
                        key={sub.submission_id}
                        className={`group transition-colors border-b border-border/30 ${
                          isFinalist
                            ? "bg-amber-500/[0.04] hover:bg-amber-500/[0.08]"
                            : "hover:bg-white/[0.02]"
                        }`}
                      >
                        {/* Peserta & Tim */}
                        <TableCell className="py-3.5 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-border/40 flex items-center justify-center text-foreground font-bold text-xs flex-shrink-0 select-none">
                              {sub.registration?.user?.name || sub.user?.name ? (
                                (sub.registration?.user?.name || sub.user?.name)
                                  .charAt(0)
                                  .toUpperCase()
                              ) : (
                                <User className="h-4 w-4" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground text-xs sm:text-sm truncate max-w-[150px] sm:max-w-[200px]">
                                {sub.registration?.user?.name || sub.user?.name || "Tanpa Nama"}
                              </p>
                              <p className="text-[11px] text-muted-foreground truncate max-w-[150px] sm:max-w-[200px]">
                                {sub.registration?.user?.email || sub.user?.email || "-"}
                              </p>
                              {(sub.registration?.team_name || sub.team_name) && (
                                <p className="text-[11px] text-purple-400 font-medium truncate max-w-[150px] sm:max-w-[200px] flex items-center gap-1 mt-0.5">
                                  <Users className="h-3 w-3 inline flex-shrink-0" />
                                  <span>{sub.registration?.team_name || sub.team_name}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* Kategori Lomba */}
                        <TableCell className="py-3.5">
                          <Badge
                            variant="outline"
                            className="text-xs px-2.5 py-0.5 rounded-lg border-border/50 bg-white/[0.02] text-foreground"
                          >
                            {sub.registration?.category?.category_name ||
                              sub.category?.category_name ||
                              sub.category?.name ||
                              "-"}
                          </Badge>
                        </TableCell>

                        {/* Judul Karya / Proyek */}
                        <TableCell className="py-3.5 max-w-[220px]">
                          <div className="space-y-1">
                            <p
                              className="font-semibold text-foreground text-xs sm:text-sm truncate"
                              title={sub.project_name || sub.title}
                            >
                              {sub.project_name || sub.title || "-"}
                            </p>
                            {sub.sub_theme && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {sub.sub_theme.split(",").map((themeItem, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-block text-[10px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded px-1.5 py-0.5 truncate max-w-full"
                                    title={themeItem.trim()}
                                  >
                                    {themeItem.trim()}
                                  </span>
                                ))}
                              </div>
                            )}
                            {sub.links && sub.links.length > 0 && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-blue-400">
                                <Link2 className="h-3 w-3" />
                                <span>{sub.links.length} Tautan Berkas</span>
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="py-3.5">
                          {renderStatusBadge(sub.status)}
                        </TableCell>

                        {/* Tampil di Show It */}
                        <TableCell className="py-3.5">
                          {sub.is_verified ? (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                              <CheckCircle2 className="h-3 w-3" /> Ditampilkan
                            </Badge>
                          ) : (
                            <Badge className="bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                              Tidak
                            </Badge>
                          )}
                        </TableCell>

                        {/* Status Finalist */}
                        <TableCell className="py-3.5">
                          {isFinalist ? (
                            <Badge className="bg-[#FED700]/15 text-[#FED700] border border-[#FED700]/40 text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit font-semibold">
                              <Trophy className="h-3 w-3" /> Top 10 Finalist
                            </Badge>
                          ) : (
                            <Badge className="bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 text-[11px] px-2.5 py-0.5 rounded-full w-fit">
                              Peserta
                            </Badge>
                          )}
                        </TableCell>

                        {/* Waktu Edit Terakhir */}
                        <TableCell className="py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
                            <span>{formatDateDisplay(sub.updated_at)}</span>
                          </div>
                        </TableCell>

                        {/* Aksi / Checklist Finalist */}
                        <TableCell className="py-3.5 pr-6 text-right sticky right-0 bg-[#0F121A] group-hover:bg-[#141824] z-10 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.5)] border-l border-border/40 transition-colors">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDetailData(sub)}
                              className="h-8 px-2.5 bg-input/40 hover:bg-white/10 border-border/50 text-foreground text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Lihat Detail Karya"
                            >
                              <Eye className="h-3.5 w-3.5 text-blue-400" />
                              <span className="hidden sm:inline">Detail</span>
                            </Button>

                            <label
                              title={
                                !isFinalist && !isEligible
                                  ? "Karya harus berstatus APPROVED dan ditampilkan di Show It terlebih dahulu"
                                  : isQuotaReached
                                    ? `Kuota Top 10 Finalist kategori ini sudah penuh (${catFinalistCount}/${MAX_FINALIST_PER_CATEGORY})`
                                    : isFinalist
                                      ? "Hapus dari Top 10 Finalist"
                                      : "Tandai sebagai Top 10 Finalist"
                              }
                              className={`inline-flex items-center gap-2 h-8 px-3 rounded-xl border text-xs font-medium select-none transition-all ${
                                isFinalist
                                  ? "bg-[#FED700]/15 border-[#FED700]/50 text-[#FED700] hover:bg-[#FED700]/25 cursor-pointer"
                                  : isSelectDisabled
                                    ? "bg-white/[0.02] border-border/30 text-muted-foreground/50 cursor-not-allowed"
                                    : "bg-input/40 border-border/50 text-foreground hover:bg-white/10 cursor-pointer"
                              }`}
                            >
                              {isRowMutating ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Checkbox
                                  checked={isFinalist}
                                  disabled={Boolean(pendingId) || isSelectDisabled}
                                  onCheckedChange={(checked) =>
                                    handleToggleFinalist(sub, checked === true)
                                  }
                                  className="border-white/30 data-[state=checked]:bg-[#FED700] data-[state=checked]:border-[#FED700] data-[state=checked]:text-black"
                                />
                              )}
                              <span>{isFinalist ? "Finalist" : "Pilih Finalist"}</span>
                            </label>
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
              submission {hasActiveFilters && "(hasil filter)"}
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

      {/* Modal Detail Submission */}
      <SubmissionDetailModal
        open={!!detailData}
        onClose={() => setDetailData(null)}
        data={detailData}
      />
    </div>
  );
}
