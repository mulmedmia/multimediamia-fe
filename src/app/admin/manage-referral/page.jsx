"use client";

import React, { useState, useEffect } from "react";
import {
  useAdminReferrals,
  useApproveReferral,
  useRejectReferral,
} from "@/hooks/use-referral";
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
  Gift,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Tag,
  RefreshCw,
  X,
  Check,
  Phone,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

export default function ManageReferralPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Dialog State
  const [actionDialog, setActionDialog] = useState({
    isOpen: false,
    type: null, // "APPROVE" | "REJECT"
    item: null,
  });
  const [adminNotes, setAdminNotes] = useState("");

  // Debounce Search
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

  // Query Data
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useAdminReferrals({
    page,
    limit: PAGE_SIZE,
    status: statusFilter,
    search: searchTerm,
  });

  const approveMutation = useApproveReferral();
  const rejectMutation = useRejectReferral();

  const referrals = data?.referrals || [];
  const pagination = data?.pagination || { total: 0, page: 1, totalPages: 1 };
  const stats = data?.stats || { total: 0, pending: 0, approved: 0, rejected: 0 };

  const totalItems = pagination.total || 0;
  const totalPages = pagination.totalPages || 1;

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

  const handleOpenAction = (item, type) => {
    setActionDialog({
      isOpen: true,
      type,
      item,
    });
    setAdminNotes(item.admin_notes || "");
  };

  const handleCloseAction = () => {
    setActionDialog({
      isOpen: false,
      type: null,
      item: null,
    });
    setAdminNotes("");
  };

  const handleConfirmAction = () => {
    if (!actionDialog.item) return;

    const referralLogId = actionDialog.item.referral_log_id;

    if (actionDialog.type === "APPROVE") {
      approveMutation.mutate(
        { referralLogId, adminNotes },
        {
          onSuccess: () => {
            handleCloseAction();
          },
        }
      );
    } else if (actionDialog.type === "REJECT") {
      rejectMutation.mutate(
        { referralLogId, adminNotes },
        {
          onSuccess: () => {
            handleCloseAction();
          },
        }
      );
    }
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setStatusFilter("ALL");
    setPage(1);
  };

  const hasActiveFilters = Boolean(searchTerm) || statusFilter !== "ALL";
  const isPendingAction = approveMutation.isPending || rejectMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Admin Panel</span>
            <span>/</span>
            <span className="text-foreground font-medium">Manage Referral</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Gift className="h-7 w-7 text-[#E01C20]" />
            <span>Manage Referral</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Verifikasi klaim kode referral peserta dan cairkan / batalkan bonus XP tim secara terpusat.
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
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Referral</p>
              <p className="text-xl font-bold text-foreground">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Menunggu ACC</p>
              <p className="text-xl font-bold text-foreground">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Disetujui (ACC)</p>
              <p className="text-xl font-bold text-foreground">{stats.approved}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Dibatalkan</p>
              <p className="text-xl font-bold text-foreground">{stats.rejected}</p>
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
                placeholder="Cari kode referral, tim, atau peserta..."
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

            {/* Filter Status Dropdown */}
            <div className="flex flex-wrap items-center gap-3">
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
                  <SelectTrigger className="h-9 w-40 sm:w-48 bg-input/40 border-border/50 rounded-xl text-xs text-foreground truncate">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141824] border-border/50 text-foreground max-h-64">
                    <SelectItem value="ALL">Semua Status</SelectItem>
                    <SelectItem value="PENDING">Menunggu ACC</SelectItem>
                    <SelectItem value="APPROVED">Disetujui (ACC)</SelectItem>
                    <SelectItem value="REJECTED">Dibatalkan</SelectItem>
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
                    className="hover:text-blue-200 ml-0.5 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              )}
              {statusFilter !== "ALL" && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Status:{" "}
                  {statusFilter === "PENDING"
                    ? "Menunggu ACC"
                    : statusFilter === "APPROVED"
                    ? "Disetujui"
                    : "Dibatalkan"}
                  <button
                    type="button"
                    onClick={() => setStatusFilter("ALL")}
                    className="hover:text-purple-200 ml-0.5 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-6 px-2 text-[11px] text-muted-foreground hover:text-white cursor-pointer"
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
                Gagal memuat data referral. Silakan coba beberapa saat lagi.
              </p>
              <Button
                size="sm"
                onClick={() => refetch()}
                className="bg-[#E01C20] hover:bg-[#c4181c] text-xs font-semibold rounded-xl"
              >
                Coba Lagi
              </Button>
            </div>
          ) : referrals.length === 0 ? (
            <div className="py-16 px-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-border/40 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <Gift className="h-8 w-8 text-[#E01C20]/60" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                {hasActiveFilters
                  ? "Tidak ada data referral yang cocok"
                  : "Belum ada data referral"}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {hasActiveFilters
                  ? "Coba sesuaikan kata kunci pencarian atau ganti filter status."
                  : "Belum ada penggunaan kode referral oleh peserta kompetisi."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/40 hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 pl-6 bg-white/[0.02] w-12 text-center">
                      No
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Kode Referral
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02] min-w-[200px]">
                      Tim Pengundang (Referrer)
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02] min-w-[200px]">
                      Tim Yang Diundang (Referee)
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02] text-center">
                      Reward XP
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02] text-center">
                      Status
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02] min-w-[160px]">
                      Waktu / Verifikator
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 pr-6 text-right bg-[#141824] sticky right-0 z-20 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.5)] border-l border-border/40">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {referrals.map((item, index) => {
                    const rowNum = (page - 1) * PAGE_SIZE + index + 1;
                    const isPending = item.status === "PENDING";
                    const isApproved = item.status === "APPROVED";
                    const isRejected = item.status === "REJECTED";

                    return (
                      <TableRow
                        key={item.referral_log_id}
                        className="group hover:bg-white/[0.02] transition-colors border-b border-border/30"
                      >
                        {/* No */}
                        <TableCell className="py-3.5 pl-6 text-center font-mono text-xs text-muted-foreground">
                          {rowNum}
                        </TableCell>

                        {/* Kode Referral */}
                        <TableCell className="py-3.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono font-bold text-xs">
                            <Tag className="w-3.5 h-3.5" />
                            {item.referral_code}
                          </span>
                        </TableCell>

                        {/* Tim Pengundang (Referrer) */}
                        <TableCell className="py-3.5">
                          <div className="space-y-1">
                            <p className="font-semibold text-foreground text-xs sm:text-sm">
                              {item.referrer?.team_name || item.referrer?.user_name || "Tim Pengundang"}
                            </p>
                            {item.referrer?.category_name && (
                              <Badge className="bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[10px] px-2 py-0.5 rounded-full font-medium">
                                {item.referrer.category_name}
                              </Badge>
                            )}
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground pt-0.5">
                              <span>{item.referrer?.user_name}</span>
                              {item.referrer?.whatsapp_number && (
                                <a
                                  href={`https://wa.me/${item.referrer.whatsapp_number.replace(/[^0-9]/g, "").replace(/^0/, "62")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:text-emerald-300 transition-colors"
                                  title={`Chat WhatsApp dengan ${item.referrer.user_name || "Pengundang"}`}
                                >
                                  <Phone className="w-2.5 h-2.5" />
                                  <span>{item.referrer.whatsapp_number}</span>
                                  <ExternalLink className="w-2 h-2 opacity-60" />
                                </a>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* Tim Yang Diundang (Referee) */}
                        <TableCell className="py-3.5">
                          <div className="space-y-1">
                            <p className="font-semibold text-foreground text-xs sm:text-sm">
                              {item.referee?.team_name || item.referee?.user_name || "Tim Diundang"}
                            </p>
                            {item.referee?.category_name && (
                              <Badge className="bg-purple-500/15 text-purple-400 border border-purple-500/30 text-[10px] px-2 py-0.5 rounded-full font-medium">
                                {item.referee.category_name}
                              </Badge>
                            )}
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground pt-0.5">
                              <span>{item.referee?.user_name}</span>
                              {item.referee?.whatsapp_number && (
                                <a
                                  href={`https://wa.me/${item.referee.whatsapp_number.replace(/[^0-9]/g, "").replace(/^0/, "62")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:text-emerald-300 transition-colors"
                                  title={`Chat WhatsApp dengan ${item.referee.user_name || "Peserta"}`}
                                >
                                  <Phone className="w-2.5 h-2.5" />
                                  <span>{item.referee.whatsapp_number}</span>
                                  <ExternalLink className="w-2 h-2 opacity-60" />
                                </a>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* Reward XP */}
                        <TableCell className="py-3.5 text-center">
                          <div className="inline-flex flex-col gap-1 items-center">
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-[11px]">
                              <Zap className="w-3 h-3 fill-amber-400" />
                              <span>+{item.referrer_xp} XP (Pengundang)</span>
                            </div>
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold text-[11px]">
                              <Zap className="w-3 h-3 fill-cyan-400" />
                              <span>+{item.referee_xp} XP (Diundang)</span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="py-3.5 text-center">
                          {isPending && (
                            <Badge className="bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Menunggu ACC
                            </Badge>
                          )}
                          {isApproved && (
                            <Badge className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Disetujui (ACC)
                            </Badge>
                          )}
                          {isRejected && (
                            <Badge className="bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              Dibatalkan
                            </Badge>
                          )}
                        </TableCell>

                        {/* Waktu & Verifikator */}
                        <TableCell className="py-3.5">
                          <div className="space-y-0.5 text-xs text-muted-foreground">
                            <p>
                              Dibuat:{" "}
                              <span className="text-foreground">
                                {formatDateDisplay(item.created_at)}
                              </span>
                            </p>
                            {item.verified_at && (
                              <p className="text-[11px]">
                                Diverifikasi:{" "}
                                <span className="text-foreground">
                                  {formatDateDisplay(item.verified_at)}
                                </span>{" "}
                                ({item.verifier?.name || "Admin"})
                              </p>
                            )}
                            {item.admin_notes && (
                              <p className="text-[11px] text-amber-300/80 italic line-clamp-1">
                                &ldquo;{item.admin_notes}&rdquo;
                              </p>
                            )}
                          </div>
                        </TableCell>

                        {/* Tombol Aksi */}
                        <TableCell className="py-3.5 pr-6 text-right sticky right-0 bg-[#0F121A] group-hover:bg-[#141824] z-10 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.5)] border-l border-border/40 transition-colors">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            {/* Tombol ACC */}
                            <Button
                              size="sm"
                              onClick={() => handleOpenAction(item, "APPROVE")}
                              disabled={isApproved || isPendingAction}
                              className={cn(
                                "h-8 px-3 rounded-xl text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-all",
                                isApproved
                                  ? "bg-emerald-500/10 text-emerald-500/40 border border-emerald-500/20 cursor-not-allowed"
                                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-950/40"
                              )}
                              title={isApproved ? "Sudah di-ACC" : "Setujui (ACC) dan Cairkan XP"}
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>ACC</span>
                            </Button>

                            {/* Tombol Batal */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenAction(item, "REJECT")}
                              disabled={isRejected || isPendingAction}
                              className={cn(
                                "h-8 px-3 rounded-xl text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-all border",
                                isRejected
                                  ? "border-rose-500/20 text-rose-500/40 cursor-not-allowed"
                                  : "border-rose-500/40 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500"
                              )}
                              title={
                                isRejected
                                  ? "Sudah dibatalkan"
                                  : isApproved
                                  ? "Batalkan dan Tarik Kembali XP"
                                  : "Tolak Referral"
                              }
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Batal</span>
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
              referral {hasActiveFilters && "(hasil filter)"}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isLoading}
                className="h-8 px-3 rounded-xl border-border/50 bg-input/20 text-foreground disabled:opacity-30 cursor-pointer"
              >
                Sebelumnya
              </Button>
              <div className="text-xs px-2 text-foreground font-medium">
                Halaman {page} dari {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || isLoading}
                className="h-8 px-3 rounded-xl border-border/50 bg-input/20 text-foreground disabled:opacity-30 cursor-pointer"
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Confirmation Dialog for ACC & Batal */}
      <Dialog open={actionDialog.isOpen} onOpenChange={(open) => !open && handleCloseAction()}>
        <DialogContent className="bg-[#0A0D14] border border-border/50 text-[#FFF9F5] max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
          <DialogHeader className="space-y-2">
            <div
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center mx-auto border",
                actionDialog.type === "APPROVE"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-400"
              )}
            >
              {actionDialog.type === "APPROVE" ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <AlertCircle className="h-6 w-6" />
              )}
            </div>
            <DialogTitle className="text-lg font-bold text-center text-foreground">
              {actionDialog.type === "APPROVE"
                ? "Setujui (ACC) Referral?"
                : "Batalkan Referral?"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground text-center">
              Kode: <strong className="text-foreground font-mono">{actionDialog.item?.referral_code}</strong>
            </DialogDescription>
          </DialogHeader>

          {/* Detail Summary Box */}
          <div className="p-3.5 bg-[#0F121A] border border-border/40 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between items-center py-0.5 border-b border-border/20">
              <span className="text-muted-foreground">Tim Pengundang:</span>
              <span className="font-semibold text-foreground truncate max-w-[200px]">
                {actionDialog.item?.referrer?.team_name || actionDialog.item?.referrer?.user_name || "-"}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-border/20">
              <span className="text-muted-foreground">Tim Yang Diundang:</span>
              <span className="font-semibold text-foreground truncate max-w-[200px]">
                {actionDialog.item?.referee?.team_name || actionDialog.item?.referee?.user_name || "-"}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-muted-foreground">Kalkulasi XP:</span>
              <span className="font-bold text-amber-400">
                +250 XP (Pengundang) & +100 XP (Diundang)
              </span>
            </div>
          </div>

          {/* Explanation Box */}
          <div
            className={cn(
              "p-3.5 rounded-xl border text-xs space-y-1.5 leading-relaxed",
              actionDialog.type === "APPROVE"
                ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-200"
                : "bg-rose-500/10 border-rose-500/25 text-rose-200"
            )}
          >
            {actionDialog.type === "APPROVE" ? (
              <>
                <p className="font-semibold text-emerald-300">
                  Dampak Tindakan ACC:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-[11px]">
                  <li>XP akan otomatis ditambahkan ke saldo dan leaderboard masing-masing tim (+250 XP pengundang, +100 XP diundang).</li>
                  <li>Status referral akan berubah menjadi <strong>Disetujui (ACC)</strong>.</li>
                </ul>
              </>
            ) : (
              <>
                <p className="font-semibold text-rose-300">
                  Dampak Tindakan Batal:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-[11px]">
                  {actionDialog.item?.status === "APPROVED" ? (
                    <li>
                      Karena sudah pernah di-ACC sebelumnya, saldo tim akan <strong>ditarik kembali sebesar XP yang telah diberikan</strong> (-250 XP & -100 XP).
                    </li>
                  ) : (
                    <li>Klaim referral ini akan ditolak dan tidak ada penambahan XP.</li>
                  )}
                  <li>Status referral akan berubah menjadi <strong>Dibatalkan</strong>.</li>
                </ul>
              </>
            )}
          </div>

          {/* Admin Notes Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Catatan Admin (Opsional):
            </label>
            <Input
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Tambahkan catatan atau alasan jika diperlukan..."
              className="h-9 bg-input/40 border-border/50 rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60"
            />
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCloseAction}
              disabled={isPendingAction}
              className="rounded-xl text-xs font-medium h-9 px-4 border-border/50 bg-input/20 hover:bg-input/40 text-foreground cursor-pointer"
            >
              Tutup
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmAction}
              disabled={isPendingAction}
              className={cn(
                "rounded-xl text-xs font-semibold h-9 px-4 inline-flex items-center gap-1.5 cursor-pointer text-white",
                actionDialog.type === "APPROVE"
                  ? "bg-emerald-600 hover:bg-emerald-500"
                  : "bg-rose-600 hover:bg-rose-500"
              )}
            >
              {isPendingAction ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : actionDialog.type === "APPROVE" ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Konfirmasi ACC</span>
                </>
              ) : (
                <>
                  <X className="w-3.5 h-3.5" />
                  <span>Konfirmasi Batal</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
