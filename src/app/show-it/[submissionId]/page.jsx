"use client";

import React from "react";
import {
  ArrowLeft,
  Trophy,
  FileText,
  CheckCircle2,
  XCircle,
  Sparkles,
  ImageIcon,
  BookmarkCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSafeImageUrl } from "@/lib/image-loader";
import { useSubmissionDetail } from "@/hooks/user-use-submissions";
import { useParams, useRouter } from "next/navigation";

export default function SubmissionDetailPage(props) {
  const params = useParams();
  const router = useRouter();
  const submissionId = params?.submissionId;

  const {
    data: submissionRaw,
    isLoading: loading,
    error: error,
  } = useSubmissionDetail(submissionId);

  const submission = submissionRaw?.data;
  const errorMsg = error
    ? error.response?.data?.message || "Gagal mengambil data submission"
    : null;

  const thumbnailUrl = submission?.thumbnail_url || submission?.thumbnail;

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center pt-24 sm:pt-28 pb-16 px-4">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-mia-red border-t-transparent mx-auto"></div>
          <p className="text-sm md:text-base text-mia-muted">
            Memuat detail karya...
          </p>
        </div>
      </main>
    );
  }

  if (errorMsg || !submission) {
    return (
      <main className="flex-1 flex items-center justify-center pt-24 sm:pt-28 pb-16 px-4">
        <div className="w-full max-w-2xl">
          <div className="mia-card p-8 md:p-12 text-center space-y-5">
            <div className="w-14 h-14 bg-mia-red/15 border border-mia-red/30 text-mia-red rounded-2xl flex items-center justify-center mx-auto">
              <XCircle className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-mia-text">
                {errorMsg ? "Terjadi Kesalahan" : "Karya Tidak Ditemukan"}
              </h2>
              <p className="text-sm text-mia-muted">
                {errorMsg ||
                  "Karya yang Anda cari tidak ditemukan atau mungkin belum disetujui."}
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="mia-btn-secondary px-6 py-2.5 text-sm inline-flex items-center gap-2 cursor-pointer transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Show It</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 sm:pt-28 pb-16 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-6 md:space-y-8">
        {/* Back Button */}
        <div>
          <button
            onClick={() => router.back()}
            className="mia-btn-secondary px-4 py-2 text-xs md:text-sm inline-flex items-center gap-2 cursor-pointer transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Galeri</span>
          </button>
        </div>

        {/* Header Section - Split into 2 Cards with Larger Video (5:7 ratio on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Card - Main Project Info */}
          <div className="lg:col-span-5 mia-card p-6 md:p-8 flex flex-col justify-center">
            <div className="min-w-0 space-y-4">
              {/* Info Judul & Peserta */}
              <div className="space-y-1.5">
                <span className="text-[11px] uppercase tracking-wider text-mia-muted font-semibold block">
                  Karya Peserta MIA 2026
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-mia-text leading-tight break-words">
                  {submission.project_name}
                </h1>
                <p className="text-sm text-mia-muted pt-0.5">
                  oleh Tim{" "}
                  <strong className="text-mia-text">
                    {submission.registration?.team_name ||
                      submission.team_name ||
                      "-"}
                  </strong>{" "}
                  •{" "}
                  {submission.registration?.user?.name ||
                    submission.user?.name ||
                    "-"}
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

                {/* Kategori */}
                <div className="px-3.5 py-1.5 rounded-full bg-purple-900/60 border border-purple-500/50 text-purple-200 inline-flex items-center gap-1.5">
                  <Trophy className="h-3.5 w-3.5 text-purple-300 shrink-0" />
                  <span>
                    {submission.registration?.category?.category_name ||
                      submission.registration?.category?.name ||
                      submission.category?.name ||
                      submission.category?.category_name ||
                      "-"}
                  </span>
                </div>

                {/* Sub-Tema */}
                {submission.sub_theme &&
                  submission.sub_theme.split(",").map((st, idx) => (
                    <div
                      key={idx}
                      className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 inline-flex items-center gap-1.5"
                    >
                      <BookmarkCheck className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>{st.trim()}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Card - Thumbnail Karya (16:9) */}
          <div className="lg:col-span-7 mia-card p-3 sm:p-4 md:p-5 flex flex-col justify-center overflow-hidden shadow-2xl">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#141824] border border-white/10 shadow-inner group flex items-center justify-center">
              {thumbnailUrl ? (
                <img
                  src={getSafeImageUrl(thumbnailUrl)}
                  alt={`Thumbnail Karya ${submission.project_name}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-mia-muted p-6 bg-gradient-to-br from-[#1E2939]/40 to-[#0F131E]/60">
                  <ImageIcon className="w-12 h-12 text-[#FED700]/50 mb-2" />
                  <span className="text-xs text-mia-muted font-medium text-center">
                    Thumbnail karya tidak tersedia
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="space-y-6 md:space-y-8">
          {/* Row 1: Deskripsi Proyek (Full Width) */}
          <div className="mia-card p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
              <FileText className="h-5 w-5 text-mia-red" />
              <h3 className="font-bold text-lg text-mia-text">
                Deskripsi Proyek
              </h3>
            </div>
            <div className="bg-mia-surface/60 border border-white/10 rounded-xl p-4 md:p-6 min-h-[120px]">
              <p className="text-sm md:text-base text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {submission.description || (
                  <span className="text-mia-muted-2 italic">
                    Tidak ada deskripsi detail untuk karya ini.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Row 2: Flow Aplikasi (Full Width, jika ada) */}
          <div className="mia-card p-6 md:p-8 space-y-4 mb-12 md:mb-16">
            <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
              <Sparkles className="h-5 w-5 text-mia-yellow" />
              <h3 className="font-bold text-lg text-mia-text">Flow Aplikasi</h3>
            </div>
            <div className="bg-mia-surface/60 border border-white/10 rounded-xl p-4 md:p-6 min-h-[100px]">
              <p className="text-sm md:text-base text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {submission.flow_application || (
                  <span className="text-mia-muted-2 italic">
                    Flow aplikasi tidak tersedia.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
