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
  Layers,
} from "lucide-react";
import api from "@/lib/api";
import YouTubePreview from "@/components/common/YouTubePreview";

export default function JuriSubmissionDetailPage(props) {
  const params =
    typeof props.params?.then === "function"
      ? React.use(props.params)
      : props.params;
  const submissionId = params?.submissionId;

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const res = await api.get(`/submissions/${submissionId}`);
        const result = res.data;

        if (result?.status && result.data) {
          setSubmission(result.data);
        } else {
          throw new Error(result?.message || "Data submission tidak valid");
        }
      } catch (err) {
        console.error("Error fetching submission:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissionById();
  }, [submissionId]);

  const getLinkIcon = (linkType) => {
    switch (linkType?.toLowerCase()) {
      case "proposal":
      case "documentation":
      case "docs":
        return <FileText className="h-4 w-4" />;
      case "github":
      case "github_secondary":
        return <Github className="h-4 w-4" />;
      case "figma":
      case "figma_prototype":
        return <Layers className="h-4 w-4" />;
      case "youtube":
        return <Youtube className="h-4 w-4" />;
      case "deployment":
      case "demo":
      case "preview":
      case "live":
      case "other":
        return <Globe className="h-4 w-4" />;
      default:
        return <LinkIcon className="h-4 w-4" />;
    }
  };

  const getLinkTypeLabel = (linkType) => {
    switch (linkType?.toUpperCase()) {
      case "PROPOSAL":
        return "Draft Proposal (GDocs)";
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
        return "Tautan Eksternal";
      default:
        return linkType;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Disetujui (Approved)</span>
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
            <XCircle className="h-3.5 w-3.5" />
            <span>Ditolak (Rejected)</span>
          </span>
        );
      case "REVISION":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <span>Perlu Revisi</span>
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span>Menunggu Review</span>
          </span>
        );
    }
  };

  const getNonYouTubeLinks = () => {
    if (!submission?.links || !Array.isArray(submission.links)) return [];
    return submission.links.filter(
      (link) => link.link_type?.toUpperCase() !== "YOUTUBE",
    );
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-mia-red border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-mia-muted">Memuat detail karya peserta...</p>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 text-center px-4">
        <div className="p-4 rounded-full bg-red-500/10 text-mia-red border border-red-500/20">
          <XCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-mia-text">Gagal Memuat Karya</h2>
        <p className="text-sm text-mia-muted max-w-md">{error || "Data submission tidak ditemukan."}</p>
        <Link
          href="/juri/manage-submission"
          className="mia-btn-secondary px-6 py-2.5 text-xs font-semibold rounded-xl inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Daftar</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/juri/manage-submission"
          className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-mia-muted hover:text-mia-text transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Daftar Karya</span>
        </Link>

        {getStatusBadge(submission.status)}
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Card - Primary Project Info */}
        <div className="lg:col-span-5 mia-card p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-mia-red/10 border border-mia-red/20 text-mia-red">
              <Trophy className="h-3.5 w-3.5" />
              <span>{submission.registration?.category?.category_name || submission.registration?.category?.name || submission.category?.name || submission.category?.category_name || "Kompetisi"}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-mia-text tracking-tight leading-snug">
              {submission.project_name}
            </h1>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-mia-muted">Nama Tim:</span>
              <span className="font-bold text-mia-text">{submission.registration?.team_name || submission.team_name || "-"}</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-mia-muted">Kategori Lomba:</span>
              <span className="font-semibold text-mia-yellow">
                {submission.registration?.category?.category_name || submission.registration?.category?.name || submission.category?.name || submission.category?.category_name || "-"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-mia-muted">Tanggal Pengumpulan:</span>
              <span className="text-mia-text flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-mia-muted-2" />
                {submission.created_at
                  ? new Date(submission.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Card - Video Preview */}
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

      {/* Content Layout */}
      <div className="space-y-6 md:space-y-8">
        {/* Row 1: Identitas Peserta & Status Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Identitas Peserta */}
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
                    {submission.registration?.user?.name || submission.user?.name || "-"}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-mia-muted-2 uppercase tracking-wide block mb-0.5">
                    Email Kontak
                  </span>
                  <span className="text-sm text-mia-muted break-words">
                    {submission.registration?.user?.email || submission.user?.email || "-"}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-mia-muted-2 uppercase tracking-wide block mb-0.5">
                    Nama Tim
                  </span>
                  <span className="text-sm text-mia-muted break-words">
                    {submission.registration?.team_name || submission.team_name || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status & Detail */}
          <div className="lg:col-span-7 mia-card p-6 space-y-4 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-center gap-3 pb-2 border-b border-white/10 mb-4">
                <div className="p-2 bg-purple-500/15 border border-purple-500/30 rounded-lg text-purple-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg text-mia-text">
                  Status & Detail Pengumpulan
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <span className="text-xs font-semibold text-mia-muted-2 uppercase tracking-wide block mb-1">
                    Status Verifikasi
                  </span>
                  <div className="flex items-center gap-2">
                    {submission.is_verified ? (
                      <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Terverifikasi Panitia</span>
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
              getNonYouTubeLinks().map((link, index) => (
                <div
                  key={link.link_id ? `${link.link_id}-${index}` : `link-${index}`}
                  className="bg-mia-surface/60 border border-white/10 rounded-xl p-4 flex flex-col justify-between space-y-3 min-w-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-lg bg-[#1E2939] text-muted-foreground">
                      {getLinkIcon(link.link_type)}
                    </span>
                    <span className="font-semibold text-sm text-mia-text break-words">
                      {getLinkTypeLabel(link.link_type)}
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
              <div className="col-span-full py-8 text-center text-mia-muted text-sm italic">
                Tidak ada tautan proyek tambahan.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
