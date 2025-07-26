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
  Users,
  Gift,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { SubmissionForm } from "@/components/forms/SubmissionForm";

import { getMySubmissions } from "@/services/submission.service"; // Ubah import
import {
  getCompetitionSchedule,
  getLeaderboard,
} from "@/services/competition.service";
import {
  getGamificationData,
  redeemPoints,
} from "@/services/gamification.service";

export function CompetitionDashboard({ registration, initialTab = "beranda" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [editingSubmission, setEditingSubmission] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Ubah query untuk menggunakan getMySubmissions
  const { data: submissionsData, isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ["mySubmissions"],
    queryFn: () => getMySubmissions(1, 10),
  });

  // Filter submissions berdasarkan kategori registration
  const submissions =
    submissionsData?.submissions?.filter(
      (sub) => sub.category_id === registration.category_id
    ) || [];
  const { data: gamificationData, isLoading: isLoadingGamification } = useQuery(
    {
      queryKey: ["gamification", registration.registration_id],
      queryFn: () => getGamificationData(registration.registration_id),
      enabled: !!registration.registration_id,
    }
  );

  const { data: schedule, isLoading: isLoadingSchedule } = useQuery({
    queryKey: ["schedule", registration.category.category_id],
    queryFn: () => getCompetitionSchedule(registration.category.category_id),
    enabled: !!registration.category.category_id,
    placeholderData: [],
  });

  const { data: leaderboard, isLoading: isLoadingLeaderboard } = useQuery({
    queryKey: ["leaderboard", registration.category.category_id],
    queryFn: () => getLeaderboard(registration.category.category_id),
    enabled: !!registration.category.category_id,
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
      alert("Hadiah berhasil ditukar!");
      queryClient.invalidateQueries({
        queryKey: ["gamification", registration.registration_id],
      });
    },
    onError: (error) => {
      alert("Gagal menukar poin: " + (error.message || "Terjadi kesalahan"));
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
            {registration.category.name}
          </h2>
          <p className="text-muted-foreground">
            Selamat berkompetisi, Tim {registration.team_name}!
          </p>
        </div>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="beranda">
            <Star className="mr-1 h-4 w-4" />
            Beranda
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="mr-1 h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="status">
            <Award className="mr-1 h-4 w-4" />
            Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="beranda">
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan</CardTitle>
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
        </TabsContent>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Karya</CardTitle>
              <CardDescription>
                Unggah atau perbarui karya Anda sesuai fase kompetisi.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubmissionForm
                registrationId={registration.registration_id}
                onSuccess={() => {
                  setActiveTab("status");
                  queryClient.invalidateQueries(["mySubmissions"]);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Status Submission & Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingSubmissions ? (
                <p>Memuat data submission...</p>
              ) : (
                <div className="space-y-4">
                  {submissions?.length > 0 ? (
                    submissions.map((sub) => (
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
                                  "id-ID"
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
                              <p className="text-sm font-medium mb-2">Links:</p>
                              <div className="flex flex-wrap gap-2">
                                {sub.links.map((link) => (
                                  <Button
                                    key={link.link_id}
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    onClick={(e) => e.stopPropagation()} // Prevent card click when clicking link
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
                    ))
                  ) : (
                    <Card className="p-8">
                      <div className="text-center text-muted-foreground">
                        <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Belum ada karya yang diunggah.</p>
                        <p className="text-sm">
                          Upload karya pertama Anda di tab Upload!
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
                registrationId={registration.registration_id}
                editingSubmission={editingSubmission}
                onSuccess={() => {
                  handleCloseEditModal();
                  queryClient.invalidateQueries(["mySubmissions"]);
                }}
                onCancel={handleCloseEditModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
