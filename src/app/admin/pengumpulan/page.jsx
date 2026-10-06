"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useAdminSubmissions,
  usePatchSubmissionStatus,
} from "@/hooks/admin-use-submission";
import { getAllSubmissions } from "@/services/admin-submission.service";
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
  UploadCloud,
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
  Star,
  ShieldCheck,
  Link2,
  FileSpreadsheet,
} from "lucide-react";
import SubmissionDetailModal from "./SubmissionDetailModal";
import SubmissionStatusModal from "./SubmissionStatusModal";
import { exportToExcel } from "@/lib/export-excel";
import { useAuthContext } from "@/providers/AuthProvider";
import { toast } from "sonner";

const PAGE_SIZE = 10;

export default function AdminPengumpulanPage() {
  const { user } = useAuthContext();

  // Filters & Pagination State
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Export State
  const [isExporting, setIsExporting] = useState(false);

  // Modal State
  const [detailData, setDetailData] = useState(null);
  const [statusData, setStatusData] = useState(null);

  const [currentStatus, setCurrentStatus] = useState("PENDING");
  const [currentIsVerified, setCurrentIsVerified] = useState(false);

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

  // Query Submissions
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
    status: statusFilter === "ALL" ? undefined : statusFilter,
    search: searchTerm || undefined,
  });

  // Global Stats Query (fetch lightweight list for top summary cards)
  const { data: statsData } = useQuery({
    queryKey: ["admin-submissions-overall-stats"],
    queryFn: () => getAllSubmissions({ page: 1, limit: 1000 }),
    staleTime: 1000 * 60 * 2,
  });

  // Mutations
  const patchStatus = usePatchSubmissionStatus();

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

  // Calculate statistics
  const stats = useMemo(() => {
    const allList = statsData?.submissions || submissions;
    const total = statsData?.meta?.total ?? totalItems;
    const approved = allList.filter((s) => s.status === "APPROVED").length;
    const pending = allList.filter((s) => s.status === "PENDING").length;
    const revisionOrRejected = allList.filter(
      (s) => s.status === "REVISION" || s.status === "REJECTED"
    ).length;
    return { total, approved, pending, revisionOrRejected };
  }, [statsData, submissions, totalItems]);

  // Helper date display
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

  // Helper status badge styling
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

  // Handle open status modal
  const handleOpenStatus = (sub) => {
    setStatusData(sub);
    const initialStatus = sub.status || "PENDING";
    setCurrentStatus(initialStatus);
    setCurrentIsVerified(initialStatus === "APPROVED" ? Boolean(sub.is_verified) : false);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setCategoryId("ALL");
    setStatusFilter("ALL");
    setPage(1);
  };

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      toast.info("Sedang menyiapkan data pengumpulan karya untuk diekspor...");

      const res = await getAllSubmissions({
        page: 1,
        limit: 1000,
        category_id: categoryId === "ALL" ? undefined : categoryId,
        status: statusFilter === "ALL" ? undefined : statusFilter,
        search: searchTerm || undefined,
      });

      const list = Array.isArray(res?.submissions) ? res.submissions : [];

      if (list.length === 0) {
        toast.warning("Tidak ada data pengumpulan karya untuk diekspor.");
        return;
      }

      const columns = [
        { header: "No", key: "no", width: 8, align: "center" },
        { header: "Waktu Pengumpulan", key: "created_at", width: 22, align: "center" },
        { header: "Nama Peserta", key: "user_name", width: 25 },
        { header: "Email", key: "user_email", width: 26 },
        { header: "Nama Tim", key: "team_name", width: 20 },
        { header: "Kategori Lomba", key: "category", width: 22 },
        { header: "Judul Karya / Proyek", key: "project_name", width: 32 },
        { header: "Status Karya", key: "status", width: 16, align: "center" },
        { header: "Tampil di Show It", key: "is_verified", width: 18, align: "center" },
        { header: "Draft Proposal (Docs)", key: "proposal_url", width: 35 },
        { header: "GitHub Utama", key: "github_url", width: 35 },
        { header: "Deployment / Live", key: "deployment_url", width: 35 },
        { header: "Desain Figma", key: "figma_url", width: 35 },
        { header: "Demo YouTube", key: "youtube_url", width: 35 },
      ];

      const rows = list.map((item, index) => {
        const links = Array.isArray(item.links) ? item.links : [];
        const getLinkUrl = (type) => {
          const found = links.find((l) => l.link_type?.toUpperCase() === type.toUpperCase());
          return found?.url || "-";
        };

        const figmaLink =
          getLinkUrl("FIGMA") !== "-"
            ? getLinkUrl("FIGMA")
            : getLinkUrl("FIGMA_PROTOTYPE");

        return {
          no: index + 1,
          created_at: formatDateDisplay(item.created_at),
          user_name: item.user?.name || "-",
          user_email: item.user?.email || "-",
          team_name: item.team_name || "Individu",
          category: item.category?.category_name || item.category?.name || "-",
          project_name: item.project_name || item.title || "-",
          status: item.status || "PENDING",
          is_verified: item.is_verified ? "Ya" : "Tidak",
          proposal_url: getLinkUrl("PROPOSAL"),
          github_url: getLinkUrl("GITHUB"),
          deployment_url: getLinkUrl("DEPLOYMENT"),
          figma_url: figmaLink,
          youtube_url: getLinkUrl("YOUTUBE"),
        };
      });

      await exportToExcel({
        pageTitle: "PENGUMPULAN",
        accountName: user?.name || user?.email || "Admin MIA",
        fileName: `MIA2026_Data_Pengumpulan_Karya_${new Date().toISOString().slice(0, 10)}`,
        columns,
        data: rows,
      });

      toast.success(`Berhasil mengekspor ${rows.length} data pengumpulan karya!`);
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Gagal mengekspor data: " + (err.message || "Terjadi kesalahan"));
    } finally {
      setIsExporting(false);
    }
  };

  const hasActiveFilters = searchTerm || categoryId !== "ALL" || statusFilter !== "ALL";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Admin Panel</span>
            <span>/</span>
            <span className="text-foreground font-medium">Pengumpulan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <UploadCloud className="h-7 w-7 text-[#E01C20]" />
            <span>Kelola Pengumpulan Karya</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Pantau karya peserta, periksa berkas submission dan evaluasi juri, serta perbarui status karya.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
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
              <p className="text-xs text-muted-foreground">Total Submission</p>
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
              <p className="text-xs text-muted-foreground">Disetujui (Approved)</p>
              <p className="text-xl font-bold text-foreground">{stats.approved}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Menunggu Review</p>
              <p className="text-xl font-bold text-foreground">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Revisi / Ditolak</p>
              <p className="text-xl font-bold text-foreground">{stats.revisionOrRejected}</p>
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
                placeholder="Cari judul karya, nama tim, atau peserta..."
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

            {/* Filter Group */}
            <div className="flex flex-wrap items-center gap-2">
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
                        {cat.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filter Status */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground whitespace-nowrap hidden md:inline">
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
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="APPROVED">APPROVED</SelectItem>
                    <SelectItem value="REVISION">REVISION</SelectItem>
                    <SelectItem value="REJECTED">REJECTED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Filter Badges Active */}
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
              {statusFilter !== "ALL" && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Status: {statusFilter}
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
                Gagal memuat data pengumpulan karya.
              </p>
              <Button
                size="sm"
                onClick={() => refetch()}
                className="bg-[#E01C20] hover:bg-[#c4181c] text-xs font-semibold rounded-xl"
              >
                Coba Lagi
              </Button>
            </div>
          ) : submissions.length === 0 ? (
            /* Empty State */
            <div className="py-16 px-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-border/40 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <UploadCloud className="h-8 w-8 text-[#E01C20]/60" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                {hasActiveFilters
                  ? "Tidak ada karya yang cocok"
                  : "Belum ada submission karya"}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {hasActiveFilters
                  ? "Coba ubah kata kunci pencarian atau ganti filter kategori/status."
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
                      Tampilkan di Show It
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Waktu Submit
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
                  {submissions.map((sub) => (
                    <TableRow
                      key={sub.submission_id}
                      className="group hover:bg-white/[0.02] transition-colors border-b border-border/30"
                    >
                      {/* Peserta & Tim */}
                      <TableCell className="py-3.5 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-border/40 flex items-center justify-center text-foreground font-bold text-xs flex-shrink-0 select-none">
                            {sub.user?.name ? (
                              sub.user.name.charAt(0).toUpperCase()
                            ) : (
                              <User className="h-4 w-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground text-xs sm:text-sm truncate max-w-[150px] sm:max-w-[200px]">
                              {sub.user?.name || "Tanpa Nama"}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate max-w-[150px] sm:max-w-[200px]">
                              {sub.user?.email || "-"}
                            </p>
                            {sub.team_name && (
                              <p className="text-[11px] text-purple-400 font-medium truncate max-w-[150px] sm:max-w-[200px] flex items-center gap-1 mt-0.5">
                                <Users className="h-3 w-3 inline flex-shrink-0" />
                                <span>{sub.team_name}</span>
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
                          {sub.category?.category_name || "-"}
                        </Badge>
                      </TableCell>

                      {/* Judul Karya / Proyek */}
                      <TableCell className="py-3.5 max-w-[220px]">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-foreground text-xs sm:text-sm truncate" title={sub.project_name || sub.title}>
                            {sub.project_name || sub.title || "-"}
                          </p>
                          {sub.links && sub.links.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-blue-400">
                              <Link2 className="h-3 w-3" />
                              <span>{sub.links.length} Tautan Berkas</span>
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Status Evaluasi */}
                      <TableCell className="py-3.5">
                        {renderStatusBadge(sub.status)}
                      </TableCell>

                      {/* Tampilkan di Show It */}
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

                      {/* Waktu Submit */}
                      <TableCell className="py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
                          <span>{formatDateDisplay(sub.created_at)}</span>
                        </div>
                      </TableCell>

                      {/* Created By */}
                      <TableCell className="py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        {sub.created_by_name || "-"}
                      </TableCell>

                      {/* Updated By */}
                      <TableCell className="py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        {sub.updated_by_name || "-"}
                      </TableCell>

                      {/* Aksi */}
                      <TableCell className="py-3.5 pr-6 text-right sticky right-0 bg-[#0F121A] group-hover:bg-[#141824] z-10 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.5)] border-l border-border/40 transition-colors">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Tombol Detail */}
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

                          {/* Tombol Status */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenStatus(sub)}
                            className="h-8 px-2.5 bg-input/40 hover:bg-white/10 border-border/50 text-foreground text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Ubah Status & Penayangan Show It"
                          >
                            <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
                            <span className="hidden sm:inline">Status</span>
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

      {/* Modal Status Submission */}
      <SubmissionStatusModal
        open={!!statusData}
        onClose={() => setStatusData(null)}
        data={statusData}
        status={currentStatus}
        setStatus={setCurrentStatus}
        is_verified={currentIsVerified}
        setIsVerified={setCurrentIsVerified}
        isLoading={patchStatus.isPending}
        onSubmit={() =>
          patchStatus.mutate(
            {
              id: statusData.submission_id,
              status: currentStatus,
              is_verified: currentIsVerified,
            },
            { onSuccess: () => setStatusData(null) }
          )
        }
      />

    </div>
  );
}
