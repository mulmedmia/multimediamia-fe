"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  User,
  Trophy,
  FileText,
  Link2,
  CheckCircle2,
  XCircle,
  Star,
  Github,
  Globe,
  LinkIcon,
  Youtube,
  ExternalLink,
  Sparkles,
  Calendar,
  Play,
  Save,
  Loader2,
} from "lucide-react";
import { usePatchSubmissionScore } from "@/hooks/admin-use-submission";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const scoreFeedbackSchema = z.object({
  score: z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined ? undefined : Number(val),
    z
      .number({
        required_error: "Skor wajib diisi",
        invalid_type_error: "Skor harus berupa angka",
      })
      .min(0, "Skor minimal 0")
      .max(100, "Skor maksimal 100"),
  ),
  feedback: z
    .string()
    .trim()
    .min(3, "Feedback minimal 3 karakter")
    .max(400, "Feedback maksimal 400 karakter")
    .optional()
    .or(z.literal("")),
});

export default function JuriSubmissionDetailPage(props) {
  const params =
    typeof props.params?.then === "function"
      ? React.use(props.params)
      : props.params;
  const submissionId = params?.submissionId;

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const patchScore = usePatchSubmissionScore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(scoreFeedbackSchema),
    defaultValues: {
      score: "",
      feedback: "",
    },
  });

  useEffect(() => {
    if (!submissionId) {
      setError("ID submission tidak ditemukan");
      setLoading(false);
      return;
    }

    const fetchSubmissionById = async () => {
      setLoading(true);
      setError(null);
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${BASE_URL}/submissions/${submissionId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Submission tidak ditemukan");
          } else if (response.status === 403) {
            throw new Error(
              "Tidak memiliki akses untuk melihat submission ini",
            );
          } else {
            throw new Error(
              `Gagal mengambil data submission (${response.status})`,
            );
          }
        }

        const result = await response.json();

        if (result.status && result.data) {
          setSubmission(result.data);
          reset({
            score: result.data.score ?? "",
            feedback: result.data.feedback ?? "",
          });
        } else {
          throw new Error(result.message || "Data submission tidak valid");
        }
      } catch (err) {
        console.error("Error fetching submission:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissionById();
  }, [submissionId, reset]);

  const getLinkIcon = (linkType) => {
    switch (linkType?.toLowerCase()) {
      case "github":
        return <Github className="h-4 w-4" />;
      case "youtube":
        return <Youtube className="h-4 w-4" />;
      case "demo":
      case "preview":
      case "live":
      case "other":
        return <Globe className="h-4 w-4" />;
      case "documentation":
      case "docs":
        return <FileText className="h-4 w-4" />;
      default:
        return <LinkIcon className="h-4 w-4" />;
    }
  };

  const convertToEmbedUrl = (url) => {
    if (!url) return null;

    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      const videoId = match[2];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return null;
  };

  const getYouTubeVideoUrl = () => {
    if (!submission?.links) return null;

    const youtubeLink = submission.links.find(
      (link) => link.link_type?.toLowerCase() === "youtube",
    );

    if (youtubeLink?.url) {
      return convertToEmbedUrl(youtubeLink.url);
    }

    return null;
  };

  const getNonYouTubeLinks = () => {
    if (!submission?.links) return [];

    return submission.links.filter(
      (link) => link.link_type?.toLowerCase() !== "youtube",
    );
  };

  const onFormSubmit = async (formData) => {
    setSaving(true);
    const parsedScore = Number(formData.score);
    const trimmedFeedback = formData.feedback ? formData.feedback.trim() : "";

    patchScore.mutate(
      { id: submissionId, score: parsedScore, feedback: trimmedFeedback },
      {
        onSuccess: (response) => {
          if (response.status) {
            setSubmission((prev) => ({
              ...prev,
              score: parsedScore,
              feedback: trimmedFeedback,
            }));
          } else {
            throw new Error(response.message || "Gagal menyimpan penilaian");
          }
        },
        onError: (err) => {
          console.error("Error saving score:", err);
          alert("Terjadi kesalahan: " + err.message);
        },
        onSettled: () => {
          setSaving(false);
        },
      },
    );
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-mia-red border-t-transparent mx-auto"></div>
        <p className="text-sm md:text-base text-mia-muted">
          Memuat detail karya...
        </p>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-2xl mia-card p-8 md:p-12 text-center space-y-5">
          <div className="w-14 h-14 bg-mia-red/15 border border-mia-red/30 text-mia-red rounded-2xl flex items-center justify-center mx-auto">
            <XCircle className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-mia-text">
              {error ? "Terjadi Kesalahan" : "Karya Tidak Ditemukan"}
            </h2>
            <p className="text-sm text-mia-muted">
              {error ||
                "Submission yang Anda cari tidak ditemukan atau mungkin telah dihapus."}
            </p>
          </div>
          <Button variant="outline" className="cursor-pointer" asChild>
            <Link href="/juri/manage-submission">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Manage Submission
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-6 md:space-y-8">
      {/* Back Button */}
      <Button variant="outline" asChild>
        <Link href="/juri/manage-submission">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Manage Submission
        </Link>
      </Button>

      {/* Header Section - Split into 2 Cards with Larger Video */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Card - Main Project Info */}
        <div className="lg:col-span-5 mia-card p-6 md:p-8 flex flex-col justify-center min-w-0">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-mia-red/20 border border-mia-red/30 rounded-xl text-mia-red flex-shrink-0">
              <Sparkles className="h-6 w-6 md:h-7 md:w-7" />
            </div>

            <div className="flex-1 min-w-0 space-y-4">
              <div className="space-y-1.5">
                <span className="text-[11px] uppercase tracking-wider text-mia-muted font-semibold block">
                  Penilaian Karya Peserta MIA
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-mia-text leading-tight break-words">
                  {submission.project_name}
                </h1>
                <p className="text-sm text-mia-muted pt-0.5 break-words">
                  oleh Tim{" "}
                  <strong className="text-mia-text">
                    {submission.team_name}
                  </strong>{" "}
                  • {submission.user?.name}
                </p>
              </div>

              {/* Inline Meta Items (Rounded Pills Layout) */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs font-medium">
                {/* Status */}
                <div
                  className={cn(
                    "px-3.5 py-1.5 rounded-full border inline-flex items-center gap-1.5",
                    submission.status === "APPROVED"
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                      : submission.status === "PENDING"
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                        : "bg-rose-500/10 border-rose-500/40 text-rose-400",
                  )}
                >
                  {submission.status === "APPROVED" ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : submission.status === "PENDING" ? (
                    <Sparkles className="h-3.5 w-3.5" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5" />
                  )}
                  <span>
                    {submission.status === "APPROVED"
                      ? "Disetujui"
                      : submission.status === "PENDING"
                        ? "Pending"
                        : "Ditolak"}
                  </span>
                </div>

                {/* Skor */}
                <div className="px-3.5 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 inline-flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>
                    {submission.score !== undefined &&
                    submission.score !== null &&
                    submission.score > 0
                      ? `Skor: ${submission.score}`
                      : "Belum Dinilai"}
                  </span>
                </div>

                {/* Kategori */}
                <div className="px-3.5 py-1.5 rounded-full bg-purple-900/60 border border-purple-500/50 text-purple-200 inline-flex items-center gap-1.5">
                  <Trophy className="h-3.5 w-3.5 text-purple-300" />
                  <span>
                    {submission.category?.name ||
                      submission.category?.category_name ||
                      "-"}
                  </span>
                </div>

                {/* Tanggal */}
                <div className="px-3.5 py-1.5 rounded-full bg-[#1E2939]/80 border border-white/10 text-mia-text inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-mia-muted" />
                  <span>
                    {new Date(submission.created_at).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card - Video Preview */}
        <div className="lg:col-span-7 mia-card p-3 sm:p-4 md:p-5 flex flex-col justify-center overflow-hidden shadow-2xl">
          <div className="aspect-video w-full bg-mia-surface rounded-xl overflow-hidden border border-white/10 relative shadow-inner">
            {getYouTubeVideoUrl() ? (
              <iframe
                src={getYouTubeVideoUrl()}
                width="100%"
                height="100%"
                title={submission.project_name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-mia-muted space-y-2 p-8">
                <div className="w-14 h-14 rounded-full bg-[#1E2939] flex items-center justify-center text-mia-muted-2">
                  <Play className="h-7 w-7 ml-0.5 opacity-60" />
                </div>
                <span className="text-xs sm:text-sm text-center text-mia-muted-2">
                  Video presentasi tidak disematkan
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Penilaian Juri Card */}
      <div className="mia-card p-6 md:p-8 space-y-6 border border-mia-red/40 bg-mia-surface/90 shadow-2xl">
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-400">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-mia-text">
                Form Penilaian Juri
              </h3>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Input Skor */}
            <div className="space-y-2">
              <label
                htmlFor="juri-score-input"
                className="text-xs font-semibold text-mia-muted-2 uppercase tracking-wider block"
              >
                Skor (0 - 100) <span className="text-mia-red">*</span>
              </label>
              <Input
                id="juri-score-input"
                type="number"
                min="0"
                max="100"
                placeholder="0"
                {...register("score")}
                className={cn(
                  "h-11 bg-input dark:bg-input/30 rounded-xl px-4 text-sm text-foreground placeholder:text-mia-muted-2 transition-all",
                  errors.score
                    ? "border-destructive focus-visible:ring-destructive"
                    : "border-border focus-visible:border-ring focus-visible:ring-ring/50",
                )}
              />
              {errors.score && (
                <p className="text-xs text-mia-red font-medium mt-1">
                  {errors.score.message}
                </p>
              )}
            </div>

            {/* Input Feedback */}
            <div className="md:col-span-2 space-y-2">
              <label
                htmlFor="juri-feedback-input"
                className="text-xs font-semibold text-mia-muted-2 uppercase tracking-wider block"
              >
                Feedback
              </label>
              <Textarea
                id="juri-feedback-input"
                rows={3}
                placeholder="Tuliskan feedback masukan untuk peserta..."
                {...register("feedback")}
                className={cn(
                  "bg-input dark:bg-input/30 rounded-xl p-3.5 text-sm text-foreground placeholder:text-mia-muted-2 transition-colors focus-visible:ring-offset-0 focus-visible:outline-none",
                  errors.feedback
                    ? "border-destructive focus-visible:ring-destructive"
                    : "border-border focus-visible:border-ring focus-visible:ring-ring/50",
                )}
              />
              {errors.feedback && (
                <p className="text-xs text-mia-red font-medium mt-1">
                  {errors.feedback.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-white/10">
            <button
              type="submit"
              disabled={saving}
              className="mia-btn-primary h-11 px-7 text-sm font-semibold rounded-full shadow-lg shadow-red-900/40 cursor-pointer inline-flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Simpan Penilaian</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Content Layout */}
      <div className="space-y-6 md:space-y-8">
        {/* Row 1: Identitas Peserta (5 cols) & Info Lomba (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Identitas Peserta - 5 cols */}
          <div className="lg:col-span-5 mia-card p-6 space-y-4 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-center gap-3 pb-2 border-b border-white/10 mb-4">
                <div className="p-2 bg-mia-red/15 border border-mia-red/30 rounded-lg text-mia-red">
                  <User className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg text-mia-text">
                  Identitas Peserta
                </h3>
              </div>
              <div className="space-y-3.5">
                <div>
                  <span className="text-xs font-semibold text-mia-muted-2 uppercase tracking-wide block mb-0.5">
                    Nama Peserta
                  </span>
                  <span className="text-sm font-medium text-mia-text break-words">
                    {submission.user?.name || "-"}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-mia-muted-2 uppercase tracking-wide block mb-0.5">
                    Email Kontak
                  </span>
                  <span className="text-sm text-mia-muted break-words">
                    {submission.user?.email || "-"}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-mia-muted-2 uppercase tracking-wide block mb-0.5">
                    Nama Tim
                  </span>
                  <span className="text-sm text-mia-muted break-words">
                    {submission.team_name || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status & Detail - 7 cols */}
          <div className="lg:col-span-7 mia-card p-6 space-y-4 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-center gap-3 pb-2 border-b border-white/10 mb-4">
                <div className="p-2 bg-purple-500/15 border border-purple-500/30 rounded-lg text-purple-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg text-mia-text">
                  Status & Detail
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <span className="text-xs font-semibold text-mia-muted-2 uppercase tracking-wide block mb-1">
                    Status Verifikasi
                  </span>
                  <div className="flex items-center gap-2">
                    {submission.is_verified ? (
                      <div className="flex items-center gap-1.5 text-mia-success text-sm font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Terverifikasi</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-mia-muted text-sm font-medium">
                        <XCircle className="h-4 w-4 opacity-50" />
                        <span>Belum Terverifikasi Khusus</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-mia-muted-2 uppercase tracking-wide block mb-0.5">
                    Waktu Diunggah
                  </span>
                  <span className="text-sm font-medium text-mia-text break-words">
                    {submission.created_at
                      ? new Date(submission.created_at).toLocaleString(
                          "id-ID",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          },
                        )
                      : "-"}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-mia-muted-2 uppercase tracking-wide block mb-0.5">
                    Terakhir Diperbarui
                  </span>
                  <span className="text-sm text-mia-muted break-words">
                    {submission.updated_at
                      ? new Date(submission.updated_at).toLocaleString(
                          "id-ID",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          },
                        )
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Deskripsi Proyek */}
        <div className="mia-card p-6 md:p-8 space-y-4 min-w-0">
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
            <FileText className="h-5 w-5 text-mia-red" />
            <h3 className="font-bold text-lg text-mia-text">
              Deskripsi Proyek
            </h3>
          </div>
          <div className="bg-mia-surface/60 border border-white/10 rounded-xl p-4 md:p-6 min-h-[120px]">
            <p className="text-sm md:text-base text-foreground/90 leading-relaxed whitespace-pre-wrap break-words">
              {submission.description || (
                <span className="text-mia-muted-2 italic">
                  Tidak ada deskripsi detail untuk karya ini.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Row 3: Flow Aplikasi */}
        <div className="mia-card p-6 md:p-8 space-y-4 min-w-0">
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
            <Sparkles className="h-5 w-5 text-mia-yellow" />
            <h3 className="font-bold text-lg text-mia-text">Flow Aplikasi</h3>
          </div>
          <div className="bg-mia-surface/60 border border-white/10 rounded-xl p-4 md:p-6 min-h-[100px]">
            <p className="text-sm md:text-base text-foreground/90 leading-relaxed whitespace-pre-wrap break-words">
              {submission.flow_application || (
                <span className="text-mia-muted-2 italic">
                  Flow aplikasi tidak tersedia.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Row 4: Link Project */}
        <div className="mia-card p-6 md:p-8 space-y-4 mb-12 md:mb-16 min-w-0">
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
            <Link2 className="h-5 w-5 text-purple-400" />
            <h3 className="font-bold text-lg text-mia-text">
              Link Project & Sumber Daya
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {getNonYouTubeLinks().length > 0 ? (
              getNonYouTubeLinks().map((link) => (
                <div
                  key={link.link_id}
                  className="bg-mia-surface/60 border border-white/10 rounded-xl p-4 flex flex-col justify-between space-y-3 min-w-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-lg bg-[#1E2939] text-muted-foreground">
                      {getLinkIcon(link.link_type)}
                    </span>
                    <span className="font-semibold text-sm text-mia-text capitalize break-words">
                      {link.link_type}
                    </span>
                  </div>

                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between gap-2 px-3 py-2 bg-[#1E2939] border border-white/10 hover:border-mia-red/40 rounded-lg text-xs text-mia-text transition-colors w-full group"
                  >
                    <span className="truncate">{link.url}</span>
                    <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-mia-muted group-hover:text-mia-red transition-colors" />
                  </a>

                  {link.description && (
                    <p className="text-xs text-mia-muted-2 break-words">
                      {link.description}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-mia-muted-2">
                <LinkIcon className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <span className="text-xs">
                  Tidak ada tautan proyek tambahan
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
