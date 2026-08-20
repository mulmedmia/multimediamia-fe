"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Calendar,
  Award,
  Star,
  BookOpen,
  Edit,
  Users,
  Gift,
  CheckCircle,
  ExternalLink,
  FileText,
} from "lucide-react";
import { SubmissionForm } from "@/components/forms/SubmissionForm";
import { toast } from "sonner"; // Import toast

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
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {activeRegistration.category.name}
          </h2>
          <p className="text-muted-foreground">
            Selamat berkompetisi, {activeRegistration.team_name}!
          </p>
        </div>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-4"
      >
        {/* Tab List - Selalu tampilkan 3 tab */}
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="beranda" className="cursor-pointer">
            <Star className="mr-1 h-4 w-4" />
            Beranda
          </TabsTrigger>

          {/* Tab Upload - Selalu tampil, tapi conditional disabled */}
          <TabsTrigger
            value="upload"
            disabled={!activeRegistration.is_verified || hasSubmissions}
            data-disabled={!activeRegistration.is_verified || hasSubmissions}
            className={
              !activeRegistration.is_verified || hasSubmissions
                ? "opacity-50 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:pointer-events-auto"
                : "cursor-pointer"
            }
          >
            <Upload className="mr-1 h-4 w-4" />
            Upload
          </TabsTrigger>

          {/* Tab Status - Selalu tampil */}
          <TabsTrigger value="status" className="cursor-pointer">
            <Award className="mr-1 h-4 w-4" />
            Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="beranda">
          <div className="space-y-4">
            {/* Team Information Card - BARU */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Informasi Tim
                  </CardTitle>
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
                    className={`flex items-center gap-2 ${
                      hasSubmissions
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    title={
                      hasSubmissions
                        ? "Tidak dapat mengedit tim setelah mengupload karya"
                        : "Edit informasi tim"
                    }
                  >
                    <Edit className="h-4 w-4" />
                    Edit Tim
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Nama Tim */}
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Nama Tim
                  </Label>
                  <p className="text-lg font-semibold mt-1">
                    {activeRegistration.team_name || "Tidak ada nama tim"}
                  </p>
                </div>

                {/* Anggota Tim */}
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Anggota Tim ({teamMembers.length} orang)
                  </Label>
                  <div className="mt-2 space-y-2">
                    {teamMembers.length > 0 ? (
                      teamMembers.map((member, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                        >
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                            {member.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{member}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        Belum ada anggota tim yang terdaftar
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Verifikasi */}
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Status Verifikasi
                  </Label>
                  <div className="mt-1">
                    <Badge
                      variant={
                        activeRegistration.is_verified ? "default" : "secondary"
                      }
                      className={
                        activeRegistration.is_verified
                          ? "bg-green-600 text-white"
                          : "bg-orange-600 text-white"
                      }
                    >
                      {activeRegistration.is_verified
                        ? "Terverifikasi"
                        : "Menunggu Verifikasi"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activeRegistration.is_verified
                      ? "Tim Anda sudah diverifikasi dan dapat mengupload karya"
                      : "Tim Anda sedang dalam proses verifikasi admin"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Existing Progress & Points Card */}
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Kompetisi</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="font-medium">Progress Kompetisi</p>
                  <Progress value={progressValue} className="w-full mt-2" />
                </div>
                <div>
                  <p className="font-medium">Total Poin Anda</p>
                  <p className="text-2xl font-bold">
                    {isLoadingGamification
                      ? "Memuat..."
                      : `${gamificationData?.points || 0} Poin`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Upload - Conditional content */}
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Karya</CardTitle>
              <CardDescription>
                {!activeRegistration.is_verified
                  ? "Verifikasi akun diperlukan sebelum dapat mengunggah karya."
                  : hasSubmissions
                    ? "Anda sudah mengupload karya. Gunakan fitur edit untuk mengubah submission."
                    : "Unggah atau perbarui karya Anda sesuai fase kompetisi."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!activeRegistration.is_verified ? (
                // Jika belum diverifikasi, tampilkan pesan verifikasi
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="h-12 w-12 text-orange-600 dark:text-orange-400" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Akun Belum Diverifikasi
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Untuk dapat mengunggah karya, akun Anda perlu diverifikasi
                    terlebih dahulu oleh admin. Proses verifikasi biasanya
                    memakan waktu 1-3 hari kerja.
                  </p>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 max-w-md mx-auto">
                    <div className="flex items-start gap-3">
                      <div className="p-1 bg-blue-500 rounded-full mt-0.5">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                          Status Verifikasi
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-200">
                          Tim{" "}
                          <span className="font-semibold">
                            {activeRegistration.team_name}
                          </span>{" "}
                          sedang dalam proses verifikasi.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Data registrasi telah diterima</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      <span>Sedang dalam proses verifikasi admin</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                      <span>Akses upload karya akan tersedia</span>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg max-w-md mx-auto">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Butuh bantuan?</strong>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Jika proses verifikasi memakan waktu lebih dari 3 hari
                      kerja, silakan hubungi admin melalui kontak yang tersedia.
                    </p>
                  </div>
                </div>
              ) : hasSubmissions ? (
                // Jika sudah ada submission, tampilkan pesan bahwa sudah upload
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Karya Sudah Diunggah
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Anda sudah berhasil mengupload karya untuk kompetisi ini.
                    Untuk mengubah atau memperbarui submission, gunakan fitur
                    edit.
                  </p>

                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6 max-w-md mx-auto">
                    <div className="flex items-start gap-3">
                      <div className="p-1 bg-green-500 rounded-full mt-0.5">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium text-green-800 dark:text-green-300 mb-1">
                          Status Submission
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-200">
                          Karya Anda telah berhasil diunggah dan sedang dalam
                          proses review.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setActiveTab("status")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Lihat Status Submission
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Status - Selalu bisa diakses */}
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Status Submission & Feedback</CardTitle>
              {hasSubmissions && (
                <CardDescription>
                  Karya Anda telah berhasil diunggah. Anda dapat mengedit
                  submission dengan mengklik pada kartu submission.
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {isLoadingSubmissions ? (
                <p>Memuat data submission...</p>
              ) : (
                <div className="space-y-4">
                  {submissions?.length > 0 ? (
                    <>
                      {/* Success notification */}
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                          <div className="p-1 bg-green-500 rounded-full mt-0.5">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-green-800 dark:text-green-300 mb-1">
                              Karya Berhasil Diunggah!
                            </h4>
                            <p className="text-sm text-green-700 dark:text-green-200">
                              Karya Anda telah berhasil diunggah dan sedang
                              menunggu review dari juri. Anda masih dapat
                              mengedit submission dengan mengklik pada kartu di
                              bawah.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Submissions */}
                      {submissions.map((sub) => (
                        <Card
                          key={sub.submission_id}
                          className="p-4 cursor-pointer hover:shadow-md transition-shadow duration-200 border-2 hover:border-primary/20"
                          onClick={() => handleEditSubmission(sub)}
                        >
                          <div className="space-y-3">
                            {/* Header Info */}
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                  {sub.project_name}
                                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                    Klik untuk edit
                                  </span>
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Tim: {sub.team_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Diupload:{" "}
                                  {new Date(sub.created_at).toLocaleString(
                                    "id-ID",
                                  )}
                                </p>
                              </div>
                              <div className="text-right space-y-1">
                                <Badge
                                  variant={
                                    sub.status === "PENDING"
                                      ? "secondary"
                                      : sub.status === "VERIFIED" ||
                                          sub.status === "APPROVED"
                                        ? "default"
                                        : "destructive"
                                  }
                                >
                                  {sub.status}
                                </Badge>
                                {sub.score && (
                                  <p className="text-sm font-medium">
                                    Skor: {sub.score}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Description */}
                            <div>
                              <p className="text-sm">
                                <span className="font-medium">Deskripsi: </span>
                                {sub.description}
                              </p>
                              <p className="text-sm mt-1">
                                <span className="font-medium">
                                  Flow Aplikasi:{" "}
                                </span>
                                {sub.flow_application}
                              </p>
                            </div>

                            {/* Links */}
                            {sub.links && sub.links.length > 0 && (
                              <div>
                                <p className="text-sm font-medium mb-2">
                                  Links:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {sub.links.map((link) => (
                                    <Button
                                      key={link.link_id}
                                      variant="outline"
                                      size="sm"
                                      asChild
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1"
                                      >
                                        <ExternalLink className="h-3 w-3" />
                                        {link.link_type}
                                      </a>
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Feedback */}
                            {sub.feedback && (
                              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                                  Feedback Juri:
                                </p>
                                <p className="text-sm text-blue-700 dark:text-blue-200">
                                  {sub.feedback}
                                </p>
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}
                    </>
                  ) : (
                    <Card className="p-8">
                      <div className="text-center text-muted-foreground">
                        <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Belum ada karya yang diunggah.</p>
                        <p className="text-sm">
                          {activeRegistration.is_verified
                            ? "Upload karya pertama Anda di tab Upload!"
                            : "Tunggu verifikasi akun untuk dapat mengupload karya."}
                        </p>
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal Edit Submission */}
      {editingSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Edit Submission</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseEditModal}
                  className="h-8 w-8 p-0"
                >
                  ✕
                </Button>
              </div>

              <SubmissionForm
                registrationId={activeRegistration.registration_id}
                editingSubmission={editingSubmission}
                onSuccess={() => {
                  handleCloseEditModal();
                  queryClient.invalidateQueries(["mySubmissions"]);
                  toast.success("Submission berhasil diperbarui!");
                }}
                onCancel={handleCloseEditModal}
              />
            </div>
          </div>
        </div>
      )}
      {/* Modal Edit Team */}
      <EditTeamModal
        open={editTeamModalOpen}
        onClose={() => setEditTeamModalOpen(false)}
        registration={activeRegistration}
      />
    </div>
  );
}
