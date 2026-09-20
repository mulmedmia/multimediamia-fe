"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useGamifikasiTeams,
  usePatchRegistrationGamification,
} from "@/hooks/admin-use-gamifikasi";
import { useAdminCategories } from "@/hooks/admin-use-categories";
import { getGamifikasiTeams } from "@/services/admin-gamifikasi.service";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Gamepad2,
  Search,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Users,
  RefreshCw,
  X,
  Gem,
  Zap,
  Clock,
  Trophy,
} from "lucide-react";

const PAGE_SIZE = 10;

export default function AdminGamifikasiPage() {
  // Filters & Pagination State
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Modal State
  const [editTeam, setEditTeam] = useState(null);

  const { register, handleSubmit, reset, setValue } = useForm();

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

  // Categories list for dropdown
  const { data: categoriesData } = useAdminCategories({ limit: 100 });
  const categories = categoriesData?.categories || [];

  // Query Teams Gamification
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGamifikasiTeams({
    page,
    limit: PAGE_SIZE,
    search: searchTerm || undefined,
    category_id: categoryFilter === "ALL" ? undefined : categoryFilter,
  });

  // Query Global Stats for top summary cards
  const { data: allStatsData } = useQuery({
    queryKey: ["admin-gamifikasi-overall-stats"],
    queryFn: () => getGamifikasiTeams({ page: 1, limit: 1000 }),
    staleTime: 1000 * 60,
  });

  const patchMutation = usePatchRegistrationGamification();

  const teams = useMemo(() => {
    return Array.isArray(response?.registrations) ? response.registrations : [];
  }, [response?.registrations]);

  const meta = response?.meta || {
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 1,
    total: 0,
  };

  const totalItems = meta.total || 0;
  const totalPages = meta.totalPages || 1;

  // Calculate statistics
  const stats = useMemo(() => {
    const list = allStatsData?.registrations || teams;
    const total = allStatsData?.meta?.total ?? totalItems;
    const totalDiamonds = list.reduce(
      (acc, t) => acc + (Number(t.diamond) || 0),
      0
    );
    const totalXp = list.reduce((acc, t) => acc + (Number(t.xp) || 0), 0);
    const verifiedTeams = list.filter((t) => t.is_verified).length;
    return { total, totalDiamonds, totalXp, verifiedTeams };
  }, [allStatsData, teams, totalItems]);

  // Handle open edit diamond & xp
  const handleOpenEdit = (team) => {
    setEditTeam(team);
    setValue(
      "diamond",
      team.diamond !== undefined && team.diamond !== null ? team.diamond : 0
    );
    setValue("xp", team.xp !== undefined && team.xp !== null ? team.xp : 0);
  };

  // Submit diamond & xp mutation
  const onSubmit = (formData) => {
    if (!editTeam) return;
    patchMutation.mutate(
      {
        id: editTeam.registration_id,
        diamond: Number(formData.diamond),
        xp: Number(formData.xp),
      },
      {
        onSuccess: () => {
          setEditTeam(null);
          reset();
        },
      }
    );
  };

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
    setCategoryFilter("ALL");
    setPage(1);
  };

  const hasActiveFilters = searchTerm || categoryFilter !== "ALL";
  const selectedCategoryObj = categories.find(
    (c) => c.category_id === categoryFilter
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Admin Panel</span>
            <span>/</span>
            <span className="text-foreground font-medium">Gamifikasi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Gamepad2 className="h-7 w-7 text-[#E01C20]" />
            <span>Kelola Gamifikasi Tim</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Kelola saldo Diamond dan perolehan XP untuk seluruh tim terdaftar dalam kompetisi MIA 2026.
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
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Tim Terdaftar</p>
              <p className="text-xl font-bold text-foreground">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Gem className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Diamond Beredar</p>
              <p className="text-xl font-bold text-foreground">
                {stats.totalDiamonds.toLocaleString("id-ID")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Zap className="h-5 w-5 fill-amber-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total XP Terkumpul</p>
              <p className="text-xl font-bold text-foreground">
                {stats.totalXp.toLocaleString("id-ID")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tim Terverifikasi</p>
              <p className="text-xl font-bold text-foreground">{stats.verifiedTeams}</p>
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
                placeholder="Cari nama tim, ketua, atau email..."
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

            {/* Filter Kategori Dropdown */}
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
                <SelectTrigger className="h-9 w-44 sm:w-52 bg-input/40 border-border/50 rounded-xl text-xs text-foreground truncate">
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent className="bg-[#141824] border-border/50 text-foreground max-h-64">
                  <SelectItem value="ALL">Semua Kategori</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.category_id} value={c.category_id}>
                      {c.name || c.category_name}
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
              {categoryFilter !== "ALL" && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Kategori: {selectedCategoryObj?.name || categoryFilter}
                  <button
                    type="button"
                    onClick={() => setCategoryFilter("ALL")}
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
                Gagal memuat data gamifikasi tim pendaftar.
              </p>
              <Button
                size="sm"
                onClick={() => refetch()}
                className="bg-[#E01C20] hover:bg-[#c4181c] text-xs font-semibold rounded-xl"
              >
                Coba Lagi
              </Button>
            </div>
          ) : teams.length === 0 ? (
            /* Empty State */
            <div className="py-16 px-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-border/40 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <Gamepad2 className="h-8 w-8 text-[#E01C20]/60" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                {hasActiveFilters
                  ? "Tidak ada tim yang cocok"
                  : "Belum ada tim terdaftar"}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {hasActiveFilters
                  ? "Coba sesuaikan kata kunci pencarian atau ganti filter kategori."
                  : "Belum ada pendaftaran tim dalam kompetisi."}
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
                      Diamond (Poin)
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Total XP
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Status Verifikasi
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Waktu Registrasi
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
                  {teams.map((team) => (
                    <TableRow
                      key={team.registration_id}
                      className="group hover:bg-white/[0.02] transition-colors border-b border-border/30"
                    >
                      {/* Profil Tim */}
                      <TableCell className="py-3.5 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#E01C20]/15 border border-[#E01C20]/30 flex items-center justify-center text-[#E01C20] font-bold text-xs flex-shrink-0">
                            <Trophy className="h-4 w-4 text-[#FED700]" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground text-xs sm:text-sm truncate max-w-[160px] sm:max-w-[220px]">
                              {team.team_name || "Tanpa Nama Tim"}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate max-w-[160px] sm:max-w-[220px]">
                              Ketua: {team.team_leader_name || team.user?.name || "-"}
                            </p>
                            <p className="text-[10px] text-muted-foreground/70 truncate max-w-[160px] sm:max-w-[220px]">
                              {team.user?.email || "-"}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Kategori Kompetisi */}
                      <TableCell className="py-3.5">
                        <Badge className="bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[11px] px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap">
                          {team.category?.name || team.category?.category_name || "Kompetisi"}
                        </Badge>
                      </TableCell>

                      {/* Poin Diamond */}
                      <TableCell className="py-3.5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold text-xs">
                          <Gem className="h-3.5 w-3.5" />
                          <span>{(team.diamond ?? 0).toLocaleString("id-ID")}</span>
                        </div>
                      </TableCell>

                      {/* Total XP */}
                      <TableCell className="py-3.5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs">
                          <Zap className="h-3.5 w-3.5 fill-amber-400" />
                          <span>{(team.xp ?? 0).toLocaleString("id-ID")} XP</span>
                        </div>
                      </TableCell>

                      {/* Status Verifikasi */}
                      <TableCell className="py-3.5">
                        <Badge
                          className={`text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit ${
                            team.is_verified
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                          }`}
                        >
                          {team.is_verified ? (
                            <>
                              <CheckCircle2 className="h-3 w-3" /> Terverifikasi
                            </>
                          ) : (
                            <>Belum Verif</>
                          )}
                        </Badge>
                      </TableCell>

                      {/* Waktu Registrasi */}
                      <TableCell className="py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
                          <span>{formatDateDisplay(team.created_at)}</span>
                        </div>
                      </TableCell>

                      {/* Created By */}
                      <TableCell className="py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        {team.created_by_name || "-"}
                      </TableCell>

                      {/* Updated By */}
                      <TableCell className="py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        {team.updated_by_name || "-"}
                      </TableCell>

                      {/* Aksi */}
                      <TableCell className="py-3.5 pr-6 text-right sticky right-0 bg-[#0F121A] group-hover:bg-[#141824] z-10 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.5)] border-l border-border/40 transition-colors">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenEdit(team)}
                          className="h-8 px-2.5 bg-input/40 hover:bg-white/10 border-border/50 text-foreground text-xs rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Edit Diamond & XP"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-blue-400" />
                          <span className="hidden sm:inline">Edit Diamond & XP</span>
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
              tim {hasActiveFilters && "(hasil filter)"}
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
                Halaman {page} dari {totalPages}
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

      {/* Edit Diamond & XP Modal */}
      <Dialog
        open={!!editTeam}
        onOpenChange={(open) => !open && setEditTeam(null)}
      >
        <DialogContent className="bg-[#0A0D14] border border-border/50 text-[#FFF9F5] max-w-md rounded-2xl p-6 shadow-2xl">
          <DialogHeader className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto">
              <Gamepad2 className="h-6 w-6" />
            </div>
            <DialogTitle className="text-lg font-bold text-center text-foreground">
              Edit Diamond & XP Tim
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground text-center">
              Sesuaikan saldo Diamond dan total XP tim untuk kebutuhan leaderboard dan penukaran hadiah.
            </DialogDescription>
          </DialogHeader>

          {/* Team Summary Card */}
          <div className="p-3.5 bg-[#0F121A] border border-border/40 rounded-xl space-y-1.5 text-xs">
            <div className="flex justify-between items-center py-0.5 border-b border-border/20">
              <span className="text-muted-foreground">Nama Tim:</span>
              <span className="font-semibold text-foreground truncate max-w-[200px]">
                {editTeam?.team_name || "Tanpa Nama Tim"}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-border/20">
              <span className="text-muted-foreground">Ketua Tim:</span>
              <span className="text-muted-foreground truncate max-w-[200px]">
                {editTeam?.team_leader_name || editTeam?.user?.name || "-"}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-border/20">
              <span className="text-muted-foreground">Kategori Lomba:</span>
              <Badge className="bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[10px] px-2 py-0.5 rounded font-medium">
                {editTeam?.category?.name || editTeam?.category?.category_name || "-"}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-muted-foreground">Email Akun:</span>
              <span className="text-muted-foreground truncate max-w-[200px]">
                {editTeam?.user?.email || "-"}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
            {/* Input Diamond */}
            <div className="space-y-1.5">
              <Label
                htmlFor="diamond"
                className="text-xs text-muted-foreground font-medium flex items-center justify-between"
              >
                <span>Saldo Diamond Baru</span>
                <span className="text-cyan-400 font-bold">
                  Saat ini: {(editTeam?.diamond ?? 0).toLocaleString("id-ID")}
                </span>
              </Label>
              <div className="relative">
                <Gem className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
                <Input
                  id="diamond"
                  type="number"
                  min="0"
                  placeholder="Contoh: 100"
                  {...register("diamond", { required: true, min: 0 })}
                  className="pl-9 h-10 bg-input/40 border-border/50 rounded-xl text-sm text-foreground"
                  required
                />
              </div>
            </div>

            {/* Input XP */}
            <div className="space-y-1.5">
              <Label
                htmlFor="xp"
                className="text-xs text-muted-foreground font-medium flex items-center justify-between"
              >
                <span>Total XP Baru</span>
                <span className="text-amber-400 font-bold">
                  Saat ini: {(editTeam?.xp ?? 0).toLocaleString("id-ID")} XP
                </span>
              </Label>
              <div className="relative">
                <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400 fill-amber-400" />
                <Input
                  id="xp"
                  type="number"
                  min="0"
                  placeholder="Contoh: 500"
                  {...register("xp", { required: true, min: 0 })}
                  className="pl-9 h-10 bg-input/40 border-border/50 rounded-xl text-sm text-foreground"
                  required
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditTeam(null)}
                disabled={patchMutation.isPending}
                className="rounded-xl text-xs text-muted-foreground hover:text-white"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={patchMutation.isPending}
                className="bg-gradient-to-r from-[#FF5722] to-[#E01C20] hover:from-[#e04515] hover:to-[#c4181c] text-white rounded-xl text-xs font-semibold px-4 cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                {patchMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
