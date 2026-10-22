"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  useAdminMissions,
  useCreateAdminMission,
  useUpdateAdminMission,
  useDeleteAdminMission,
  useAdminMissionSubmissions,
  useReviewAdminSubmission,
} from "@/hooks/admin-use-missions";
import { useAdminCategories } from "@/hooks/admin-use-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Target,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Clock,
  Zap,
  Gem,
  CheckCircle2,
  XCircle,
  Clock3,
  AlertCircle,
  FileText,
  UserCheck,
  Send,
  Calendar,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import MissionForm from "./MissionForm";

export default function AdminMisiPage() {
  // Fetch Categories for Filter
  const { data: categoriesData } = useAdminCategories({ limit: 100 });
  const categories = categoriesData?.categories || [];

  // State Filters for Tab Daftar Misi
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Fetch Missions
  const {
    data: missionsData,
    isLoading,
    isError,
    refetch,
  } = useAdminMissions({
    limit: 100,
    search: search || undefined,
    status: statusFilter === "ALL" ? undefined : statusFilter,
    category_id: categoryFilter === "ALL" ? undefined : categoryFilter,
  });

  const missions = missionsData?.missions || (Array.isArray(missionsData) ? missionsData : []);

  // Mutations
  const createMutation = useCreateAdminMission();
  const updateMutation = useUpdateAdminMission();
  const deleteMutation = useDeleteAdminMission();

  // Modal Create / Edit State
  const [openCreate, setOpenCreate] = useState(false);
  const [editingMission, setEditingMission] = useState(null);

  // Modal Delete State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingMission, setDeletingMission] = useState(null);

  // Tab State
  const [activeTab, setActiveTab] = useState("missions"); // "missions" | "submissions"

  // Submissions State
  const [selectedMissionForSubmissions, setSelectedMissionForSubmissions] = useState(null);
  const [submissionStatusFilter, setSubmissionStatusFilter] = useState("ALL");
  const [submissionSearch, setSubmissionSearch] = useState("");
  const [debouncedSubmissionSearch, setDebouncedSubmissionSearch] = useState("");
  const [submissionCategoryFilter, setSubmissionCategoryFilter] = useState("ALL");
  const [submissionPage, setSubmissionPage] = useState(1);
  const [submissionLimit, setSubmissionLimit] = useState(10);

  // Debounce submission search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSubmissionSearch(submissionSearch.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [submissionSearch]);

  // Sub-modal Review State
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [reviewData, setReviewData] = useState({
    status: "APPROVED",
    awarded_xp: 50,
    awarded_diamond: 10,
    admin_feedback: "",
    registration_id: "",
  });

  const reviewMutation = useReviewAdminSubmission(
    selectedMissionForSubmissions?.mission_id || "all"
  );

  // Helper format date display
  const formatDateDisplay = (dateString) => {
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

  // Open Create Dialog
  const handleOpenCreate = () => {
    setOpenCreate(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (mission) => {
    setEditingMission(mission);
  };

  // Open Delete Dialog
  const handleOpenDelete = (mission) => {
    setDeletingMission(mission);
    setIsDeleteOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deletingMission) return;
    deleteMutation.mutate(deletingMission.mission_id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        setDeletingMission(null);
      },
    });
  };

  // Switch to Submissions Tab with selected mission
  const handleOpenSubmissions = (mission) => {
    setSelectedMissionForSubmissions(mission);
    if (mission?.category_id) {
      setSubmissionCategoryFilter(mission.category_id);
    } else {
      setSubmissionCategoryFilter("ALL");
    }
    setSubmissionStatusFilter("ALL");
    setSubmissionPage(1);
    setActiveTab("submissions");
  };

  // Available missions for submissions dropdown (filtered by submissionCategoryFilter)
  const availableMissionsForSubmissions = useMemo(() => {
    if (submissionCategoryFilter === "ALL") return missions;
    if (submissionCategoryFilter === "GLOBAL") return missions.filter((m) => !m.category_id);
    return missions.filter((m) => m.category_id === submissionCategoryFilter);
  }, [missions, submissionCategoryFilter]);

  // Submissions Query
  const {
    data: submissionsData,
    isLoading: isSubmissionsLoading,
    isError: isSubmissionsError,
    refetch: refetchSubmissions,
  } = useAdminMissionSubmissions(
    selectedMissionForSubmissions?.mission_id || "all",
    {
      page: submissionPage,
      limit: submissionLimit,
      status: submissionStatusFilter === "ALL" ? undefined : submissionStatusFilter,
      search: debouncedSubmissionSearch || undefined,
      category_id: submissionCategoryFilter === "ALL" ? undefined : submissionCategoryFilter,
    }
  );

  const submissions =
    submissionsData?.submissions || (Array.isArray(submissionsData) ? submissionsData : []);
  const totalSubmissions = submissionsData?.meta?.total ?? submissions.length;
  const totalSubmissionPages =
    submissionsData?.meta?.totalPages || Math.ceil(totalSubmissions / submissionLimit) || 1;

  // Determine which mission limits apply for review modal
  const targetReviewMission = useMemo(() => {
    return (
      selectedMissionForSubmissions ||
      selectedSubmission?.mission ||
      missions.find((m) => m.mission_id === selectedSubmission?.mission_id) ||
      null
    );
  }, [selectedMissionForSubmissions, selectedSubmission, missions]);

  // Open Review Dialog for a submission
  const handleOpenReview = (submission) => {
    if (submission.status === "REJECTED") {
      toast.error("Pengumpulan misi yang sudah ditolak tidak dapat diedit kembali!");
      return;
    }
    if (submission.status === "APPROVED") {
      toast.info("Pengumpulan misi yang sudah disetujui tidak dapat diedit kembali.");
      return;
    }

    setSelectedSubmission(submission);
    const missionRef =
      selectedMissionForSubmissions ||
      submission.mission ||
      missions.find((m) => m.mission_id === submission.mission_id);

    const defaultRegId =
      submission.registration_id ||
      submission.registration?.registration_id ||
      submission.user_registrations?.[0]?.registration_id ||
      "";

    setReviewData({
      status: "APPROVED",
      awarded_xp:
        submission.awarded_xp ||
        missionRef?.max_xp ||
        missionRef?.min_xp ||
        50,
      awarded_diamond:
        submission.awarded_diamond ||
        missionRef?.max_diamond ||
        missionRef?.min_diamond ||
        10,
      admin_feedback: submission.admin_feedback || "",
      registration_id: defaultRegId,
    });
    setIsReviewOpen(true);
  };

  // Submit Review (ACC or Reject)
  const handleReviewAction = (statusToSet) => {
    if (selectedSubmission?.status === "REJECTED") {
      toast.error("Pengumpulan misi yang sudah ditolak tidak dapat diedit kembali!");
      setIsReviewOpen(false);
      return;
    }
    if (selectedSubmission?.status === "APPROVED") {
      toast.error("Pengumpulan misi yang sudah disetujui tidak dapat diedit kembali!");
      setIsReviewOpen(false);
      return;
    }

    const missionRef = targetReviewMission;

    if (statusToSet === "APPROVED" && missionRef) {
      const minXp = missionRef.min_xp ?? 0;
      const maxXp = missionRef.max_xp ?? 999999;
      const minDia = missionRef.min_diamond ?? 0;
      const maxDia = missionRef.max_diamond ?? 999999;

      if (Number(reviewData.awarded_xp) < minXp || Number(reviewData.awarded_xp) > maxXp) {
        toast.error(`XP yang diberikan harus berada di rentang ${minXp} - ${maxXp}!`);
        return;
      }
      if (Number(reviewData.awarded_diamond) < minDia || Number(reviewData.awarded_diamond) > maxDia) {
        toast.error(`Diamond yang diberikan harus berada di rentang ${minDia} - ${maxDia}!`);
        return;
      }
    }

    const payload = {
      status: statusToSet,
      awarded_xp: statusToSet === "APPROVED" ? Number(reviewData.awarded_xp) : undefined,
      awarded_diamond: statusToSet === "APPROVED" ? Number(reviewData.awarded_diamond) : undefined,
      admin_feedback: reviewData.admin_feedback?.trim() || undefined,
      registration_id: reviewData.registration_id || undefined,
    };

    reviewMutation.mutate(
      {
        submissionId: selectedSubmission.submission_id,
        data: payload,
      },
      {
        onSuccess: () => {
          setIsReviewOpen(false);
          setSelectedSubmission(null);
        },
      }
    );
  };

  // Calculate pending submissions count
  const pendingCount = useMemo(() => {
    return submissions.filter((s) => s.status === "PENDING").length;
  }, [submissions]);

  // Calculate quick stats
  const stats = useMemo(() => {
    const total = missions.length;
    const active = missions.filter((m) => m.status === "ACTIVE").length;
    const draft = missions.filter((m) => m.status === "DRAFT").length;
    const expired = missions.filter((m) => m.status === "EXPIRED" || new Date(m.deadline) < new Date()).length;
    return { total, active, draft, expired };
  }, [missions]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Admin Panel</span>
            <span>/</span>
            <span className="text-foreground font-medium">Misi Harian</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Target className="h-7 w-7 text-[#E01C20]" />
            <span>Kelola Misi Harian</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Buat, kelola tugas harian, dan evaluasi hasil pengumpulan peserta untuk memberikan XP & Diamond.
          </p>
        </div>

        {activeTab === "missions" && (
          <Button
            onClick={handleOpenCreate}
            className="bg-gradient-to-r from-[#FF5722] to-[#E01C20] hover:from-[#e04515] hover:to-[#c4181c] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-red-900/30 h-10 px-4 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Misi Baru</span>
          </Button>
        )}
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#10141E] border border-border/50 p-1 rounded-xl h-11 inline-flex">
          <TabsTrigger
            value="missions"
            className="rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold data-[state=active]:bg-[#E01C20] data-[state=active]:text-white transition-all flex items-center gap-2 cursor-pointer"
          >
            <Target className="h-4 w-4" />
            <span>Daftar Misi</span>
            <Badge className="ml-1 bg-white/10 text-white border-0 text-[10px] px-1.5 py-0 h-4">
              {missions.length}
            </Badge>
          </TabsTrigger>

          <TabsTrigger
            value="submissions"
            className="rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold data-[state=active]:bg-[#E01C20] data-[state=active]:text-white transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserCheck className="h-4 w-4" />
            <span>Pengumpulan Peserta</span>
            {pendingCount > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {pendingCount} Pending
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="missions" className="space-y-6 outline-none">

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Misi</p>
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
              <p className="text-xs text-muted-foreground">Misi Aktif</p>
              <p className="text-xl font-bold text-foreground">{stats.active}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Misi Draft</p>
              <p className="text-xl font-bold text-foreground">{stats.draft}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Kadaluarsa</p>
              <p className="text-xl font-bold text-foreground">{stats.expired}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl overflow-hidden">
        <CardHeader className="p-4 sm:p-6 border-b border-border/40">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari judul / deskripsi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Filter Kategori */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Kategori:</span>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-9 w-40 sm:w-44 bg-input/40 border-border/50 rounded-xl text-xs text-foreground">
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
                <span className="text-xs text-muted-foreground whitespace-nowrap">Status:</span>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 w-36 bg-input/40 border-border/50 rounded-xl text-xs text-foreground">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141824] border-border/50 text-foreground">
                    <SelectItem value="ALL">Semua Status</SelectItem>
                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                    <SelectItem value="DRAFT">DRAFT</SelectItem>
                    <SelectItem value="EXPIRED">EXPIRED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full bg-white/5 rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <div className="p-8 text-center space-y-3">
              <AlertCircle className="h-8 w-8 text-[#E01C20] mx-auto" />
              <p className="text-sm text-muted-foreground">Gagal memuat data misi.</p>
              <Button size="sm" onClick={() => refetch()} className="bg-[#E01C20] text-xs">
                Coba Lagi
              </Button>
            </div>
          ) : missions.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Target className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <p className="text-sm font-semibold text-foreground">Belum ada misi harian</p>
              <p className="text-xs text-muted-foreground">
                Klik tombol &quot;Tambah Misi Baru&quot; untuk membuat misi harian pertama.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/40 hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 pl-6 bg-white/[0.02]">Judul Misi</TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">Deadline</TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">Hadiah (XP & Diamond)</TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">Panduan Docs</TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">Status</TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02] whitespace-nowrap">Created By</TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02] whitespace-nowrap">Updated By</TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 pr-6 text-right sticky right-0 bg-[#141824] z-20 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.5)] border-l border-border/40">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {missions.map((mission) => {
                    const isPastDeadline = new Date(mission.deadline) < new Date();

                    return (
                      <TableRow
                        key={mission.mission_id}
                        className="group border-border/40 hover:bg-white/5 transition-colors"
                      >
                        <TableCell className="max-w-xs py-3.5 pl-6">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-sm font-semibold text-foreground line-clamp-1">
                              {mission.title}
                            </p>
                            {mission.category?.name ? (
                              <Badge className="bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[10px] px-1.5 py-0 rounded font-medium">
                                {mission.category.name}
                              </Badge>
                            ) : (
                              <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] px-1.5 py-0 rounded font-medium">
                                🌐 Semua Kategori
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {mission.description}
                          </p>
                        </TableCell>

                        <TableCell className="py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 text-amber-400" />
                            <span className={isPastDeadline ? "text-red-400 font-medium" : ""}>
                              {formatDateDisplay(mission.deadline)}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-amber-400 font-semibold flex items-center gap-1">
                              <Zap className="h-3 w-3 fill-amber-400" />
                              {mission.min_xp === mission.max_xp
                                ? `${mission.min_xp} XP`
                                : `${mission.min_xp} - ${mission.max_xp} XP`}
                            </span>
                            <span className="text-cyan-400 font-semibold flex items-center gap-1">
                              <Gem className="h-3 w-3 fill-cyan-400" />
                              {mission.min_diamond === mission.max_diamond
                                ? `${mission.min_diamond}`
                                : `${mission.min_diamond} - ${mission.max_diamond}`}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="py-3.5 whitespace-nowrap">
                          {mission.google_docs_url ? (
                            <a
                              href={mission.google_docs_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#FED700] hover:underline flex items-center gap-1"
                            >
                              <span>Lihat Docs</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </TableCell>

                        <TableCell className="py-3.5 whitespace-nowrap">
                          {mission.status === "ACTIVE" ? (
                            <Badge className="bg-emerald-500/15 border-emerald-500/30 text-emerald-400 text-xs px-2 py-0.5 rounded-full">
                              ACTIVE
                            </Badge>
                          ) : mission.status === "DRAFT" ? (
                            <Badge className="bg-amber-500/15 border-amber-500/30 text-amber-400 text-xs px-2 py-0.5 rounded-full">
                              DRAFT
                            </Badge>
                          ) : (
                            <Badge className="bg-white/10 border-white/20 text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                              EXPIRED
                            </Badge>
                          )}
                        </TableCell>

                        {/* Created By */}
                        <TableCell className="py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                          {mission.created_by_name || "-"}
                        </TableCell>

                        {/* Updated By */}
                        <TableCell className="py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                          {mission.updated_by_name || "-"}
                        </TableCell>

                        <TableCell className="py-3.5 pr-4.5 text-right sticky right-0 bg-[#0F121A] group-hover:bg-[#141824] z-10 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.5)] border-l border-border/40 transition-colors">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Review Submissions Button */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenSubmissions(mission)}
                              className="h-8 px-2.5 rounded-lg border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs text-foreground flex items-center gap-1.5 cursor-pointer"
                              title="Lihat & Review Pengumpulan Peserta"
                            >
                              <UserCheck className="h-3.5 w-3.5 text-[#E01C20]" />
                              <span>Pengumpulan</span>
                            </Button>

                            {/* Edit Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEdit(mission)}
                              className="h-8 w-8 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground cursor-pointer"
                              title="Edit Misi"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>

                            {/* Delete Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDelete(mission)}
                              className="h-8 w-8 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 cursor-pointer"
                              title="Hapus Misi"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
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
      </Card>
        </TabsContent>

        {/* Tab 2: Pengumpulan Peserta */}
        <TabsContent value="submissions" className="space-y-6 outline-none">
          {/* Active Mission Info Card (if specific mission selected) */}
          {selectedMissionForSubmissions && (
            <Card className="bg-[#0F121A]/90 border-border/50 rounded-2xl p-4 sm:p-5 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-[#E01C20]/15 border-[#E01C20]/30 text-[#E01C20] text-xs font-semibold">
                      Misi Terpilih
                    </Badge>
                    <h3 className="text-base sm:text-lg font-bold text-foreground">
                      {selectedMissionForSubmissions.title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 max-w-2xl">
                    {selectedMissionForSubmissions.description}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <Zap className="h-3 w-3 fill-amber-400" />
                      {selectedMissionForSubmissions.min_xp === selectedMissionForSubmissions.max_xp
                        ? `${selectedMissionForSubmissions.min_xp} XP`
                        : `${selectedMissionForSubmissions.min_xp} - ${selectedMissionForSubmissions.max_xp} XP`}
                    </span>
                    <span className="text-cyan-400 font-semibold flex items-center gap-1">
                      <Gem className="h-3 w-3 fill-cyan-400" />
                      {selectedMissionForSubmissions.min_diamond === selectedMissionForSubmissions.max_diamond
                        ? `${selectedMissionForSubmissions.min_diamond} 💎`
                        : `${selectedMissionForSubmissions.min_diamond} - ${selectedMissionForSubmissions.max_diamond} 💎`}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedMissionForSubmissions(null);
                      setSubmissionPage(1);
                    }}
                    className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
                  >
                    Tampilkan Semua Misi
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Submissions Main Card */}
          <Card className="bg-[#0F121A]/80 border-border/40 rounded-2xl overflow-hidden">
            <CardHeader className="p-4 sm:p-6 border-b border-border/40">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 flex-wrap">
                  {/* Filter Kategori Dropdown */}
                  <div className="flex items-center gap-2 w-full sm:w-44">
                    <Select
                      value={submissionCategoryFilter}
                      onValueChange={(val) => {
                        setSubmissionCategoryFilter(val);
                        setSubmissionPage(1);
                        if (
                          val !== "ALL" &&
                          selectedMissionForSubmissions &&
                          (val === "GLOBAL"
                            ? selectedMissionForSubmissions.category_id !== null
                            : selectedMissionForSubmissions.category_id !== val)
                        ) {
                          setSelectedMissionForSubmissions(null);
                        }
                      }}
                    >
                      <SelectTrigger className="h-9 bg-input/40 border-border/50 rounded-xl text-xs text-foreground truncate">
                        <SelectValue placeholder="Pilih Kategori" />
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

                  {/* Filter Misi Dropdown */}
                  <div className="flex items-center gap-2 w-full sm:w-56">
                    <Select
                      value={selectedMissionForSubmissions?.mission_id || "all"}
                      onValueChange={(val) => {
                        setSubmissionPage(1);
                        if (val === "all") {
                          setSelectedMissionForSubmissions(null);
                        } else {
                          const found = missions.find((m) => m.mission_id === val);
                          setSelectedMissionForSubmissions(found || null);
                        }
                      }}
                    >
                      <SelectTrigger className="h-9 bg-input/40 border-border/50 rounded-xl text-xs text-foreground truncate">
                        <SelectValue placeholder="Pilih Misi" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#141824] border-border/50 text-foreground max-h-64">
                        <SelectItem value="all">Semua Misi (All)</SelectItem>
                        {availableMissionsForSubmissions.map((m) => (
                          <SelectItem key={m.mission_id} value={m.mission_id}>
                            {m.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Search Input */}
                  <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Cari nama, email, link karya..."
                      value={submissionSearch}
                      onChange={(e) => {
                        setSubmissionSearch(e.target.value);
                        setSubmissionPage(1);
                      }}
                      className="pl-8 h-9 bg-input/40 border-border/50 rounded-xl text-xs text-foreground"
                    />
                  </div>
                </div>

                {/* Status Filter Buttons */}
                <div className="flex items-center gap-2 self-start xl:self-auto flex-wrap">
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-[#181D2D] border border-border/50">
                    {["ALL", "PENDING", "APPROVED", "REJECTED"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          setSubmissionStatusFilter(st);
                          setSubmissionPage(1);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          submissionStatusFilter === st
                            ? "bg-[#E01C20] text-white shadow-sm font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {st === "ALL" ? "Semua" : st}
                      </button>
                    ))}
                  </div>

                  <span className="text-xs text-muted-foreground whitespace-nowrap pl-1">
                    Total: <b className="text-foreground">{totalSubmissions}</b> data
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {isSubmissionsLoading ? (
                <div className="p-6 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full bg-white/5 rounded-xl" />
                  ))}
                </div>
              ) : isSubmissionsError ? (
                <div className="p-8 text-center space-y-3">
                  <AlertCircle className="h-8 w-8 text-[#E01C20] mx-auto" />
                  <p className="text-sm text-muted-foreground">Gagal memuat data pengumpulan peserta.</p>
                  <Button size="sm" onClick={() => refetchSubmissions()} className="bg-[#E01C20] text-xs">
                    Coba Lagi
                  </Button>
                </div>
              ) : submissions.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <UserCheck className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                  <p className="text-sm font-semibold text-foreground">Belum Ada Pengumpulan</p>
                  <p className="text-xs text-muted-foreground">
                    Peserta belum mengunggah karya untuk kriteria pencarian / filter ini.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/40 hover:bg-transparent">
                        <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 pl-6 bg-white/[0.02]">Peserta</TableHead>
                        <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">Misi</TableHead>
                        <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">Link Karya</TableHead>
                        <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">Catatan</TableHead>
                        <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">Waktu Submit</TableHead>
                        <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">Status</TableHead>
                        <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02]">Hasil Nilai</TableHead>
                        <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02] whitespace-nowrap">Created By</TableHead>
                        <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 bg-white/[0.02] whitespace-nowrap">Updated By</TableHead>
                        <TableHead className="text-muted-foreground font-semibold text-xs py-3.5 pr-6 text-right sticky right-0 bg-[#141824] z-20 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.5)] border-l border-border/40">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map((sub) => {
                        const missionTitle =
                          sub.mission?.title ||
                          selectedMissionForSubmissions?.title ||
                          missions.find((m) => m.mission_id === sub.mission_id)?.title ||
                          "-";

                        return (
                          <TableRow
                            key={sub.submission_id}
                            className="group border-border/40 hover:bg-white/5 transition-colors"
                          >
                            <TableCell className="py-3.5 pl-6 max-w-[220px]">
                              <p className="text-xs font-semibold text-foreground truncate">
                                {sub.user?.name || "Peserta"}
                              </p>
                              <p className="text-[11px] text-muted-foreground truncate">
                                {sub.user?.email || "-"}
                              </p>
                              {sub.user?.nim && (
                                <p className="text-[10px] text-muted-foreground/70 font-mono">
                                  NIM: {sub.user.nim}
                                </p>
                              )}
                              {sub.registration?.team_name ? (
                                <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#E01C20]/15 border border-[#E01C20]/30 text-[10px] font-medium text-[#FFF9F5] max-w-full truncate">
                                  <span className="truncate">
                                    Tim: <b>{sub.registration.team_name}</b>
                                  </span>
                                  {sub.registration.category_name && (
                                    <span className="text-[#FED700] flex-shrink-0">
                                      ({sub.registration.category_name})
                                    </span>
                                  )}
                                </div>
                              ) : sub.user_registrations?.length > 1 ? (
                                <div
                                  className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-[10px] font-medium text-amber-300 max-w-full truncate"
                                  title={sub.user_registrations
                                    .map((r) => `${r.team_name} (${r.category_name})`)
                                    .join(", ")}
                                >
                                  <span className="truncate">
                                    ⚠️ Pilih Tim ({sub.user_registrations.length} tim)
                                  </span>
                                </div>
                              ) : null}
                            </TableCell>

                            <TableCell className="max-w-[200px]">
                              <p className="text-xs font-medium text-foreground line-clamp-1">
                                {missionTitle}
                              </p>
                              {(() => {
                                const catName =
                                  sub.category?.name ||
                                  sub.category?.category_name ||
                                  sub.mission?.category?.name ||
                                  categories.find(
                                    (c) =>
                                      c.category_id ===
                                      (sub.mission?.category_id || sub.category_id)
                                  )?.name;
                                return catName ? (
                                  <Badge className="mt-1 bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[10px] px-1.5 py-0 rounded font-medium">
                                    {catName}
                                  </Badge>
                                ) : (
                                  <Badge className="mt-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] px-1.5 py-0 rounded font-medium">
                                    🌐 Semua Kategori
                                  </Badge>
                                );
                              })()}
                            </TableCell>

                            <TableCell className="max-w-[180px]">
                              <a
                                href={sub.submission_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#FED700] hover:underline flex items-center gap-1 truncate"
                              >
                                <span className="truncate">{sub.submission_url}</span>
                                <ExternalLink className="h-3 w-3 flex-shrink-0" />
                              </a>
                            </TableCell>

                            <TableCell className="max-w-[150px]">
                              <p className="text-xs text-muted-foreground truncate" title={sub.notes || "-"}>
                                {sub.notes || "-"}
                              </p>
                            </TableCell>

                            <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                              {formatDateDisplay(sub.created_at)}
                            </TableCell>

                            <TableCell className="whitespace-nowrap">
                              {sub.status === "APPROVED" ? (
                                <Badge className="bg-emerald-500/15 border-emerald-500/30 text-emerald-400 text-xs">
                                  APPROVED
                                </Badge>
                              ) : sub.status === "PENDING" ? (
                                <Badge className="bg-amber-500/15 border-amber-500/30 text-amber-400 text-xs">
                                  PENDING
                                </Badge>
                              ) : (
                                <Badge className="bg-red-500/15 border-red-500/30 text-red-400 text-xs">
                                  REJECTED
                                </Badge>
                              )}
                            </TableCell>

                            <TableCell className="whitespace-nowrap text-xs">
                              {sub.status === "APPROVED" ? (
                                <span className="text-emerald-400 font-semibold">
                                  +{sub.awarded_xp} XP / +{sub.awarded_diamond} 💎
                                </span>
                              ) : sub.status === "REJECTED" ? (
                                <div className="space-y-0.5">
                                  <span className="text-red-400 text-[11px] font-medium">Ditolak</span>
                                  {sub.admin_feedback && (
                                    <p
                                      className="text-[10px] text-muted-foreground/80 truncate max-w-[150px]"
                                      title={`Alasan: ${sub.admin_feedback}`}
                                    >
                                      Alasan: {sub.admin_feedback}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-[11px]">Belum dinilai</span>
                              )}
                            </TableCell>

                            {/* Created By */}
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {sub.created_by_name || sub.user?.name || "-"}
                            </TableCell>

                            {/* Updated By */}
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {sub.updated_by_name || "-"}
                            </TableCell>

                            <TableCell className="py-3.5 pr-5 text-right whitespace-nowrap sticky right-0 bg-[#0F121A] group-hover:bg-[#141824] z-10 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.5)] border-l border-border/40 transition-colors">
                              {sub.status === "PENDING" ? (
                                <Button
                                  size="sm"
                                  onClick={() => handleOpenReview(sub)}
                                  className="bg-[#E01C20] hover:bg-[#c4181c] text-white rounded-lg text-xs font-semibold h-7 px-3 cursor-pointer shadow-sm"
                                >
                                  Nilai / ACC
                                </Button>
                              ) : sub.status === "REJECTED" ? (
                                <Button
                                  size="sm"
                                  disabled
                                  className="bg-white/5 border border-red-500/30 text-red-400/70 rounded-lg text-xs font-medium h-7 px-3 cursor-not-allowed opacity-60"
                                  title="Pengumpulan misi telah ditolak dan tidak dapat diedit kembali"
                                >
                                  Ditolak (Terkunci)
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  disabled
                                  className="bg-white/5 border border-emerald-500/30 text-emerald-400/70 rounded-lg text-xs font-medium h-7 px-3 cursor-not-allowed opacity-60"
                                  title="Pengumpulan misi telah disetujui dan reward telah diberikan"
                                >
                                  Selesai (Terkunci)
                                </Button>
                              )}
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
            {totalSubmissions > 0 && (
              <div className="p-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    Menampilkan{" "}
                    <span className="text-foreground font-semibold">
                      {(submissionPage - 1) * submissionLimit + 1}
                    </span>{" "}
                    -{" "}
                    <span className="text-foreground font-semibold">
                      {Math.min(submissionPage * submissionLimit, totalSubmissions)}
                    </span>{" "}
                    dari{" "}
                    <span className="text-foreground font-semibold">{totalSubmissions}</span> total
                    pengumpulan
                  </div>

                  {/* Limit per page selector */}
                  <div className="flex items-center gap-1.5 pl-2 sm:border-l sm:border-border/40">
                    <span className="hidden sm:inline">Per hal:</span>
                    <Select
                      value={String(submissionLimit)}
                      onValueChange={(val) => {
                        setSubmissionLimit(Number(val));
                        setSubmissionPage(1);
                      }}
                    >
                      <SelectTrigger className="h-7 w-16 bg-input/40 border-border/50 rounded-lg text-xs text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#141824] border-border/50 text-foreground">
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSubmissionPage((p) => Math.max(1, p - 1))}
                    disabled={submissionPage <= 1 || isSubmissionsLoading}
                    className="h-8 px-3 rounded-xl border-border/50 bg-input/20 text-foreground disabled:opacity-30 cursor-pointer"
                  >
                    Sebelumnya
                  </Button>
                  <div className="text-xs px-2 text-foreground font-medium">
                    Halaman {submissionPage} dari {totalSubmissionPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSubmissionPage((p) => Math.min(totalSubmissionPages, p + 1))}
                    disabled={submissionPage >= totalSubmissionPages || isSubmissionsLoading}
                    className="h-8 px-3 rounded-xl border-border/50 bg-input/20 text-foreground disabled:opacity-30 cursor-pointer"
                  >
                    Selanjutnya
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Mission Dialog */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="bg-[#0A0D14] border border-border/50 text-[#FFF9F5] max-w-2xl sm:max-w-[38rem] max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg sm:text-xl font-bold flex items-center gap-2.5 text-foreground">
              <Target className="h-5 w-5 text-[#E01C20]" />
              <span>Tambah Misi Baru</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Tambahkan tugas misi harian baru untuk diselesaikan oleh peserta kompetisi.
            </DialogDescription>
          </DialogHeader>
          <MissionForm
            onSubmit={(payload) => {
              createMutation.mutate(payload, {
                onSuccess: () => setOpenCreate(false),
              });
            }}
            isLoading={createMutation.isPending}
            onCancel={() => setOpenCreate(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Mission Dialog */}
      <Dialog
        open={!!editingMission}
        onOpenChange={(open) => !open && setEditingMission(null)}
      >
        <DialogContent className="bg-[#0A0D14] border border-border/50 text-[#FFF9F5] max-w-2xl sm:max-w-[38rem] max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg sm:text-xl font-bold flex items-center gap-2.5 text-foreground">
              <Edit2 className="h-5 w-5 text-[#E01C20]" />
              <span>Edit Misi Harian</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Perbarui detail instruksi misi, tenggat waktu, atau alokasi reward XP & Diamond.
            </DialogDescription>
          </DialogHeader>
          <MissionForm
            initial={editingMission}
            onSubmit={(payload) => {
              updateMutation.mutate(
                { id: editingMission?.mission_id, data: payload },
                {
                  onSuccess: () => setEditingMission(null),
                }
              );
            }}
            isLoading={updateMutation.isPending}
            onCancel={() => setEditingMission(null)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog: Delete Confirmation */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-[#0A0D14] border border-border/50 text-[#FFF9F5] max-w-md rounded-2xl p-6 shadow-2xl">
          <DialogHeader className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[#E01C20] mx-auto">
              <AlertCircle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-lg font-bold text-center text-foreground">
              Hapus Misi Harian
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground text-center">
              Apakah Anda yakin ingin menghapus misi &quot;
              <span className="text-foreground font-semibold">
                {deletingMission?.title}
              </span>
              &quot;? Seluruh data pengumpulan peserta untuk misi ini juga akan terhapus secara permanen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsDeleteOpen(false)}
              disabled={deleteMutation.isPending}
              className="rounded-xl text-xs text-muted-foreground hover:text-white"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-[#E01C20] hover:bg-[#c4181c] text-white rounded-xl text-xs font-semibold px-4 cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              {deleteMutation.isPending ? "Menghapus..." : "Hapus Misi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sub-Dialog: Review / Grading Participant Submission */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="bg-[#0A0D14] border border-border/50 text-[#FFF9F5] max-w-md rounded-2xl p-6 shadow-2xl">
          <DialogHeader className="space-y-1.5">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-400" />
              <span>Penilaian Pengumpulan Misi</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Peserta: <span className="font-semibold text-foreground">{selectedSubmission?.user?.name}</span> ({selectedSubmission?.user?.email})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Target Team / Registration Info */}
            {selectedSubmission?.registration?.registration_id ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#E01C20]/10 border border-[#E01C20]/25 text-xs">
                <span className="text-muted-foreground">Tim Pengumpul:</span>
                <span className="text-foreground font-bold">
                  {selectedSubmission.registration.team_name || "-"}{" "}
                  {selectedSubmission.registration.category_name && (
                    <span className="text-[#FED700] font-semibold">
                      ({selectedSubmission.registration.category_name})
                    </span>
                  )}
                </span>
              </div>
            ) : selectedSubmission?.user_registrations?.length > 1 ? (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs">
                <Label className="text-xs font-semibold text-amber-300">
                  Pilih Tim Penerima Reward (Peserta Memiliki &gt;1 Tim) *
                </Label>
                <Select
                  value={reviewData.registration_id}
                  onValueChange={(val) =>
                    setReviewData({ ...reviewData, registration_id: val })
                  }
                >
                  <SelectTrigger className="h-9 bg-[#141824] border-border/50 rounded-xl text-xs text-foreground">
                    <SelectValue placeholder="Pilih tim peserta..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141824] border-border/50 text-foreground">
                    {selectedSubmission.user_registrations.map((reg) => (
                      <SelectItem
                        key={reg.registration_id}
                        value={reg.registration_id}
                      >
                        {reg.team_name} ({reg.category_name || "Kompetisi"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-amber-200/80">
                  Pengumpulan lama ini belum terikat ke ID tim spesifik. Pilih tim sesuai catatan peserta agar XP &amp; Diamond masuk ke tim yang tepat.
                </p>
              </div>
            ) : null}

            {/* Submission Link Review */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Link Karya Peserta:</span>
                <a
                  href={selectedSubmission?.submission_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FED700] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Buka Link</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              {selectedSubmission?.notes && (
                <div className="border-t border-white/5 pt-1.5">
                  <span className="text-muted-foreground">Catatan: </span>
                  <span className="text-foreground">{selectedSubmission.notes}</span>
                </div>
              )}
            </div>

            {/* Guideline Box */}
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
              <p className="font-semibold">
                {targetReviewMission?.min_xp === targetReviewMission?.max_xp && targetReviewMission?.min_diamond === targetReviewMission?.max_diamond
                  ? "Ketentuan Hadiah Misi (Nilai Tetap / Fix):"
                  : "Rentang Reward yang Ditentukan:"}
              </p>
              <div className="flex justify-between text-[11px]">
                <span>
                  ⚡ XP:{" "}
                  <b>
                    {targetReviewMission?.min_xp === targetReviewMission?.max_xp
                      ? `${targetReviewMission?.min_xp ?? 0} (Fix)`
                      : `${targetReviewMission?.min_xp ?? 0} - ${targetReviewMission?.max_xp ?? 0}`}
                  </b>
                </span>
                <span>
                  💎 Diamond:{" "}
                  <b>
                    {targetReviewMission?.min_diamond === targetReviewMission?.max_diamond
                      ? `${targetReviewMission?.min_diamond ?? 0} (Fix)`
                      : `${targetReviewMission?.min_diamond ?? 0} - ${targetReviewMission?.max_diamond ?? 0}`}
                  </b>
                </span>
              </div>
            </div>

            {!targetReviewMission?.category_id && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <span>
                  🌐 <b>Misi Global:</b> Reward XP dan Diamond hanya akan diberikan ke tim{" "}
                  <b>
                    {selectedSubmission?.registration?.team_name ||
                      selectedSubmission?.user_registrations?.find(
                        (r) => r.registration_id === reviewData.registration_id
                      )?.team_name ||
                      "yang dipilih"}
                  </b>
                  .
                </span>
              </div>
            )}

            {/* Input Awarded XP & Diamond */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-amber-400">
                    Beri XP *
                  </Label>
                  {targetReviewMission?.min_xp === targetReviewMission?.max_xp && (
                    <span className="text-[10px] text-amber-400 font-medium">Tetap (Fix)</span>
                  )}
                </div>
                <Input
                  type="number"
                  min={targetReviewMission?.min_xp ?? 0}
                  max={targetReviewMission?.max_xp ?? 999999}
                  value={reviewData.awarded_xp}
                  onChange={(e) => setReviewData({ ...reviewData, awarded_xp: e.target.value })}
                  readOnly={targetReviewMission?.min_xp === targetReviewMission?.max_xp}
                  className={`bg-[#181D2D] border-border/50 text-foreground rounded-xl h-9 text-xs sm:text-sm ${
                    targetReviewMission?.min_xp === targetReviewMission?.max_xp ? "opacity-80 cursor-not-allowed" : ""
                  }`}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-cyan-400">
                    Beri Diamond *
                  </Label>
                  {targetReviewMission?.min_diamond === targetReviewMission?.max_diamond && (
                    <span className="text-[10px] text-cyan-400 font-medium">Tetap (Fix)</span>
                  )}
                </div>
                <Input
                  type="number"
                  min={targetReviewMission?.min_diamond ?? 0}
                  max={targetReviewMission?.max_diamond ?? 999999}
                  value={reviewData.awarded_diamond}
                  onChange={(e) => setReviewData({ ...reviewData, awarded_diamond: e.target.value })}
                  readOnly={targetReviewMission?.min_diamond === targetReviewMission?.max_diamond}
                  className={`bg-[#181D2D] border-border/50 text-foreground rounded-xl h-9 text-xs sm:text-sm ${
                    targetReviewMission?.min_diamond === targetReviewMission?.max_diamond ? "opacity-80 cursor-not-allowed" : ""
                  }`}
                />
              </div>
            </div>

            {/* Feedback textarea */}
            <div className="space-y-1">
              <Label className="text-xs font-medium">Catatan / Feedback Admin (Opsional)</Label>
              <Textarea
                rows={2}
                placeholder="Misal: Karya sangat kreatif dan sesuai petunjuk..."
                value={reviewData.admin_feedback}
                onChange={(e) => setReviewData({ ...reviewData, admin_feedback: e.target.value })}
                className="bg-[#181D2D] border-border/50 text-foreground rounded-xl text-xs resize-none"
              />
            </div>

            {/* Action Buttons */}
            <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                type="button"
                variant="destructive"
                disabled={reviewMutation.isPending}
                onClick={() => handleReviewAction("REJECTED")}
                className="rounded-xl text-xs font-semibold sm:flex-1 cursor-pointer"
              >
                <XCircle className="h-3.5 w-3.5 mr-1" />
                Tolak Pengumpulan
              </Button>

              <Button
                type="button"
                disabled={reviewMutation.isPending}
                onClick={() => handleReviewAction("APPROVED")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold sm:flex-1 cursor-pointer shadow-lg shadow-emerald-900/30"
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                {reviewMutation.isPending ? "Memproses..." : "ACC & Berikan Reward"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
