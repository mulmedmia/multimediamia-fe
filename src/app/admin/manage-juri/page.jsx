"use client";

import React, { useState, useMemo } from "react";
import {
  useAdminJuri,
  useCreateJuri,
  useDeleteJuri,
  useUpdateJuriCategory,
} from "@/hooks/admin-use-juri";
import { useAdminCategories } from "@/hooks/admin-use-categories";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  UserLock,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  AlertCircle,
  Layers,
  Users,
  RefreshCw,
  X,
  Clock,
  ShieldCheck,
} from "lucide-react";

const PAGE_SIZE = 10;

export default function ManageJuriPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Modal States
  const [openCreate, setOpenCreate] = useState(false);
  const [editJuri, setEditJuri] = useState(null);
  const [editCategoryId, setEditCategoryId] = useState("");
  const [deleteJuriTarget, setDeleteJuriTarget] = useState(null);

  // Queries
  const { data: juri = [], isLoading, isFetching, isError, refetch } = useAdminJuri();
  const { data: categoriesData } = useAdminCategories({ limit: 100 });
  const categories = categoriesData?.categories || [];

  // Mutations
  const createMutation = useCreateJuri(() => setOpenCreate(false));
  const updateCategoryMutation = useUpdateJuriCategory(() => setEditJuri(null));
  const deleteMutation = useDeleteJuri();

  // Create Form State
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    category_id: "",
  });

  // Client-side filtering
  const filteredJuries = useMemo(() => {
    return juri.filter((j) => {
      const matchSearch =
        !searchInput.trim() ||
        j.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
        j.email?.toLowerCase().includes(searchInput.toLowerCase()) ||
        (j.category_name || j.category?.category_name || "")
          .toLowerCase()
          .includes(searchInput.toLowerCase());

      const matchCategory =
        categoryFilter === "ALL" ||
        String(j.category_id) === String(categoryFilter);

      return matchSearch && matchCategory;
    });
  }, [juri, searchInput, categoryFilter]);

  // Pagination
  const totalItems = filteredJuries.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;
  const paginatedJuries = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredJuries.slice(start, start + PAGE_SIZE);
  }, [filteredJuries, page]);

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = juri.length;
    const assignedCategories = new Set(
      juri.map((j) => j.category_id).filter(Boolean)
    ).size;
    const assigned = juri.filter((j) => !!j.category_id).length;
    const unassigned = juri.filter((j) => !j.category_id).length;
    return { total, assignedCategories, assigned, unassigned };
  }, [juri]);

  // Handle Create Submit
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(createForm, {
      onSuccess: () => {
        setCreateForm({ name: "", email: "", password: "", category_id: "" });
      },
    });
  };

  // Handle Edit Open
  const handleOpenEdit = (j) => {
    setEditJuri(j);
    setEditCategoryId(j.category_id ? String(j.category_id) : "");
  };

  // Handle Edit Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editJuri || !editCategoryId) return;
    updateCategoryMutation.mutate({
      id: editJuri.users_id,
      category_id: editCategoryId,
    });
  };

  // Handle Confirm Delete
  const handleConfirmDelete = () => {
    if (!deleteJuriTarget) return;
    deleteMutation.mutate(deleteJuriTarget.users_id, {
      onSuccess: () => setDeleteJuriTarget(null),
    });
  };

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
    setCategoryFilter("ALL");
    setPage(1);
  };

  const hasActiveFilters = searchInput || categoryFilter !== "ALL";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Admin Panel</span>
            <span>/</span>
            <span className="text-foreground font-medium">Manage Juri</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <UserLock className="h-7 w-7 text-[#E01C20]" />
            <span>Kelola Juri Lomba</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Tambah akun juri penilai, atur penugasan kategori lomba, dan kelola hak akses penilaian MIA 2026.
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
            <span>Tambah Juri Baru</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Juri</p>
              <p className="text-xl font-bold text-foreground">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Kategori Terisi</p>
              <p className="text-xl font-bold text-foreground">{stats.assignedCategories}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Juri Ditugaskan</p>
              <p className="text-xl font-bold text-foreground">{stats.assigned}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Belum Ditugaskan</p>
              <p className="text-xl font-bold text-foreground">{stats.unassigned}</p>
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
                placeholder="Cari nama, email, atau kategori juri..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setPage(1);
                }}
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
                <SelectTrigger className="h-9 w-44 sm:w-48 bg-input/40 border-border/50 rounded-xl text-xs text-foreground">
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent className="bg-[#141824] border-border/50 text-foreground">
                  <SelectItem value="ALL">Semua Kategori</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.category_id} value={String(c.category_id)}>
                      {c.category_name || c.name}
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
              {searchInput && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Cari: &ldquo;{searchInput}&rdquo;
                  <button
                    type="button"
                    onClick={() => setSearchInput("")}
                    className="hover:text-blue-200 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              )}
              {categoryFilter !== "ALL" && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Kategori:{" "}
                  {categories.find((c) => String(c.category_id) === String(categoryFilter))
                    ?.category_name || categoryFilter}
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
                Gagal memuat data juri lomba.
              </p>
              <Button
                size="sm"
                onClick={() => refetch()}
                className="bg-[#E01C20] hover:bg-[#c4181c] text-xs font-semibold rounded-xl"
              >
                Coba Lagi
              </Button>
            </div>
          ) : filteredJuries.length === 0 ? (
            /* Empty State */
            <div className="py-16 px-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-border/40 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <UserLock className="h-8 w-8 text-[#E01C20]/60" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                {hasActiveFilters ? "Tidak ada juri yang cocok" : "Belum ada akun juri"}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {hasActiveFilters
                  ? "Coba sesuaikan kata kunci pencarian atau ganti filter kategori."
                  : "Belum ada akun juri penilai yang didaftarkan ke sistem."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/40 hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 pl-6 bg-white/[0.02]">
                      Profil Juri
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Kategori Ditugaskan
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Role / Hak Akses
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Waktu Dibuat
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
                  {paginatedJuries.map((j) => (
                    <TableRow
                      key={j.users_id}
                      className="group hover:bg-white/[0.02] transition-colors border-b border-border/30"
                    >
                      {/* Profil Juri */}
                      <TableCell className="py-3.5 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs flex-shrink-0 select-none">
                            {j.name ? j.name.charAt(0).toUpperCase() : "J"}
                          </div>
                          <div className="min-w-0 max-w-[200px] sm:max-w-[280px]">
                            <p className="font-semibold text-foreground text-xs sm:text-sm truncate">
                              {j.name || "Tanpa Nama"}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {j.email || "-"}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Kategori Ditugaskan */}
                      <TableCell className="py-3.5">
                        {j.category_name || j.category?.category_name || j.category?.name ? (
                          <Badge
                            variant="outline"
                            className="text-xs px-2.5 py-0.5 rounded-lg border-purple-500/30 bg-purple-500/10 text-purple-300 font-medium"
                          >
                            {j.category_name || j.category?.category_name || j.category?.name}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            Belum ditugaskan
                          </span>
                        )}
                      </TableCell>

                      {/* Role */}
                      <TableCell className="py-3.5">
                        <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 w-fit font-semibold">
                          <ShieldCheck className="h-3 w-3" /> JURI
                        </Badge>
                      </TableCell>

                      {/* Waktu Dibuat */}
                      <TableCell className="py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
                          <span>{formatDateDisplay(j.created_at)}</span>
                        </div>
                      </TableCell>

                      {/* Created By */}
                      <TableCell className="py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        {j.created_by_name || "-"}
                      </TableCell>

                      {/* Updated By */}
                      <TableCell className="py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        {j.updated_by_name || "-"}
                      </TableCell>

                      {/* Aksi */}
                      <TableCell className="py-3.5 pr-6 text-right sticky right-0 bg-[#0F121A] group-hover:bg-[#141824] z-10 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.5)] border-l border-border/40 transition-colors">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit Kategori Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenEdit(j)}
                            className="h-8 px-2.5 bg-input/40 hover:bg-white/10 border-border/50 text-foreground text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Ubah Kategori Lomba"
                          >
                            <Edit2 className="h-3.5 w-3.5 text-blue-400" />
                            <span className="hidden sm:inline">Kategori</span>
                          </Button>

                          {/* Delete Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteJuriTarget(j)}
                            className="h-8 px-2.5 bg-input/40 hover:bg-red-500/10 hover:border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Hapus Akun Juri"
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
              juri {hasActiveFilters && "(hasil filter)"}
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

      {/* Modal Tambah Juri Baru */}
      <Dialog
        open={openCreate}
        onOpenChange={(val) => {
          if (!val) {
            setCreateForm({ name: "", email: "", password: "", category_id: "" });
          }
          setOpenCreate(val);
        }}
      >
        <DialogContent className="bg-[#0A0D14] border border-border/50 text-[#FFF9F5] max-w-md rounded-2xl p-6 shadow-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
              <UserLock className="h-5 w-5 text-[#E01C20]" />
              <span>Tambah Akun Juri Baru</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Buat akun juri penilai baru dan tugaskan ke kategori lomba.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="create-name" className="text-xs text-muted-foreground font-medium">
                Nama Lengkap Juri <span className="text-[#E01C20]">*</span>
              </Label>
              <Input
                id="create-name"
                placeholder="Contoh: Budi Santoso, M.Kom"
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, name: e.target.value }))
                }
                className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-email" className="text-xs text-muted-foreground font-medium">
                Email Juri <span className="text-[#E01C20]">*</span>
              </Label>
              <Input
                id="create-email"
                type="email"
                placeholder="juri@mia2026.id"
                value={createForm.email}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, email: e.target.value }))
                }
                className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-password" className="text-xs text-muted-foreground font-medium">
                Kata Sandi <span className="text-[#E01C20]">*</span>
              </Label>
              <Input
                id="create-password"
                type="password"
                placeholder="Minimal 6 karakter..."
                value={createForm.password}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, password: e.target.value }))
                }
                className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-medium">
                Kategori Lomba yang Diampu <span className="text-[#E01C20]">*</span>
              </Label>
              <Select
                value={createForm.category_id}
                onValueChange={(val) =>
                  setCreateForm((f) => ({ ...f, category_id: val }))
                }
              >
                <SelectTrigger className="h-10 bg-input/40 border-border/50 rounded-xl text-xs text-foreground">
                  <SelectValue placeholder="Pilih Kategori Lomba" />
                </SelectTrigger>
                <SelectContent className="bg-[#141824] border-border/50 text-foreground">
                  {categories.map((c) => (
                    <SelectItem key={c.category_id} value={String(c.category_id)}>
                      {c.category_name || c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-2 sm:gap-2 pt-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpenCreate(false)}
                className="rounded-xl text-xs text-muted-foreground hover:text-white"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-gradient-to-r from-[#FF5722] to-[#E01C20] hover:from-[#e04515] hover:to-[#c4181c] text-white rounded-xl text-xs font-semibold px-4 cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                {createMutation.isPending ? "Menyimpan..." : "Simpan Akun Juri"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Edit Kategori Juri */}
      <Dialog
        open={!!editJuri}
        onOpenChange={(val) => !val && setEditJuri(null)}
      >
        <DialogContent className="bg-[#0A0D14] border border-border/50 text-[#FFF9F5] max-w-md rounded-2xl p-6 shadow-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
              <Edit2 className="h-5 w-5 text-blue-400" />
              <span>Tugaskan Kategori Juri</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Ubah penugasan kategori perlombaan yang dinilai oleh juri ini.
            </DialogDescription>
          </DialogHeader>

          {/* Juri Info Card */}
          <div className="p-3.5 bg-[#0F121A] border border-border/40 rounded-xl space-y-1 text-xs">
            <p className="font-semibold text-foreground">{editJuri?.name}</p>
            <p className="text-muted-foreground">{editJuri?.email}</p>
          </div>

          <form onSubmit={handleEditSubmit} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-medium">
                Pilih Kategori Lomba Baru <span className="text-[#E01C20]">*</span>
              </Label>
              <Select
                value={editCategoryId}
                onValueChange={setEditCategoryId}
              >
                <SelectTrigger className="h-10 bg-input/40 border-border/50 rounded-xl text-xs text-foreground">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent className="bg-[#141824] border-border/50 text-foreground">
                  {categories.map((c) => (
                    <SelectItem key={c.category_id} value={String(c.category_id)}>
                      {c.category_name || c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-2 sm:gap-2 pt-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditJuri(null)}
                className="rounded-xl text-xs text-muted-foreground hover:text-white"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={updateCategoryMutation.isPending}
                className="bg-gradient-to-r from-[#FF5722] to-[#E01C20] hover:from-[#e04515] hover:to-[#c4181c] text-white rounded-xl text-xs font-semibold px-4 cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                {updateCategoryMutation.isPending ? "Menyimpan..." : "Perbarui Kategori"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteJuriTarget}
        onOpenChange={(open) => !open && setDeleteJuriTarget(null)}
      >
        <DialogContent className="bg-[#0A0D14] border border-border/50 text-[#FFF9F5] max-w-md rounded-2xl p-6 shadow-2xl">
          <DialogHeader className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <DialogTitle className="text-lg font-bold text-center">
              Hapus Akun Juri
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground text-center">
              Apakah Anda yakin ingin menghapus akun juri{" "}
              <span className="text-foreground font-semibold">
                &quot;{deleteJuriTarget?.name}&quot;
              </span>
              ? Tindakan ini akan mencabut seluruh hak akses juri tersebut.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => setDeleteJuriTarget(null)}
              className="rounded-xl text-xs text-muted-foreground hover:text-white"
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold px-4 cursor-pointer"
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus Juri"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}