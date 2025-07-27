"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Iframe from "react-iframe";
import {
  ArrowLeft,
  User,
  Trophy,
  FileText,
  Link2,
  Clock,
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
  Target,
  Play,
} from "lucide-react";
import Header from "@/components/layout/Header";
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
        return "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400";
      case "pending":
      case "menunggu":
        return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400";
      case "rejected":
      case "ditolak":
        return "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-400";
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

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-20">
              <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full w-fit mx-auto mb-6">
                <XCircle className="h-16 w-16 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Terjadi Kesalahan
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
              <Button
                onClick={() => router.push("/think-it")}
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Think-It
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!submission) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-20">
              <div className="p-4 bg-gray-100 dark:bg-gray-900/20 rounded-full w-fit mx-auto mb-6">
                <Target className="h-16 w-16 text-gray-600 dark:text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Submission Tidak Ditemukan
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Submission yang Anda cari tidak ditemukan atau mungkin telah
                dihapus.
              </p>
              <Button
                onClick={() => router.push("/think-it")}
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Think-It
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Fungsi untuk mengkonversi URL YouTube menjadi embed URL
  const convertToEmbedUrl = (url) => {
    if (!url) return null;

    // Regex untuk menangkap video ID dari berbagai format URL YouTube
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

  // Fungsi untuk mendapatkan URL YouTube asli (untuk link)
  const getOriginalYouTubeUrl = () => {
    if (!submission?.links) return null;

    const youtubeLink = submission.links.find(
      (link) => link.link_type?.toLowerCase() === "youtube"
    );

    return youtubeLink?.url || null;
  };

  // Fungsi untuk mendapatkan links selain YouTube
  const getNonYouTubeLinks = () => {
    if (!submission?.links) return [];

    return submission.links.filter(
      (link) => link.link_type?.toLowerCase() !== "youtube"
    );
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20">
        <div className="container mx-auto px-4 ml-4">
          {/* Back Button */}
          <div className="mb-2">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="transition"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </div>

          {/* Header Section - Split into 2 cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-8">
            {/* Left Card - Main Info */}
            <Card className="lg:col-span-1 shadow-xl border-0 bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-900/50 border-orange-200">
              <CardContent className="p-6 md:p-8 h-full flex flex-col justify-center">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-red-600 rounded-xl">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {submission.project_name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      oleh Tim {submission.team_name} • {submission.user?.name}
                    </p>
                  </div>
                </div>

                {/* Status and Info Pills */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
                      submission.status
                    )}`}
                  >
                    {submission.status === "APPROVED"
                      ? "✓ Disetujui"
                      : submission.status === "PENDING"
                      ? "⏳ Pending"
                      : submission.status === "REJECTED"
                      ? "✗ Ditolak"
                      : submission.status}
                  </div>

                  {submission.score && (
                    <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-full border border-yellow-200 dark:border-yellow-800">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                        Skor: {submission.score}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-200/50 dark:bg-purple-800/50 rounded-full">
                    <Trophy className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                    <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                      {submission.category?.name ||
                        submission.category?.category_name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-200/50 dark:bg-gray-800/50 rounded-full">
                    <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {new Date(submission.created_at).toLocaleDateString(
                        "id-ID"
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Card - Video */}
            <Card className="shadow-xl border-0 bg-white dark:bg-gray-900">
              <CardContent className="p-6">
                {/* Video Container */}
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  {getYouTubeVideoUrl() ? (
                    <iframe
                      src={getYouTubeVideoUrl()}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      <Play className="h-12 w-12 mb-2 opacity-50" />
                      <span className="text-sm text-center">
                        Video tidak tersedia
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* User Info & Category */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Identitas Peserta */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      Identitas Peserta
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Nama
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {submission.user?.name || "-"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Email
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {submission.user?.email || "-"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Nama Tim
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {submission.team_name || "-"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Info Lomba */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Trophy className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      Info Lomba
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Kategori
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {submission.category?.category_name ||
                          submission.category?.name ||
                          "-"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Judul Proyek
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {submission.project_name || "-"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Status Verifikasi
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        {submission.is_verified ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              Terverifikasi
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-500">
                            <XCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              Belum Terverifikasi
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Deskripsi Project */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
                  Deskripsi Proyek
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 min-h-[120px]">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {submission.description || (
                      <span className="text-gray-400 italic">
                        Tidak ada deskripsi
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Flow Application */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
                  Flow Aplikasi
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 min-h-[120px]">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {submission.flow_application || (
                      <span className="text-gray-400 italic">
                        Flow tidak tersedia
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Links */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Link2 className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    Link Project
                  </h3>
                </div>
                <div className="space-y-3">
                  {getNonYouTubeLinks().length > 0 ? (
                    getNonYouTubeLinks().map((link) => (
                      <div
                        key={link.link_id}
                        className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {getLinkIcon(link.link_type)}
                          <span className="font-medium text-blue-900 dark:text-blue-300">
                            {link.link_type}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="w-full text-left justify-start"
                        >
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span className="truncate">{link.url}</span>
                          </a>
                        </Button>
                        {link.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                            {link.description}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <LinkIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <span className="text-gray-400 italic">
                        Tidak ada link tambahan
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
