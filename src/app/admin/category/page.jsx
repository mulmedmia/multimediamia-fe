"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { getSafeImageUrl } from "@/lib/image-loader";
import {
  useAdminCategories,
  useCreateAdminCategory,
  useUpdateAdminCategory,
  useDeleteAdminCategory,
  useToggleAdminCategorySubmission,
} from "@/hooks/admin-use-categories";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  DialogFooter,
  DialogDescription,
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
  Trophy,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  Layers,
  Users,
  Image as ImageIcon,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  MessageCircle,
} from "lucide-react";
import CategoryForm from "./CategoryForm";

const PAGE_SIZE = 8;

export default function AdminCategoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal States
  const [openCreate, setOpenCreate] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [toggleCategory, setToggleCategory] = useState(null);

  const { data, isLoading, isError, refetch } = useAdminCategories({
    limit: PAGE_SIZE,
    page,
    search: search || undefined,
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });

  const createMutation = useCreateAdminCategory(() => setOpenCreate(false));
  const updateMutation = useUpdateAdminCategory(() => setEditData(null));
  const deleteMutation = useDeleteAdminCategory(() => {
    setDeleteId(null);
    setDeletingCategory(null);
  });
  const toggleMutation = useToggleAdminCategorySubmission(() => setToggleCategory(null));

  const categories = data?.categories || [];
  const totalPages = data?.meta?.totalPages || 1;

  // Helper formatting date display
  const formatDateDisplay = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Helper info status fase pengumpulan karya
  const getSubmissionPhaseInfo = (category) => {
    const now = new Date();
    const prelim = category.preliminary_deadline
      ? new Date(category.preliminary_deadline)
      : (category.deadline ? new Date(category.deadline) : null);
    const final = category.final_deadline
      ? new Date(category.final_deadline)
      : prelim;

    const isOpen = category.is_submission_open !== false;
    const isRevision = !!category.allow_revision;

    if (!isOpen) {
      return {
        label: "Ditutup (Admin)",
        color: "bg-red-500/15 border-red-500/30 text-red-400",
        phase: "CLOSED_MANUAL",
      };
    }

    if (final && now > final) {
      return {
        label: "Selesai (Final Berakhir)",
        color: "bg-zinc-500/15 border-zinc-500/30 text-zinc-400",
        phase: "FINAL_EXPIRED",
      };
    }

    if (prelim && now > prelim && !isRevision) {
      return {
        label: "Sementara Selesai (Menunggu Perbaikan)",
        color: "bg-amber-500/15 border-amber-500/30 text-amber-400",
        phase: "WAITING_REVISION",
      };
    }

    if (isRevision) {
      return {
        label: "Fase Perbaikan (Dibuka)",
        color: "bg-purple-500/15 border-purple-500/30 text-purple-400",
        phase: "REVISION_OPEN",
      };
    }

    return {
      label: "Karya Sementara (Dibuka)",
      color: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
      phase: "PRELIMINARY_OPEN",
    };
  };

  // Quick statistics calculation
  const stats = useMemo(() => {
    const total = data?.meta?.total ?? categories.length;
    const verified = categories.filter((c) => c.status === "VERIFIED").length;
    const notVerified = categories.filter((c) => c.status === "NOT_VERIFIED").length;
    const group = categories.filter((c) => c.team_type === "GROUP").length;
    return { total, verified, notVerified, group };
  }, [categories, data?.meta?.total]);

  const handleOpenDelete = (category) => {
    setDeleteId(category.category_id);
    setDeletingCategory(category);
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Admin Panel</span>
            <span>/</span>
            <span className="text-foreground font-medium">Kategori Lomba</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Trophy className="h-7 w-7 text-[#E01C20]" />
            <span>Kelola Kategori Lomba</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Buat, edit, dan kelola perlombaan serta panduan teknis kompetisi MIA 2026.
          </p>
        </div>

        <Button
          onClick={() => setOpenCreate(true)}
          className="bg-gradient-to-r from-[#FF5722] to-[#E01C20] hover:from-[#e04515] hover:to-[#c4181c] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-red-900/30 h-10 px-4 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Kategori Baru</span>
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
              <p className="text-xs text-muted-foreground">Total Kategori</p>
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
              <p className="text-xs text-muted-foreground">Terverifikasi</p>
              <p className="text-xl font-bold text-foreground">{stats.verified}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Belum Verifikasi</p>
              <p className="text-xl font-bold text-foreground">{stats.notVerified}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Kategori Tim</p>
              <p className="text-xl font-bold text-foreground">{stats.group}</p>
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
                placeholder="Cari kategori / nama lomba..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearch(input);
                    setPage(1);
                  }
                }}
                className="pl-9 h-9 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground"
              />
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
                <SelectTrigger className="h-9 w-40 bg-input/40 border-border/50 rounded-xl text-xs text-foreground">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#141824] border-border/50 text-foreground">
                  <SelectItem value="ALL">Semua Status</SelectItem>
                  <SelectItem value="VERIFIED">VERIFIED</SelectItem>
                  <SelectItem value="NOT_VERIFIED">NOT_VERIFIED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
                Gagal memuat data kategori lomba.
              </p>
              <Button
                size="sm"
                onClick={() => refetch()}
                className="bg-[#E01C20] hover:bg-[#c4181c] text-xs font-semibold rounded-xl"
              >
                Coba Lagi
              </Button>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Trophy className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <p className="text-sm font-semibold text-foreground">
                Belum ada kategori lomba
              </p>
              <p className="text-xs text-muted-foreground">
                Klik tombol &quot;Tambah Kategori Baru&quot; untuk membuat kategori perlombaan pertama.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/40 hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 pl-6 bg-white/[0.02]">
                      Banner
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Kategori & Judul Lomba
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Penyelenggara
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Timeline & Batas Karya
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Status Pengumpulan
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">
                      Tipe Tim
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
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 pr-6 text-right sticky right-0 bg-[#141824] z-20 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.5)] border-l border-border/40">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow
                      key={category.category_id}
                      className="group border-border/40 hover:bg-white/5 transition-colors"
                    >
                      {/* Banner Image */}
                      <TableCell className="py-3.5 pl-6">
                        <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                          {category.image ? (
                            <Image
                              src={getSafeImageUrl(category.image)}
                              alt={category.name || category.slug || "Category"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-muted-foreground/40" />
                          )}
                        </div>
                      </TableCell>

                      {/* Nama Perlombaan & Slug */}
                      <TableCell className="max-w-xs">
                        <p className="text-sm font-semibold text-foreground line-clamp-1">
                          {category.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono line-clamp-1">
                          {category.slug || category.category_name}
                        </p>
                      </TableCell>

                      {/* Organizer */}
                      <TableCell>
                        <span className="text-xs text-foreground/80 font-medium">
                          {category.organizer || "MIA UPNVJ"}
                        </span>
                      </TableCell>

                      {/* Timeline / Batas Karya */}
                      <TableCell>
                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-3 w-3 text-amber-400 flex-shrink-0" />
                            <span>Sementara:</span>
                            <span className="text-foreground font-semibold">
                              {formatDateDisplay(category.preliminary_deadline || category.deadline)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-3 w-3 text-[#E01C20] flex-shrink-0" />
                            <span>Final:</span>
                            <span className="text-foreground font-semibold">
                              {formatDateDisplay(category.final_deadline || category.deadline)}
                            </span>
                          </div>
                          {category.batch_1_start && category.batch_1_end && (
                            <p className="text-[11px] text-muted-foreground/80 pt-0.5">
                              Batch 1: {formatDateDisplay(category.batch_1_start)} - {formatDateDisplay(category.batch_1_end)}
                            </p>
                          )}
                          {category.batch_2_start && category.batch_2_end && (
                            <p className="text-[11px] text-muted-foreground/80 pt-0.5">
                              Batch 2: {formatDateDisplay(category.batch_2_start)} - {formatDateDisplay(category.batch_2_end)}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* Status Pengumpulan */}
                      <TableCell>
                        {(() => {
                          const phaseInfo = getSubmissionPhaseInfo(category);
                          return (
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${phaseInfo.color}`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              <span>{phaseInfo.label}</span>
                            </span>
                          );
                        })()}
                      </TableCell>

                      {/* Team Type */}
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            category.team_type === "GROUP"
                              ? "bg-purple-500/15 border border-purple-500/30 text-purple-400"
                              : "bg-blue-500/15 border border-blue-500/30 text-blue-400"
                          }`}
                        >
                          {category.team_type === "GROUP" ? "Kelompok" : "Individu"}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        {category.status === "VERIFIED" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Terverifikasi</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            <AlertCircle className="h-3 w-3" />
                            <span>Belum Verifikasi</span>
                          </span>
                        )}
                      </TableCell>

                      {/* Created By */}
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {category.created_by_name || "-"}
                      </TableCell>

                      {/* Updated By */}
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {category.updated_by_name || "-"}
                      </TableCell>

                      {/* Action Buttons */}
                      <TableCell className="pr-4.5 text-right sticky right-0 bg-[#0F121A] group-hover:bg-[#141824] z-10 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.5)] border-l border-border/40 transition-colors">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle Buka/Tutup Pengumpulan */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setToggleCategory(category)}
                            title={
                              category.is_submission_open === false
                                ? "Buka Pengumpulan Karya"
                                : "Tutup Pengumpulan Karya"
                            }
                            className={`h-8 w-8 p-0 rounded-lg cursor-pointer ${
                              category.is_submission_open === false
                                ? "hover:bg-emerald-500/20 text-emerald-400"
                                : "hover:bg-amber-500/20 text-amber-400"
                            }`}
                          >
                            {category.is_submission_open === false ? (
                              <Unlock className="h-4 w-4" />
                            ) : (
                              <Lock className="h-4 w-4" />
                            )}
                          </Button>

                          {category.file_url && (
                            <a
                              href={category.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Buka Guidebook"
                            >
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 rounded-lg hover:bg-white/10 hover:text-white cursor-pointer"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </a>
                          )}

                          {category.whatsapp_group_url && (
                            <a
                              href={category.whatsapp_group_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Buka Grup WhatsApp"
                            >
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 rounded-lg hover:bg-emerald-500/20 text-emerald-400 cursor-pointer"
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            </a>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditData(category)}
                            title="Edit Kategori"
                            className="h-8 w-8 p-0 rounded-lg hover:bg-white/10 hover:text-white cursor-pointer"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenDelete(category)}
                            title="Hapus Kategori"
                            className="h-8 w-8 p-0 rounded-lg hover:bg-red-500/20 text-red-400 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
              <p>
                Halaman <span className="text-foreground font-semibold">{page}</span> dari{" "}
                <span className="text-foreground font-semibold">{totalPages}</span> (Total{" "}
                <span className="text-foreground font-semibold">{data?.meta?.total || categories.length}</span> kategori)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-xl h-8 px-3 text-xs bg-input/40 border-border/50 text-foreground cursor-pointer disabled:opacity-40"
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-xl h-8 px-3 text-xs bg-input/40 border-border/50 text-foreground cursor-pointer disabled:opacity-40"
                >
                  Berikutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="bg-[#0A0D14] border border-border/50 text-[#FFF9F5] max-w-2xl sm:max-w-[38rem] max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg sm:text-xl font-bold flex items-center gap-2.5 text-foreground">
              <Trophy className="h-5 w-5 text-[#E01C20]" />
              <span>Tambah Kategori Baru</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Tambahkan kategori perlombaan baru ke dalam sistem kompetisi MIA 2026.
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            type="create"
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
        <DialogContent className="bg-[#0A0D14] border border-border/50 text-[#FFF9F5] max-w-3xl sm:max-w-[38rem] max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg sm:text-xl font-bold flex items-center gap-2.5 text-foreground">
              <Edit2 className="h-5 w-5 text-[#E01C20]" />
              <span>Edit Kategori Lomba</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Perbarui detail kategori, jadwal pendaftaran, atau banner panduan lomba.
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            type="edit"
            initial={editData}
            onSubmit={(payload) =>
              updateMutation.mutate({ ...payload, id: editData?.category_id })
            }
            isLoading={updateMutation.isPending}
            onCancel={() => setEditData(null)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(null);
            setDeletingCategory(null);
          }
        }}
      >
        <DialogContent className="bg-[#0A0D14] border border-border/50 text-[#FFF9F5] max-w-md rounded-2xl p-6 shadow-2xl">
          <DialogHeader className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <DialogTitle className="text-lg font-bold text-center">
              Hapus Kategori Lomba
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground text-center">
              Apakah Anda yakin ingin menghapus kategori lomba{" "}
              <span className="text-foreground font-semibold">
                &quot;{deletingCategory?.name || deletingCategory?.slug || deletingCategory?.category_name}&quot;
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                setDeleteId(null);
                setDeletingCategory(null);
              }}
              className="rounded-xl text-xs text-muted-foreground hover:text-white"
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold px-4 cursor-pointer"
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus Kategori"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Toggle Buka/Tutup Pengumpulan Confirmation Dialog */}
      <Dialog
        open={!!toggleCategory}
        onOpenChange={(open) => {
          if (!open) setToggleCategory(null);
        }}
      >
        <DialogContent className="bg-[#0A0D14] border border-border/50 text-[#FFF9F5] max-w-md rounded-2xl p-6 shadow-2xl">
          <DialogHeader className="space-y-3">
            <div
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center mx-auto ${
                toggleCategory?.is_submission_open === false
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-400"
              }`}
            >
              {toggleCategory?.is_submission_open === false ? (
                <Unlock className="h-6 w-6" />
              ) : (
                <Lock className="h-6 w-6" />
              )}
            </div>
            <DialogTitle className="text-lg font-bold text-center">
              {toggleCategory?.is_submission_open === false
                ? "Buka Pengumpulan Karya?"
                : "Tutup Pengumpulan Karya?"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground text-center">
              Kategori:{" "}
              <span className="text-foreground font-semibold">
                &quot;{toggleCategory?.name || toggleCategory?.slug}&quot;
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 text-xs text-muted-foreground space-y-2 leading-relaxed">
            {toggleCategory?.is_submission_open === false ? (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl space-y-2 text-emerald-200">
                <p className="font-semibold text-emerald-300">
                  Pengumpulan karya akan dibuka kembali untuk peserta.
                </p>
                {toggleCategory?.preliminary_deadline &&
                  new Date() > new Date(toggleCategory.preliminary_deadline) ? (
                    <p className="text-[11px] text-emerald-100/90 leading-relaxed">
                      💡 Karena batas waktu karya sementara telah berakhir, pembukaan ini otomatis mengaktifkan <strong>Fase Perbaikan</strong>. Peserta dapat memperbarui karya hingga batas akhir pengumpulan final.
                    </p>
                  ) : (
                    <p className="text-[11px] text-emerald-100/80">
                      Peserta dapat mengunggah karya sementara dan mengedit berkas yang telah dikumpulkan.
                    </p>
                  )}
              </div>
            ) : (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-xl space-y-1.5 text-amber-200">
                <p className="font-semibold text-amber-300">
                  Pengumpulan karya akan dikunci sementara.
                </p>
                <p className="text-[11px] text-amber-100/80 leading-relaxed">
                  Peserta tidak akan dapat mengunggah karya baru maupun mengedit karya yang sudah dikumpulkan sampai Anda membukanya kembali.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => setToggleCategory(null)}
              className="rounded-xl text-xs text-muted-foreground hover:text-white"
            >
              Batal
            </Button>
            <Button
              disabled={toggleMutation.isPending}
              onClick={() => {
                if (!toggleCategory) return;
                toggleMutation.mutate({ id: toggleCategory.category_id });
              }}
              className={`rounded-xl text-white text-xs font-semibold px-4 cursor-pointer ${
                toggleCategory?.is_submission_open === false
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              {toggleMutation.isPending
                ? "Memproses..."
                : toggleCategory?.is_submission_open === false
                ? "Ya, Buka Pengumpulan"
                : "Ya, Tutup Pengumpulan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
