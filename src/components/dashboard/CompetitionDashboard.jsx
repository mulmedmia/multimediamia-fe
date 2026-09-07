"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Award,
  Star,
  Edit,
  Users,
  CheckCircle,
  ExternalLink,
  FileText,
} from "lucide-react";
import { SubmissionForm } from "@/components/forms/SubmissionForm";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { getMySubmissions } from "@/services/submission.service";
import {
  getCompetitionSchedule,
  getLeaderboard,
  getRegistrationById,
} from "@/services/competition.service";
import {
  getGamificationData,
  redeemPoints,
} from "@/services/gamification.service";
import { EditTeamModal } from "./EditTeamModal";
import { EditSubmissionModal } from "./EditSubmissionModal";

export function CompetitionDashboard({ registration, initialTab = "beranda" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [editTeamModalOpen, setEditTeamModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Ubah query untuk menggunakan getMySubmissions
  const { data: submissionsData, isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ["mySubmissions"],
    queryFn: () => getMySubmissions(1, 10),
  });

  // Tambahkan query untuk memantau perubahan registration data
  const { data: currentRegistration } = useQuery({
    queryKey: ["registration", registration.registration_id],
    queryFn: () => getRegistrationById(registration.registration_id),
    initialData: registration,
    staleTime: 0, // Selalu fetch data terbaru
  });

  const activeRegistration = currentRegistration || registration;

  // Filter submissions berdasarkan kategori registration
  const submissions =
    submissionsData?.submissions?.filter(
      (sub) => sub.category_id === activeRegistration.category_id,
    ) || [];

  // Check apakah user sudah punya submission
  const hasSubmissions = submissions.length > 0;

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
    } else {
      setActiveTab(initialTab);
    }
  }, [initialTab, hasSubmissions, activeRegistration.is_verified]);

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
        description: "Gunakan fitur edit submission untuk mengubah karya Anda.",
        duration: 4000,
      });
      setActiveTab("status"); // Tetap di tab status
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

  const { data: gamificationData, isLoading: isLoadingGamification } = useQuery(
    {
      queryKey: ["gamification", activeRegistration.registration_id],
      queryFn: () => getGamificationData(activeRegistration.registration_id),
      enabled: !!activeRegistration.registration_id,
    },
  );

  const { data: schedule, isLoading: isLoadingSchedule } = useQuery({
    queryKey: ["schedule", activeRegistration.category.category_id],
    queryFn: () =>
      getCompetitionSchedule(activeRegistration.category.category_id),
    enabled: !!activeRegistration.category.category_id,
    placeholderData: [],
  });

  const { data: leaderboard, isLoading: isLoadingLeaderboard } = useQuery({
    queryKey: ["leaderboard", activeRegistration.category.category_id],
    queryFn: () => getLeaderboard(activeRegistration.category.category_id),
    enabled: !!activeRegistration.category.category_id,
    placeholderData: [],
  });

  const handleEditSubmission = (submission) => {
    setEditingSubmission(submission);
  };

  const handleCloseEditModal = () => {
    setEditingSubmission(null);
  };

  const redeemMutation = useMutation({
    mutationFn: redeemPoints,
    onSuccess: () => {
      toast.success("Hadiah berhasil ditukar!");
      queryClient.invalidateQueries({
        queryKey: ["gamification", activeRegistration.registration_id],
      });
    },
    onError: (error) => {
      toast.error(
        "Gagal menukar poin: " + (error.message || "Terjadi kesalahan"),
      );
    },
  });

  const handleRedeem = (itemId) => {
    redeemMutation.mutate(itemId);
  };

  const progressValue =
    submissions?.length > 0
      ? (submissions.filter((s) => s.status === "Dinilai").length / 3) * 100
      : 0;

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {activeRegistration.category.name}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Selamat berkompetisi,{" "}
            <span className="text-foreground font-medium">
              {activeRegistration.team_name || "Nama Tim"}
            </span>
            !
          </p>
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
            disabled={!activeRegistration.is_verified || hasSubmissions}
            data-disabled={!activeRegistration.is_verified || hasSubmissions}
            className={
              !activeRegistration.is_verified || hasSubmissions
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
                    <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                      Informasi Tim
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Detail nama dan anggota tim yang terdaftar
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
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
                  disabled={hasSubmissions}
                  className={cn(
                    "rounded-full border border-white/20 hover:border-white/40 bg-input/40 hover:bg-input text-foreground text-xs font-semibold h-9 px-4 transition-all shadow-xs inline-flex items-center gap-1.5",
                    hasSubmissions
                      ? "opacity-50 cursor-not-allowed hover:bg-input/40 hover:border-white/20"
                      : "cursor-pointer",
                  )}
                  title={
                    hasSubmissions
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

            {/* Progress & Points Card */}
            <div className="mia-card p-6 sm:p-7 shadow-xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-2xl text-primary flex items-center justify-center flex-shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                    Ringkasan & Progress Kompetisi
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Pantau kemajuan pengerjaan dan poin yang terkumpul
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2.5 p-4 bg-input/30 border border-border/40 rounded-2xl">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Progress Kompetisi
                  </p>
                  <Progress
                    value={progressValue}
                    className="w-full h-3 bg-input/60"
                  />
                  <p className="text-xs text-muted-foreground text-right pt-1 font-medium">
                    {Math.round(progressValue)}% Selesai
                  </p>
                </div>

                <div className="space-y-1 p-4 bg-input/30 border border-border/40 rounded-2xl">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Total Skor Anda
                  </p>
                  <p className="text-3xl font-extrabold text-foreground tracking-tight">
                    {isLoadingGamification
                      ? "Memuat..."
                      : gamificationData?.points || 0}{" "}
                    <span className="text-lg font-bold text-primary">Poin</span>
                  </p>
                </div>
              </div>
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
                    {/* Success notification */}
                    <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
                      <div className="p-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full mt-0.5 flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-emerald-300 text-sm sm:text-base">
                          Karya Berhasil Diunggah!
                        </h4>
                        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                          Karya Anda telah berhasil diunggah dan sedang menunggu
                          review dari juri.{" "}
                          <br className="hidden md:inline-block" />
                          Anda masih dapat mengedit submission dengan mengklik
                          pada kartu karya di bawah.
                        </p>
                      </div>
                    </div>

                    {/* Submissions */}
                    {submissions.map((sub) => (
                      <div
                        key={sub.submission_id}
                        onClick={() => handleEditSubmission(sub)}
                        className="mia-card !bg-input/30 !border-border/50 hover:!border-primary/25 !rounded-2xl p-5 sm:p-6 transition-all space-y-4 cursor-pointer shadow-md"
                      >
                        <div className="space-y-4">
                          {/* Header Info */}
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex space-x-2">
                                <h4 className="font-bold text-base sm:text-lg text-foreground transition-colors flex items-center gap-2.5 flex-wrap pt-1 sm:pt-0">
                                  {sub.project_name}
                                  <span className="text-[11px] font-medium text-muted-foreground bg-input/60 border border-border/40 px-2.5 py-0.5 rounded-full hidden sm:inline-block">
                                    Klik untuk edit
                                  </span>
                                </h4>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-full border border-white/20 hover:border-white/40 bg-input/40 hover:bg-input text-foreground text-xs font-semibold h-9 px-4 transition-all shadow-xs inline-flex sm:hidden items-center gap-1.5 cursor-pointer dark:border-border/30"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                  <span>Edit</span>
                                </Button>
                              </div>
                              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                                Tim: {sub.team_name}
                              </p>
                              <p className="text-xs text-muted-foreground/80">
                                Diupload:{" "}
                                {new Date(sub.created_at).toLocaleString(
                                  "id-ID",
                                )}
                              </p>
                            </div>
                            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "text-xs px-3 py-1 rounded-full font-semibold border inline-flex items-center gap-1.5",
                                    sub.status === "PENDING"
                                      ? "bg-input/60 border-border/50 text-muted-foreground"
                                      : sub.status === "VERIFIED" ||
                                          sub.status === "APPROVED"
                                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                                        : "bg-rose-500/15 border-rose-500/30 text-rose-400",
                                  )}
                                >
                                  {sub.status}
                                </span>
                              </div>
                              {sub.score && (
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground pr-2">
                                  Skor:{" "}
                                  <span className="font-bold text-foreground">
                                    {sub.score}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Description & Flow Application */}
                          <div className="p-4 bg-input/20 border border-border/30 rounded-xl space-y-3 text-xs sm:text-sm min-w-0">
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
                                      <ExternalLink className="h-3 w-3" />
                                      <span>{link.link_type}</span>
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
                              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
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
        open={!!editingSubmission}
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
