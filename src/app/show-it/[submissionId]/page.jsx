"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Mail,
  Users,
} from "lucide-react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import Footer from "@/components/layout/Footer";

export default function SubmissionDetailPage(props) {
  const router = useRouter();
  const params =
    typeof props.params?.then === "function"
      ? React.use(props.params)
      : props.params;
  const submissionId = params?.submissionId;

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        return "text-[#00B445] bg-[#00B445]/15 border-[#00B445]/30";
      case "pending":
      case "menunggu":
        return "text-[#FED700] bg-[#FED700]/15 border-[#FED700]/30";
      case "rejected":
      case "ditolak":
        return "text-[#E01C20] bg-[#E01C20]/15 border-[#E01C20]/30";
      default:
        return "text-[#AAB1BD] bg-[#1E2939] border-white/10";
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

  // Fungsi untuk mengkonversi URL YouTube menjadi embed URL
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

  // Fungsi untuk mencari link YouTube dari submission
  const getYouTubeVideoUrl = () => {
    if (!submission?.links) return null;
    const youtubeLink = submission.links.find(
      (link) => link.link_type?.toLowerCase() === "youtube"
    );
    if (youtubeLink?.url) {
      return convertToEmbedUrl(youtubeLink.url);
    }
    return null;
  };

  // Fungsi untuk mendapatkan links selain YouTube
  const getNonYouTubeLinks = () => {
    if (!submission?.links) return [];
    return submission.links.filter(
      (link) => link.link_type?.toLowerCase() !== "youtube"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0D14] mia-connected-bg text-[#FFF9F5] flex flex-col justify-between">
        <div>
          <DashboardHeader />
          <main className="pt-24 sm:pt-28 pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              <div className="text-center py-24 space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#E01C20] border-t-transparent mx-auto"></div>
                <p className="text-sm md:text-base text-[#AAB1BD]">Memuat detail karya...</p>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen bg-[#0A0D14] mia-connected-bg text-[#FFF9F5] flex flex-col justify-between">
        <div>
          <DashboardHeader />
          <main className="pt-24 sm:pt-28 pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl py-12">
              <div className="mia-card p-8 md:p-12 text-center space-y-5">
                <div className="w-14 h-14 bg-[#E01C20]/15 border border-[#E01C20]/30 text-[#E01C20] rounded-2xl flex items-center justify-center mx-auto">
                  <XCircle className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#FFF9F5]">
                    {error ? "Terjadi Kesalahan" : "Karya Tidak Ditemukan"}
                  </h2>
                  <p className="text-sm text-[#AAB1BD]">
                    {error || "Karya yang Anda cari tidak ditemukan atau mungkin belum disetujui."}
                  </p>
                </div>
                <button
                  onClick={() => router.push("/show-it")}
                  className="mia-btn-secondary px-6 py-2.5 text-sm inline-flex items-center gap-2 cursor-pointer transition-all"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Kembali ke Show It</span>
                </button>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0D14] mia-connected-bg text-[#FFF9F5] flex flex-col justify-between selection:bg-[#E01C20] selection:text-white">
      <div>
        <DashboardHeader />

        <main className="pt-24 sm:pt-28 pb-16 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-6 md:space-y-8">
            {/* Back Button */}
            <div>
              <button
                onClick={() => router.push("/show-it")}
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
                <div className="flex items-start gap-4">
                  {/* Icon Kotak Bintang */}
                  <div className="p-3 bg-[#E01C20]/20 border border-[#E01C20]/30 rounded-xl text-[#E01C20] flex-shrink-0">
                    <Sparkles className="h-6 w-6 md:h-7 md:w-7" />
                  </div>

                  {/* Konten Sejajar Rata Kiri di Sebelah Icon */}
                  <div className="flex-1 min-w-0 space-y-4">
                    {/* Info Judul & Peserta */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] uppercase tracking-wider text-[#AAB1BD] font-semibold block">
                        Karya Peserta MIA 2025
                      </span>
                      <h1 className="text-2xl sm:text-3xl font-bold text-[#FFF9F5] leading-tight">
                        {submission.project_name}
                      </h1>
                      <p className="text-sm text-[#AAB1BD] pt-0.5">
                        oleh Tim <strong className="text-[#FFF9F5]">{submission.team_name}</strong> • {submission.user?.name}
                      </p>
                    </div>

                    {/* 4 Item Info Kotak Flex / Grid dengan Ukuran Seragam & Warna Sesuai Badge */}
                    <div className="grid grid-cols-2 gap-2.5 pt-1 w-full">
                      {/* 1. Kotak Status */}
                      <div
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                          submission.status === "APPROVED"
                            ? "bg-[#00B445]/10 border-[#00B445]/30"
                            : submission.status === "PENDING"
                            ? "bg-[#FED700]/10 border-[#FED700]/30"
                            : "bg-[#E01C20]/10 border-[#E01C20]/30"
                        }`}
                      >
                        <div
                          className={`p-1.5 rounded-lg flex-shrink-0 ${
                            submission.status === "APPROVED"
                              ? "bg-[#00B445]/20 text-[#00B445]"
                              : submission.status === "PENDING"
                              ? "bg-[#FED700]/20 text-[#FED700]"
                              : "bg-[#E01C20]/20 text-[#E01C20]"
                          }`}
                        >
                          {submission.status === "APPROVED" ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : submission.status === "PENDING" ? (
                            <Sparkles className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-[#99A1AF] font-medium block uppercase tracking-wider">
                            Status
                          </span>
                          <span
                            className={`text-xs font-semibold truncate block ${
                              submission.status === "APPROVED"
                                ? "text-[#00B445]"
                                : submission.status === "PENDING"
                                ? "text-[#FED700]"
                                : "text-[#E01C20]"
                            }`}
                          >
                            {submission.status === "APPROVED"
                              ? "Disetujui"
                              : submission.status === "PENDING"
                              ? "Pending"
                              : "Ditolak"}
                          </span>
                        </div>
                      </div>

                      {/* 2. Kotak Skor */}
                      <div className="p-2.5 rounded-xl bg-[#FED700]/10 border border-[#FED700]/30 flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-[#FED700]/20 text-[#FED700] flex-shrink-0">
                          <Star className="h-4 w-4 fill-[#FED700]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-[#99A1AF] font-medium block uppercase tracking-wider">
                            Skor
                          </span>
                          <span className="text-xs font-semibold text-[#FED700] truncate block">
                            {submission.score && submission.score > 0
                              ? `${submission.score} Poin`
                              : "Belum Dinilai"}
                          </span>
                        </div>
                      </div>

                      {/* 3. Kotak Kategori */}
                      <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 flex-shrink-0">
                          <Trophy className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-[#99A1AF] font-medium block uppercase tracking-wider">
                            Kategori
                          </span>
                          <span className="text-xs font-semibold text-purple-300 truncate block">
                            {submission.category?.name ||
                              submission.category?.category_name ||
                              "-"}
                          </span>
                        </div>
                      </div>

                      {/* 4. Kotak Tanggal */}
                      <div className="p-2.5 rounded-xl bg-[#1E2939]/70 border border-white/10 flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-[#141824] text-[#AAB1BD] flex-shrink-0">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-[#99A1AF] font-medium block uppercase tracking-wider">
                            Tanggal
                          </span>
                          <span className="text-xs font-semibold text-[#AAB1BD] truncate block">
                            {new Date(submission.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Card - Larger Video Preview */}
              <div className="lg:col-span-7 mia-card p-3 sm:p-4 md:p-5 flex flex-col justify-center overflow-hidden shadow-2xl">
                <div className="aspect-video w-full bg-[#141824] rounded-xl overflow-hidden border border-white/10 relative shadow-inner">
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
                    <div className="flex flex-col items-center justify-center h-full text-[#AAB1BD] space-y-2 p-8">
                      <div className="w-14 h-14 rounded-full bg-[#1E2939] flex items-center justify-center text-[#99A1AF]">
                        <Play className="h-7 w-7 ml-0.5 opacity-60" />
                      </div>
                      <span className="text-xs sm:text-sm text-center text-[#99A1AF]">
                        Video presentasi tidak disematkan
                      </span>
                    </div>
                  )}
                </div>
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
                      <div className="p-2 bg-[#E01C20]/15 border border-[#E01C20]/30 rounded-lg text-[#E01C20]">
                        <User className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold text-lg text-[#FFF9F5]">
                        Identitas Peserta
                      </h3>
                    </div>
                    <div className="space-y-3.5">
                      <div>
                        <span className="text-xs font-semibold text-[#99A1AF] uppercase tracking-wide block mb-0.5">
                          Nama Peserta
                        </span>
                        <span className="text-sm font-medium text-[#FFF9F5]">
                          {submission.user?.name || "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#99A1AF] uppercase tracking-wide block mb-0.5">
                          Email Kontak
                        </span>
                        <span className="text-sm text-[#AAB1BD]">
                          {submission.user?.email || "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#99A1AF] uppercase tracking-wide block mb-0.5">
                          Nama Tim
                        </span>
                        <span className="text-sm text-[#AAB1BD]">
                          {submission.team_name || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Lomba - Col span 7 (sama dengan card video di atas) */}
                <div className="lg:col-span-7 mia-card p-6 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 pb-2 border-b border-white/10 mb-4">
                      <div className="p-2 bg-purple-500/15 border border-purple-500/30 rounded-lg text-purple-400">
                        <Trophy className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold text-lg text-[#FFF9F5]">
                        Info Lomba
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs font-semibold text-[#99A1AF] uppercase tracking-wide block mb-0.5">
                          Kategori Lomba
                        </span>
                        <span className="text-sm font-medium text-[#FFF9F5]">
                          {submission.category?.category_name ||
                            submission.category?.name ||
                            "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#99A1AF] uppercase tracking-wide block mb-0.5">
                          Judul Proyek
                        </span>
                        <span className="text-sm text-[#AAB1BD]">
                          {submission.project_name || "-"}
                        </span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-xs font-semibold text-[#99A1AF] uppercase tracking-wide block mb-1">
                          Status Verifikasi
                        </span>
                        <div className="flex items-center gap-2">
                          {submission.is_verified ? (
                            <div className="flex items-center gap-1.5 text-[#00B445] text-sm font-medium">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Terverifikasi</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-[#AAB1BD] text-sm font-medium">
                              <XCircle className="h-4 w-4 opacity-50" />
                              <span>Belum Terverifikasi Khusus</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Deskripsi Proyek (Full Width) */}
              <div className="mia-card p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                  <FileText className="h-5 w-5 text-[#E01C20]" />
                  <h3 className="font-bold text-lg text-[#FFF9F5]">
                    Deskripsi Proyek
                  </h3>
                </div>
                <div className="bg-[#141824]/60 border border-white/10 rounded-xl p-4 md:p-6 min-h-[120px]">
                  <p className="text-sm md:text-base text-[#D5D8DE] leading-relaxed whitespace-pre-wrap">
                    {submission.description || (
                      <span className="text-[#99A1AF] italic">
                        Tidak ada deskripsi detail untuk karya ini.
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Row 3: Flow Aplikasi (Full Width, jika ada) */}
              <div className="mia-card p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                  <Sparkles className="h-5 w-5 text-[#FED700]" />
                  <h3 className="font-bold text-lg text-[#FFF9F5]">
                    Flow Aplikasi
                  </h3>
                </div>
                <div className="bg-[#141824]/60 border border-white/10 rounded-xl p-4 md:p-6 min-h-[100px]">
                  <p className="text-sm md:text-base text-[#D5D8DE] leading-relaxed whitespace-pre-wrap">
                    {submission.flow_application || (
                      <span className="text-[#99A1AF] italic">
                        Flow aplikasi tidak tersedia.
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Row 4: Link Project (Full Width, dengan margin bawah lega terhadap footer) */}
              <div className="mia-card p-6 md:p-8 space-y-4 mb-12 md:mb-16">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                  <Link2 className="h-5 w-5 text-[#E01C20]" />
                  <h3 className="font-bold text-lg text-[#FFF9F5]">
                    Link Project & Sumber Daya
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {getNonYouTubeLinks().length > 0 ? (
                    getNonYouTubeLinks().map((link) => (
                      <div
                        key={link.link_id}
                        className="bg-[#141824] hover:bg-[#1E2939] border border-white/10 hover:border-[#E01C20]/50 rounded-xl p-4 transition-all flex flex-col justify-between space-y-3 group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="p-2 rounded-lg bg-[#1E2939] text-[#E01C20] group-hover:text-[#FED700] transition-colors">
                            {getLinkIcon(link.link_type)}
                          </span>
                          <span className="font-semibold text-sm text-[#FFF9F5] capitalize">
                            {link.link_type}
                          </span>
                        </div>

                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-between gap-2 px-3 py-2 bg-[#1E2939] hover:bg-[#E01C20]/20 border border-white/10 hover:border-[#E01C20]/40 rounded-lg text-xs text-[#FFF9F5] transition-colors w-full"
                        >
                          <span className="truncate">{link.url}</span>
                          <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-[#AAB1BD] group-hover:text-[#E01C20]" />
                        </a>

                        {link.description && (
                          <p className="text-xs text-[#99A1AF]">
                            {link.description}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-[#99A1AF]">
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

