"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Award,
  Star,
  Edit,
  Users,
  CheckCircle,
  ExternalLink,
  FileText,
  Lock,
  Clock,
  AlertCircle,
  Zap,
  MessageCircle,
  Gift,
  Sparkles,
  Copy,
  Info,
  ImageIcon,
} from "lucide-react";
import { SubmissionForm } from "@/components/forms/SubmissionForm";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getSafeImageUrl } from "@/lib/image-loader";

import { getMySubmissions } from "@/services/submission.service";
import { getRegistrationById } from "@/services/competition.service";
import { useGenerateReferralCode } from "@/hooks/use-referral";
import { EditTeamModal } from "./EditTeamModal";
import { EditSubmissionModal } from "./EditSubmissionModal";
import { LinkTypeIcon } from "../LinTypekIcon";

export function CompetitionDashboard({ registration, initialTab = "beranda" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [editTeamModalOpen, setEditTeamModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const generateReferralMutation = useGenerateReferralCode();

  const handleGenerateReferral = (id) => {
    if (!activeRegistration.is_verified) {
      toast.error("Pendaftaran tim Anda harus terverifikasi oleh panitia terlebih dahulu");
      return;
    }
    generateReferralMutation.mutate(id);
  };

  const handleCopyReferral = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    toast.success(`Kode referral ${code} berhasil disalin ke clipboard!`);
  };

  // Pantau perubahan registration data
  const { data: currentRegistration } = useQuery({
    queryKey: ["registration", registration.registration_id],
    queryFn: () => getRegistrationById(registration.registration_id),
    initialData: registration,
    staleTime: 0, // Selalu fetch data terbaru
  });

  const activeRegistration = currentRegistration || registration;

  // Query untuk mengambil submission milik registration aktif
  const { data: submissionsData, isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ["mySubmissions", activeRegistration?.registration_id],
    queryFn: () => getMySubmissions(1, 10, activeRegistration?.registration_id),
    enabled: !!activeRegistration?.registration_id,
  });

  // Filter submissions berdasarkan registration_id
  const submissions =
    submissionsData?.submissions?.filter(
      (sub) =>
        sub.registration_id === activeRegistration.registration_id ||
        sub.registration?.registration_id === activeRegistration.registration_id ||
        sub.registration?.category_id === activeRegistration.category_id ||
        sub.category_id === activeRegistration.category_id,
    ) || [];

  // Check apakah user sudah punya submission
  const hasSubmissions = submissions.length > 0;

  // Evaluasi batas karya sementara & final, serta status buka/tutup pengumpulan
  const category = activeRegistration?.category || {};
  const now = new Date();
  const prelimDeadline = category.preliminary_deadline
    ? new Date(category.preliminary_deadline)
    : category.deadline
      ? new Date(category.deadline)
      : null;
  const finalDeadline = category.final_deadline
    ? new Date(category.final_deadline)
    : category.deadline
      ? new Date(category.deadline)
      : null;
  const isSubmissionOpen = category.is_submission_open !== false;
  const allowRevision = !!category.allow_revision;

  const isPastPreliminary = prelimDeadline ? now > prelimDeadline : false;
  const isPastFinal = finalDeadline ? now > finalDeadline : false;

  let canEditSubmission = true;
  let editLockReason = "";
  let submissionPhase = "preliminary"; // 'preliminary' | 'waiting_revision' | 'revision' | 'closed'

  if (!isSubmissionOpen) {
    canEditSubmission = false;
    submissionPhase = "closed";
    editLockReason =
      "Pengumpulan karya sedang ditutup sementara oleh panitia / admin.";
  } else if (isPastFinal) {
    canEditSubmission = false;
    submissionPhase = "closed";
    editLockReason =
      "Batas pengumpulan karya final telah berakhir. Karya tidak dapat diubah lagi.";
  } else if (isPastPreliminary && !allowRevision) {
    canEditSubmission = false;
    submissionPhase = "waiting_revision";
    editLockReason =
      "Batas pengumpulan karya sementara telah berakhir. Pengumpulan karya sedang ditutup menunggu admin membuka fase perbaikan.";
  } else if (allowRevision || isPastPreliminary) {
    canEditSubmission = true;
    submissionPhase = "revision";
  } else {
    canEditSubmission = true;
    submissionPhase = "preliminary";
  }

  const formatDeadlineDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLinkTypeBadgeLabel = (linkType) => {
    switch (linkType) {
      case "PROPOSAL":
        return "Draft Proposal";
      case "PRESENTATION":
        return "File Presentasi";
      case "ORIGINALITY_STATEMENT":
        return "Surat Orisinil Karya";
      case "GITHUB":
        return "GitHub Utama";
      case "GITHUB_SECONDARY":
        return "GitHub Tambahan";
      case "DEPLOYMENT":
        return "Deployment / Live";
      case "FIGMA":
        return "Desain Figma";
      case "FIGMA_PROTOTYPE":
        return "Prototipe Figma";
      case "YOUTUBE":
        return "YouTube Demo";
      case "OTHER":
        return "Link Lainnya";
      default:
        return linkType;
    }
  };

  useEffect(() => {
    // Logic untuk initial tab berdasarkan kondisi user
    if (
      !activeRegistration.is_verified &&
      (initialTab === "upload" || initialTab === "status")
    ) {
      // User belum terverifikasi, arahkan ke status
      setActiveTab("status");
    } else if (hasSubmissions && initialTab === "upload") {
      // User sudah punya submission, arahkan ke status
      setActiveTab("status");
    } else if (!canEditSubmission && initialTab === "upload") {
      // Pengumpulan ditutup, arahkan ke status
      setActiveTab("status");
    } else {
      setActiveTab(initialTab);
    }
  }, [
    initialTab,
    hasSubmissions,
    activeRegistration.is_verified,
    canEditSubmission,
  ]);

  // Handle tab change dengan validasi dan toast
  const handleTabChange = (value) => {
    // Jika user mencoba akses upload tapi belum terverifikasi
    if (value === "upload" && !activeRegistration.is_verified) {
      toast.warning("Akun Anda belum diverifikasi!", {
        description:
          "Silakan tunggu verifikasi admin sebelum dapat mengupload karya.",
        duration: 4000,
      });
      setActiveTab("status"); // Tetap di tab status
      return;
    }

    // Jika user mencoba akses upload tapi sudah punya submission
    if (value === "upload" && hasSubmissions) {
      toast.info("Anda sudah mengupload karya!", {
        description: canEditSubmission
          ? "Gunakan tombol Edit Karya di tab Status untuk memperbarui karya Anda."
          : "Pengumpulan karya saat ini ditutup dan tidak dapat diedit.",
        duration: 4000,
      });
      setActiveTab("status"); // Tetap di tab status
      return;
    }

    // Jika user mencoba akses upload saat pengumpulan ditutup
    if (value === "upload" && !canEditSubmission) {
      toast.warning("Pengumpulan karya ditutup!", {
        description: editLockReason,
        duration: 4000,
      });
      setActiveTab("status");
      return;
    }

    setActiveTab(value);
  };

  const parseTeamMembers = (teamMembersString) => {
    if (!teamMembersString) return [];

    try {
      const parsed = JSON.parse(teamMembersString);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return teamMembersString
        .split(",")
        .map((member) => member.trim().replace(/['"\[\]]/g, ""))
        .filter((member) => member.length > 0);
    }
  };

  const teamMembers = parseTeamMembers(activeRegistration.team_members);

  const handleEditSubmission = (submission) => {
    if (!canEditSubmission) {
      toast.warning("Pengumpulan Ditutup!", {
        description: editLockReason,
        duration: 4000,
      });
      return;
    }
    setEditingSubmission(submission);
  };

  const handleCloseEditModal = () => {
    setEditingSubmission(null);
  };

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {activeRegistration.category?.name || "Dashboard Kompetisi"}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Selamat berkompetisi,{" "}
            <span className="text-foreground font-medium">
              {activeRegistration.team_name || "Nama Tim"}
            </span>
            !
          </p>
        </div>

        {/* Gamification Stats per Team */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 font-bold text-sm shadow-sm">
            <Zap className="w-4 h-4 fill-amber-400/30" />
            <span>{Number(activeRegistration.xp || 0).toLocaleString("id-ID")} XP</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 font-bold text-sm shadow-sm">
            <span>💎</span>
            <span>{Number(activeRegistration.diamond || 0).toLocaleString("id-ID")} Diamond</span>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        {/* Tab List */}
        <TabsList className="grid w-full grid-cols-3 bg-[#0F121A]/80 border border-border/50 p-1.5 rounded-2xl shadow-lg h-auto">
          <TabsTrigger
            value="beranda"
            className="cursor-pointer py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md font-semibold text-xs sm:text-sm transition-all"
          >
            <Star className="mr-1.5 h-4 w-4" />
            Beranda
          </TabsTrigger>

          <TabsTrigger
            value="upload"
            disabled={
              !activeRegistration.is_verified ||
              hasSubmissions ||
              !canEditSubmission
            }
            data-disabled={
              !activeRegistration.is_verified ||
              hasSubmissions ||
              !canEditSubmission
            }
            className={
              !activeRegistration.is_verified ||
              hasSubmissions ||
              !canEditSubmission
                ? "py-2.5 rounded-xl opacity-50 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:pointer-events-auto font-semibold text-xs sm:text-sm"
                : "cursor-pointer py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md font-semibold text-xs sm:text-sm transition-all"
            }
          >
            <Upload className="mr-1.5 h-4 w-4" />
            Upload
          </TabsTrigger>

          <TabsTrigger
            value="status"
            className="cursor-pointer py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md font-semibold text-xs sm:text-sm transition-all"
          >
            <Award className="mr-1.5 h-4 w-4" />
            Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="beranda">
          <div className="space-y-6">
            {/* Team Information Card */}
            <div className="mia-card p-6 sm:p-7 shadow-xl space-y-6">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-2xl text-primary flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                        Informasi Tim
                      </h3>
                      {activeRegistration.is_verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded-full">
                          <CheckCircle className="h-3 w-3" /> Terverifikasi
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Detail nama dan anggota tim yang terdaftar
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (activeRegistration.is_verified) {
                      toast.warning("Tidak dapat mengedit tim!", {
                        description:
                          "Informasi tim tidak dapat diubah karena status tim sudah terverifikasi.",
                        duration: 3000,
                      });
                      return;
                    }
                    if (hasSubmissions) {
                      toast.warning("Tidak dapat mengedit tim!", {
                        description:
                          "Informasi tim tidak dapat diubah setelah mengupload karya.",
                        duration: 3000,
                      });
                      return;
                    }
                    setEditTeamModalOpen(true);
                  }}
                  disabled={activeRegistration.is_verified || hasSubmissions}
                  className={cn(
                    "rounded-full border border-white/20 hover:border-white/40 bg-input/40 hover:bg-input text-foreground text-xs font-semibold h-9 px-4 transition-all shadow-xs inline-flex items-center gap-1.5",
                    activeRegistration.is_verified || hasSubmissions
                      ? "opacity-50 cursor-not-allowed hover:bg-input/40 hover:border-white/20"
                      : "cursor-pointer",
                  )}
                  title={
                    activeRegistration.is_verified
                      ? "Tim sudah terverifikasi dan tidak dapat diedit"
                      : hasSubmissions
                        ? "Tidak dapat mengedit tim setelah mengupload karya"
                        : "Edit informasi tim"
                  }
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>Edit Tim</span>
                </Button>
              </div>

              <div className="space-y-5">
                {/* Nama Tim */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Nama Tim
                  </Label>
                  <p className="text-lg font-bold text-foreground">
                    {activeRegistration.team_name || "Tidak ada nama tim"}
                  </p>
                </div>

                {/* Anggota Tim */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Anggota Tim ({teamMembers.length} orang)
                  </Label>
                  <div className="grid gap-2.5 lg:grid-cols-3 pt-1">
                    {teamMembers.length > 0 ? (
                      teamMembers.map((member, index) => (
                        <div
                          key={index}
                          className="relative flex items-center gap-3 p-3 bg-input/40 border border-border/40 rounded-xl truncate"
                        >
                          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 select-none">
                            {member.charAt(0).toUpperCase()}
                          </div>
                          <span
                            className={cn(
                              "font-semibold text-sm text-foreground truncate grow mr-1",
                              index === 0 && "mr-14",
                            )}
                          >
                            {member}
                          </span>
                          {index === 0 && (
                            <span className="absolute -right-0 text-xs text-muted-foreground pointer-events-none -z-10 select-none pr-4">
                              (Ketua)
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm italic">
                        Belum ada anggota tim yang terdaftar
                      </p>
                    )}
                  </div>
                </div>

                {/* Dokumen Persyaratan (Google Drive Link) */}
                {activeRegistration.file_url && (
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Dokumen Persyaratan
                    </Label>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="h-8 rounded-full border border-border/30 dark:border-border/30 hover:border-white/40 bg-input/60 hover:bg-input text-foreground text-xs px-3.5 shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <a
                          href={activeRegistration.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Google Drive Dokumen</span>
                        </a>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Grup WhatsApp Peserta (Sesuai Kategori Lomba) */}
                {activeRegistration.category?.whatsapp_group_url && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#0F121A] to-emerald-950/20 border border-emerald-500/40 space-y-3 shadow-md shadow-emerald-950/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                            Grup WhatsApp Resmi ({activeRegistration.category?.name || "Kategori Lomba"})
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Grup koordinasi bagi seluruh peserta kategori ini untuk arahan teknis dan pengumuman panitia.
                          </p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        asChild
                        className="rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs px-4 h-9 shadow-md shadow-emerald-950/40 inline-flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                      >
                        <a
                          href={activeRegistration.category.whatsapp_group_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="h-4 w-4 fill-current" />
                          <span>Buka Grup WhatsApp</span>
                          <ExternalLink className="h-3 w-3 opacity-75" />
                        </a>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Status Verifikasi */}
                <div className="pt-3 border-t border-border/40 space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status Verifikasi
                  </Label>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "text-xs sm:text-sm px-3 py-1 rounded-full font-semibold border inline-flex items-center gap-1.5",
                        activeRegistration.is_verified
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                          : "bg-amber-500/15 border-amber-500/30 text-amber-400",
                      )}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      {activeRegistration.is_verified
                        ? "Terverifikasi"
                        : "Menunggu Verifikasi"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activeRegistration.is_verified
                      ? "Tim Anda sudah diverifikasi dan dapat mengupload karya"
                      : "Tim Anda sedang dalam proses verifikasi admin"}
                  </p>
                </div>
              </div>
            </div>

            {/* Referral Code Card */}
            <div className="mia-card p-6 sm:p-7 shadow-xl space-y-5 border-amber-500/30 bg-gradient-to-br from-[#0F121A] via-amber-950/10 to-[#0F121A]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-amber-500/10 border border-amber-500/25 rounded-2xl text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Gift className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                        Program Referral Tim
                      </h3>
                      <span className="text-[11px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                        +250 XP
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Ajak tim atau peserta lomba lain bergabung ke MIA 2026 dan raih bonus XP!
                    </p>
                  </div>
                </div>

                {!activeRegistration.referral_code && (
                  !activeRegistration.is_verified ? (
                    <Button
                      disabled
                      className="rounded-full bg-input/40 border border-border/40 text-muted-foreground/60 h-10 px-5 text-xs sm:text-sm font-semibold cursor-not-allowed inline-flex items-center gap-2 flex-shrink-0"
                      title="Pendaftaran tim harus diverifikasi oleh panitia terlebih dahulu"
                    >
                      <Lock className="w-4 h-4 text-amber-400/60" />
                      <span>Generate Referral Code</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleGenerateReferral(activeRegistration.registration_id)}
                      disabled={generateReferralMutation.isPending}
                      className="rounded-full mia-btn-primary h-10 px-5 text-xs sm:text-sm font-semibold shadow-md shadow-red-900/30 cursor-pointer inline-flex items-center gap-2 flex-shrink-0"
                    >
                      {generateReferralMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Membuat Kode...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Generate Referral Code</span>
                        </>
                      )}
                    </Button>
                  )
                )}
              </div>

              {activeRegistration.referral_code ? (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Kode Unik Referral Anda
                      </p>
                      <p className="text-2xl sm:text-3xl font-black text-amber-400 tracking-wider font-mono">
                        {activeRegistration.referral_code}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleCopyReferral(activeRegistration.referral_code)}
                        className="rounded-full bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs px-4 h-9 shadow-md shadow-amber-950/40 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </Button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-input/30 border border-white/5 text-xs text-muted-foreground space-y-1 leading-relaxed">
                    <p className="font-semibold text-foreground flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-amber-400" />
                      Cara Kerja Reward Referral:
                    </p>
                    <ul className="list-disc pl-5 space-y-0.5 pt-0.5 text-muted-foreground">
                      <li>Bagikan kode referral unik ini ke teman atau tim yang ingin mendaftar (boleh untuk kategori lomba apa pun).</li>
                      <li>Saat mereka mendaftar dan memasukkan kode Anda, data referral akan dicatat otomatis.</li>
                      <li>
                        Begitu pendaftaran mereka <strong className="text-emerald-400">diverifikasi (ACC) oleh admin</strong>, tim Anda otomatis memperoleh <strong className="text-amber-400">+250 XP</strong> dan tim yang diundang memperoleh <strong className="text-cyan-400">+100 XP</strong>!
                      </li>
                    </ul>
                  </div>
                </div>
              ) : !activeRegistration.is_verified ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200/90 flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>
                    Pendaftaran tim Anda saat ini <strong>belum terverifikasi</strong>. Tombol pembuatan kode referral akan aktif secara otomatis setelah berkas pendaftaran Anda disetujui (ACC) oleh panitia.
                  </span>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-input/20 border border-border/40 text-xs text-muted-foreground flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>
                      Klik tombol <strong>"Generate Referral Code"</strong> di atas untuk memperoleh kode referral unik tim Anda.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Tab Upload - Conditional content */}
        <TabsContent value="upload">
          <div className="mia-card p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border/40">
              <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-2xl text-primary flex items-center justify-center flex-shrink-0">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                  Upload Karya
                </h3>
                <p className="text-xs text-muted-foreground">
                  {!activeRegistration.is_verified
                    ? "Verifikasi akun diperlukan sebelum dapat mengunggah karya."
                    : hasSubmissions
                      ? "Karya telah berhasil diunggah. Gunakan tab Status untuk melihat atau mengedit submission"
                      : !canEditSubmission
                        ? editLockReason
                        : "Unggah karya terbaikmu untuk mengikuti kompetisi ini"}
                </p>
              </div>
            </div>

            <div>
              {!activeRegistration.is_verified ? (
                // Jika belum diverifikasi, tampilkan pesan verifikasi
                <div className="text-center py-8 sm:py-12 space-y-6">
                  <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-amber-400" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">
                      Akun Belum Diverifikasi
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                      Untuk dapat mengunggah karya, akun Anda perlu diverifikasi
                      terlebih dahulu oleh admin. Proses verifikasi biasanya
                      memakan waktu 1-3 hari kerja.
                    </p>
                  </div>

                  <div className="bg-sky-500/10 border border-sky-500/25 rounded-2xl p-4 max-w-md mx-auto text-left">
                    <div className="flex items-start gap-3">
                      <div className="p-1 bg-sky-500/20 rounded-full mt-0.5 flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-sky-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sky-300 text-sm mb-1">
                          Status Verifikasi
                        </h4>
                        <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed">
                          Tim{" "}
                          <span className="font-semibold text-foreground">
                            {activeRegistration.team_name}
                          </span>{" "}
                          sedang dalam proses verifikasi admin.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span>Data registrasi telah diterima</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                      <span>Sedang dalam proses verifikasi admin</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full"></div>
                      <span>Akses upload karya akan tersedia</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-input/20 border border-border/30 rounded-2xl max-w-md mx-auto text-center space-y-1">
                    <p className="text-xs sm:text-sm font-semibold text-foreground">
                      Butuh bantuan?
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Jika verifikasi belum selesai dalam 3 hari kerja, silakan
                      hubungi kontak panitia.
                    </p>
                  </div>
                </div>
              ) : hasSubmissions ? (
                // Jika sudah ada submission, tampilkan pesan bahwa sudah upload
                <div className="text-center py-8 sm:py-12 space-y-6">
                  <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-400" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">
                      Karya Sudah Diunggah
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                      Anda sudah berhasil mengunggah karya untuk kompetisi ini.
                      Untuk mengubah submission, gunakan fitur edit.
                    </p>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 max-w-md mx-auto text-left">
                    <div className="flex items-start gap-3">
                      <div className="p-1 bg-emerald-500/20 rounded-full mt-0.5 flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-300 text-sm mb-1">
                          Status Submission
                        </h4>
                        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                          Karya Anda telah berhasil tersimpan dan siap untuk
                          direview juri.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setActiveTab("status")}
                    className="mia-btn-primary h-11 px-6 text-sm font-semibold rounded-full shadow-lg shadow-red-900/30 cursor-pointer inline-flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Lihat Status Submission</span>
                  </Button>
                </div>
              ) : !canEditSubmission ? (
                // Jika belum ada submission tapi pengumpulan ditutup
                <div className="text-center py-8 sm:py-12 space-y-6">
                  <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center">
                    <Lock className="h-10 w-10 sm:h-12 sm:w-12 text-rose-400" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">
                      Pengumpulan Karya Ditutup
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                      {editLockReason}
                    </p>
                  </div>

                  <div className="bg-input/40 border border-border/40 rounded-2xl p-4 max-w-md mx-auto text-left space-y-2.5 text-xs">
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>Batas Karya Sementara:</span>
                      <span className="font-semibold text-foreground">
                        {formatDeadlineDate(prelimDeadline)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>Batas Karya Final:</span>
                      <span className="font-semibold text-foreground">
                        {formatDeadlineDate(finalDeadline)}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setActiveTab("status")}
                    className="mia-btn-primary h-11 px-6 text-sm font-semibold rounded-full cursor-pointer inline-flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Lihat Status Submission</span>
                  </Button>
                </div>
              ) : (
                // Jika sudah diverifikasi dan belum ada submission, tampilkan form upload
                <SubmissionForm
                  registrationId={activeRegistration.registration_id}
                  onSuccess={() => {
                    setActiveTab("status");
                    queryClient.invalidateQueries(["mySubmissions"]);
                  }}
                />
              )}
            </div>
          </div>
        </TabsContent>

        {/* Tab Status - Selalu bisa diakses */}
        <TabsContent value="status">
          <div className="mia-card p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border/40">
              <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-2xl text-primary flex items-center justify-center flex-shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                  Status Submission & Feedback
                </h3>
                <p className="text-xs text-muted-foreground">
                  Detail karya yang telah diunggah dan masukan dari juri
                </p>
              </div>
            </div>

            {isLoadingSubmissions ? (
              <p className="text-sm text-muted-foreground animate-pulse py-4">
                Memuat data submission...
              </p>
            ) : (
              <div className="space-y-5">
                {submissions?.length > 0 ? (
                  <>
                    {/* Phase & Deadline notification banner */}
                    {!isSubmissionOpen ? (
                      <div className="bg-rose-500/10 border border-rose-500/25 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
                        <div className="p-1.5 bg-rose-500/20 border border-rose-500/30 rounded-full mt-0.5 flex-shrink-0">
                          <Lock className="h-4 w-4 text-rose-400" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-rose-300 text-sm sm:text-base">
                            Pengumpulan Karya Ditutup Sementara
                          </h4>
                          <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
                            Sesi pengumpulan karya saat ini sedang ditutup oleh panitia / admin. Anda tidak dapat melakukan perubahan atau penyuntingan submission saat ini.
                          </p>
                        </div>
                      </div>
                    ) : isPastFinal ? (
                      <div className="bg-neutral-900 border border-white/10 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
                        <div className="p-1.5 bg-white/10 border border-white/15 rounded-full mt-0.5 flex-shrink-0">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-foreground text-sm sm:text-base">
                            Batas Pengumpulan Karya Final Berakhir
                          </h4>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            Batas waktu pengumpulan karya final telah berakhir pada{" "}
                            <span className="font-semibold text-foreground">
                              {formatDeadlineDate(finalDeadline)}
                            </span>
                            . Seluruh submission telah dikunci secara permanen untuk tahap penjurian akhir.
                          </p>
                        </div>
                      </div>
                    ) : isPastPreliminary && !allowRevision ? (
                      <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
                        <div className="p-1.5 bg-amber-500/20 border border-amber-500/30 rounded-full mt-0.5 flex-shrink-0">
                          <Clock className="h-4 w-4 text-amber-400" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-amber-300 text-sm sm:text-base">
                            Batas Pengumpulan Karya Sementara Berakhir
                          </h4>
                          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                            Batas pengumpulan karya sementara telah berakhir pada{" "}
                            <span className="font-semibold text-white">
                              {formatDeadlineDate(prelimDeadline)}
                            </span>
                            . Karya Anda dikunci sementara menunggu panitia membuka fase perbaikan (revisi) sebelum batas karya final (
                            <span className="font-semibold text-white">
                              {formatDeadlineDate(finalDeadline)}
                            </span>
                            ).
                          </p>
                        </div>
                      </div>
                    ) : submissionPhase === "revision" ? (
                      <div className="bg-purple-500/10 border border-purple-500/25 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
                        <div className="p-1.5 bg-purple-500/20 border border-purple-500/30 rounded-full mt-0.5 flex-shrink-0">
                          <CheckCircle className="h-4 w-4 text-purple-400" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-purple-300 text-sm sm:text-base">
                            Fase Perbaikan (Revisi) Dibuka!
                          </h4>
                          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
                            Panitia telah membuka pengumpulan untuk fase perbaikan karya. Anda dapat memperbarui karya hingga batas karya final:{" "}
                            <span className="font-semibold text-white underline underline-offset-2">
                              {formatDeadlineDate(finalDeadline)}
                            </span>
                            . Gunakan tombol{" "}
                            <span className="font-semibold text-white">
                              Edit Karya
                            </span>{" "}
                            di bawah untuk melakukan revisi.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
                        <div className="p-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full mt-0.5 flex-shrink-0">
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-emerald-300 text-sm sm:text-base">
                            Karya Berhasil Diunggah!
                          </h4>
                          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                            Karya Anda telah berhasil diunggah. Anda masih dapat memperbarui karya hingga batas karya sementara:{" "}
                            <span className="font-semibold text-white">
                              {formatDeadlineDate(prelimDeadline)}
                            </span>
                            . Gunakan tombol{" "}
                            <span className="font-semibold text-white underline underline-offset-2">
                              Edit Karya
                            </span>{" "}
                            di bawah.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Submissions */}
                    {submissions.map((sub) => (
                      <div
                        key={sub.submission_id}
                        className={cn(
                          "mia-card !bg-input/30 !border-border/50 !rounded-2xl p-5 sm:p-6 transition-all space-y-4 shadow-md",
                          canEditSubmission
                            ? "hover:!border-primary/25"
                            : "opacity-95",
                        )}
                      >
                        <div className="space-y-4">
                          {/* Header Info */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/30 min-w-0">
                            <div className="space-y-1.5 min-w-0 flex-1">
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <h4 className="font-bold text-base sm:text-xl text-foreground break-words">
                                  {sub.project_name}
                                </h4>
                                <span
                                  className={cn(
                                    "text-xs px-3 py-0.5 rounded-full font-semibold border inline-flex items-center gap-1.5",
                                    sub.status === "PENDING"
                                      ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                                      : sub.status === "VERIFIED" ||
                                          sub.status === "APPROVED"
                                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                                        : "bg-rose-500/15 border-rose-500/30 text-rose-400",
                                  )}
                                >
                                  {sub.status}
                                </span>
                                {sub.score && (
                                  <span className="text-xs font-semibold text-muted-foreground bg-input/60 border border-border/40 px-2.5 py-0.5 rounded-full">
                                    Skor:{" "}
                                    <span className="font-bold text-foreground">
                                      {sub.score}
                                    </span>
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-y-1 gap-x-2.5 text-xs sm:text-sm text-muted-foreground">
                                <p className="font-medium">
                                  Tim: <span className="text-foreground">{sub.registration?.team_name || sub.team_name || activeRegistration?.team_name || "-"}</span>
                                </p>
                                <span>&bull;</span>
                                <p className="text-muted-foreground/80">
                                  Diupload:{" "}
                                  {new Date(sub.created_at).toLocaleString(
                                    "id-ID",
                                  )}
                                </p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                                <span className="inline-flex items-center gap-1.5 bg-input/50 border border-border/40 px-2.5 py-1 rounded-lg text-muted-foreground">
                                  <Clock className="w-3 h-3 text-amber-400" />
                                  Karya Sementara:{" "}
                                  <strong className="text-foreground">
                                    {formatDeadlineDate(prelimDeadline)}
                                  </strong>
                                </span>
                                <span className="inline-flex items-center gap-1.5 bg-input/50 border border-border/40 px-2.5 py-1 rounded-lg text-muted-foreground">
                                  <Clock className="w-3 h-3 text-red-400" />
                                  Karya Final:{" "}
                                  <strong className="text-foreground">
                                    {formatDeadlineDate(finalDeadline)}
                                  </strong>
                                </span>
                              </div>
                            </div>

                            {/* Highlighted Edit Button or Locked Button */}
                            <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
                              {canEditSubmission ? (
                                <Button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditSubmission(sub);
                                  }}
                                  className="w-full sm:w-auto rounded-full bg-gradient-to-r from-[#E01C20] to-[#FF4500] hover:from-[#c4181c] hover:to-[#e03d00] text-white text-xs sm:text-sm font-bold h-10 px-5 shadow-lg shadow-red-900/50 hover:shadow-red-600/60 ring-2 ring-red-500/30 hover:ring-red-400/50 transition-all hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center justify-center gap-2"
                                >
                                  <Edit className="h-4 w-4" />
                                  <span>Edit Karya</span>
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toast.warning("Pengumpulan Ditutup!", {
                                      description: editLockReason,
                                      duration: 4000,
                                    });
                                  }}
                                  className="w-full sm:w-auto rounded-full bg-input/40 border border-white/10 text-muted-foreground text-xs sm:text-sm font-semibold h-10 px-4 cursor-not-allowed inline-flex items-center justify-center gap-2 opacity-75 hover:bg-input/50"
                                  title={editLockReason}
                                >
                                  <Lock className="h-4 w-4 text-muted-foreground" />
                                  <span>Pengumpulan Ditutup</span>
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Thumbnail Karya jika ada */}
                          {(sub.thumbnail_url || sub.thumbnail) && (
                            <div className="p-4 bg-input/20 border border-border/30 rounded-xl space-y-2 text-xs sm:text-sm">
                              <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                                <ImageIcon className="h-4 w-4 text-[#FED700]" />
                                <span>Thumbnail Karya:</span>
                              </span>
                              <div className="relative aspect-video max-w-xs sm:max-w-sm w-full rounded-xl overflow-hidden border border-border/40 bg-black/40 shadow-inner group">
                                <img
                                  src={getSafeImageUrl(sub.thumbnail_url || sub.thumbnail)}
                                  alt={`Thumbnail Karya ${sub.project_name}`}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                />
                              </div>
                            </div>
                          )}

                          {/* Description & Flow Application */}
                          <div className="p-4 bg-input/20 border border-border/30 rounded-xl space-y-3 text-xs sm:text-sm min-w-0">
                            {sub.sub_theme && (
                              <div className="flex flex-col sm:grid sm:grid-cols-[120px_1fr] gap-1.5 sm:gap-4 items-start min-w-0 pb-2.5 border-b border-border/20">
                                <span className="font-semibold text-muted-foreground pt-0.5">
                                  Sub-Tema:
                                </span>
                                <div className="flex flex-wrap gap-1.5 min-w-0 max-w-full">
                                  {sub.sub_theme.split(',').map((themeItem, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300"
                                    >
                                      {themeItem.trim()}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div className="flex flex-col sm:grid sm:grid-cols-[120px_1fr] gap-1 sm:gap-4 items-start min-w-0">
                              <span className="font-semibold text-muted-foreground">
                                Deskripsi:
                              </span>
                              <span className="text-foreground/90 leading-relaxed break-words min-w-0 max-w-full">
                                {sub.description || "-"}
                              </span>
                            </div>
                            {sub.flow_application && (
                              <div className="flex flex-col sm:grid sm:grid-cols-[120px_1fr] gap-1 sm:gap-4 items-start pt-2.5 border-t border-border/20 min-w-0">
                                <span className="font-semibold text-muted-foreground">
                                  Flow Aplikasi:
                                </span>
                                <span className="text-foreground/90 leading-relaxed whitespace-pre-wrap break-words min-w-0">
                                  {sub.flow_application}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Links */}
                          {sub.links && sub.links.length > 0 && (
                            <div className="space-y-2 pt-1">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Berkas & Links:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {sub.links.map((link) => (
                                  <Button
                                    key={link.link_id}
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    onClick={(e) => e.stopPropagation()}
                                    title={link.description}
                                    className="h-8 rounded-full border border-border/30 dark:border-border/30 hover:border-white/40 bg-input/60 hover:bg-input text-foreground text-xs px-3.5 shadow-xs transition-all inline-flex items-center gap-1.5"
                                  >
                                    <a
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <LinkTypeIcon linkType={link.link_type} className="h-3 w-3" />
                                      <span>
                                        {getLinkTypeBadgeLabel(link.link_type)}
                                      </span>
                                    </a>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Feedback */}
                          {sub.feedback && (
                            <div className="p-4 bg-primary/10 border border-primary/25 rounded-2xl space-y-1">
                              <p className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
                                Feedback Juri:
                              </p>
                              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed break-words">
                                {sub.feedback}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="mia-card p-10 sm:p-12 text-center border !border-dashed border-border/60 rounded-2xl !bg-input/20 space-y-3 flex flex-col items-center justify-center">
                    <Award className="h-12 w-12 text-primary/60 animate-pulse mx-auto" />
                    <p className="text-base font-semibold text-foreground">
                      Belum ada karya yang diunggah.
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                      {activeRegistration.is_verified
                        ? "Upload karya pertama Anda di tab Upload!"
                        : "Tunggu verifikasi akun untuk dapat mengupload karya."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal Edit Submission */}
      <EditSubmissionModal
        open={!!editingSubmission && canEditSubmission}
        onClose={handleCloseEditModal}
        registrationId={activeRegistration.registration_id}
        editingSubmission={editingSubmission}
      />
      {/* Modal Edit Team */}
      <EditTeamModal
        open={editTeamModalOpen}
        onClose={() => setEditTeamModalOpen(false)}
        registration={activeRegistration}
      />
    </div>
  );
}
