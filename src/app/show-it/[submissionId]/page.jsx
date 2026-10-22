"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Trophy,
  FileText,
  Link2,
  CheckCircle2,
  XCircle,
  Github,
  Globe,
  LinkIcon,
  Youtube,
  ExternalLink,
  Sparkles,
  Calendar,
  Play,
  Users,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import YouTubePreview from "@/components/common/YouTubePreview";

export default function SubmissionDetailPage(props) {
  const params =
    typeof props.params?.then === "function"
      ? React.use(props.params)
      : props.params;
  const submissionId = params?.submissionId;

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [returnTo, setReturnTo] = useState("/show-it");

  useEffect(() => {
    const sessionItem = sessionStorage.getItem("previousShowIt");
    if (sessionItem?.startsWith("/show-it")) setReturnTo(sessionItem);
  }, []);

  useEffect(() => {
    if (!submissionId) return;

    const fetchSubmissionById = async () => {
      setLoading(true);
      setError(null);
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${BASE_URL}/submissions/${submissionId}`);

        if (!response.ok) {
          throw new Error("Gagal mengambil data submission");
        }

        const result = await response.json();
        setSubmission(result.data || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissionById();
  }, [submissionId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "terverifikasi":
        return "text-mia-success bg-mia-success/15 border-mia-success/30";
      case "pending":
      case "menunggu":
        return "text-mia-yellow bg-mia-yellow/15 border-mia-yellow/30";
      case "rejected":
      case "ditolak":
        return "text-mia-red bg-mia-red/15 border-mia-red/30";
      default:
        return "text-mia-muted bg-[#1E2939] border-white/10";
    }
  };

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

  // Fungsi untuk mendapatkan links selain YouTube
  const getNonYouTubeLinks = () => {
    if (!submission?.links) return [];
    const seen = new Set();
    return submission.links.filter((link) => {
      if (link.link_type?.toLowerCase() === "youtube") return false;
      const key = link.link_id || `${link.link_type}-${link.url}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const onNavigate = (e) => {
    sessionStorage.removeItem("previousShowIt");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-mia-bg mia-connected-bg text-mia-text flex flex-col justify-between">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-24 sm:pt-28 pb-16 px-4">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-mia-red border-t-transparent mx-auto"></div>
            <p className="text-sm md:text-base text-mia-muted">
              Memuat detail karya...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen bg-mia-bg mia-connected-bg text-mia-text flex flex-col justify-between">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-24 sm:pt-28 pb-16 px-4">
          <div className="w-full max-w-2xl">
            <div className="mia-card p-8 md:p-12 text-center space-y-5">
              <div className="w-14 h-14 bg-mia-red/15 border border-mia-red/30 text-mia-red rounded-2xl flex items-center justify-center mx-auto">
                <XCircle className="h-7 w-7" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-mia-text">
                  {error ? "Terjadi Kesalahan" : "Karya Tidak Ditemukan"}
                </h2>
                <p className="text-sm text-mia-muted">
                  {error ||
                    "Karya yang Anda cari tidak ditemukan atau mungkin belum disetujui."}
                </p>
              </div>
              <Link
                href={returnTo}
                onNavigate={onNavigate}
                className="mia-btn-secondary px-6 py-2.5 text-sm inline-flex items-center gap-2 cursor-pointer transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Kembali ke Show It</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mia-bg mia-connected-bg text-mia-text flex flex-col justify-between selection:bg-mia-red selection:text-white">
      <div>
        <Header />

        <main className="pt-24 sm:pt-28 pb-16 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-6 md:space-y-8">
            {/* Back Button */}
            <div>
              <Link
                href={returnTo}
                onNavigate={onNavigate}
                className="mia-btn-secondary px-4 py-2 text-xs md:text-sm inline-flex items-center gap-2 cursor-pointer transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Kembali ke Galeri</span>
              </Link>
            </div>

            {/* Header Section - Split into 2 Cards with Larger Video (5:7 ratio on desktop) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Card - Main Project Info */}
              <div className="lg:col-span-5 mia-card p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-start gap-4">
                  {/* Icon Kotak Bintang */}
                  <div className="p-3 bg-mia-red/20 border border-mia-red/30 rounded-xl text-mia-red flex-shrink-0">
                    <Sparkles className="h-6 w-6 md:h-7 md:w-7" />
                  </div>

                  {/* Konten Sejajar Rata Kiri di Sebelah Icon */}
                  <div className="flex-1 min-w-0 space-y-4">
                    {/* Info Judul & Peserta */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] uppercase tracking-wider text-mia-muted font-semibold block">
                        Karya Peserta MIA 2026
                      </span>
                      <h1 className="text-2xl sm:text-3xl font-bold text-mia-text leading-tight">
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
                        <Trophy className="h-3.5 w-3.5 text-purple-300" />
                        <span>
                          {submission.registration?.category?.category_name ||
                            submission.registration?.category?.name ||
                            submission.category?.name ||
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

              {/* Right Card - Larger Video Preview */}
              <div className="lg:col-span-7 mia-card p-3 sm:p-4 md:p-5 flex flex-col justify-center overflow-hidden shadow-2xl">
                <YouTubePreview
                  submission={submission}
                  title={`Video Karya ${submission.project_name}`}
                  showFallback={true}
                  fallbackText="Video presentasi tidak disematkan oleh peserta"
                  className="rounded-xl border border-white/10"
                />
              </div>
            </div>

            {/* Main Content Layout (Aligned with Top Row: 5 cols & 7 cols) */}
            <div className="space-y-6 md:space-y-8">
              {/* Row 1: Identitas Peserta (5 cols) & Info Lomba (7 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Identitas Peserta - Col span 5 (sama dengan card judul di atas) */}
                <div className="lg:col-span-5 mia-card p-6 space-y-4 flex flex-col justify-between">
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
                        <span className="text-sm font-medium text-mia-text">
                          {submission.registration?.user?.name ||
                            submission.user?.name ||
                            "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-mia-muted-2 uppercase tracking-wide block mb-0.5">
                          Nama Tim
                        </span>
                        <span className="text-sm text-mia-muted">
                          {submission.registration?.team_name ||
                            submission.team_name ||
                            "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status & Detail Pendaftaran - Col span 7 (sama dengan card video di atas) */}
                <div className="lg:col-span-7 mia-card p-6 space-y-4 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-center gap-3 pb-2 border-b border-white/10 mb-4">
                      <div className="p-2 bg-purple-500/15 border border-purple-500/30 rounded-lg text-purple-400">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold text-lg text-mia-text">
                        Status & Detail Pendaftaran
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <span className="text-xs font-semibold text-mia-muted-2 uppercase tracking-wide block mb-1">
                          Status Verifikasi Pendaftaran
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

              {/* Row 2: Deskripsi Proyek (Full Width) */}
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

              {/* Row 3: Flow Aplikasi (Full Width, jika ada) */}
              <div className="mia-card p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                  <Sparkles className="h-5 w-5 text-mia-yellow" />
                  <h3 className="font-bold text-lg text-mia-text">
                    Flow Aplikasi
                  </h3>
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

              {/* Row 4: Link Project (Full Width, dengan margin bawah lega terhadap footer) */}
              <div className="mia-card p-6 md:p-8 space-y-4 mb-12 md:mb-16">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                  <Link2 className="h-5 w-5 text-mia-red" />
                  <h3 className="font-bold text-lg text-mia-text">
                    Link Project & Sumber Daya
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {getNonYouTubeLinks().length > 0 ? (
                    getNonYouTubeLinks().map((link, index) => (
                      <div
                        key={
                          link.link_id
                            ? `${link.link_id}-${index}`
                            : `link-${index}`
                        }
                        className="bg-mia-surface border border-white/10 rounded-xl p-4 flex flex-col justify-between space-y-3 min-w-0"
                      >
                        <div className="flex items-center gap-2">
                          <span className="p-2 rounded-lg bg-[#1E2939] text-mia-red">
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
                          className="inline-flex items-center justify-between gap-2 px-3 py-2 bg-[#1E2939] hover:bg-mia-red/15 border border-white/10 hover:border-mia-red/40 rounded-lg text-xs text-mia-text hover:text-mia-red transition-colors w-full group"
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
        </main>
      </div>

      <Footer />
    </div>
  );
}
