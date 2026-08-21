"use client";

import React, { useState, useEffect } from "react";
import { useCategoryById } from "@/hooks/user-use-category";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Calendar,
  User,
  ArrowLeft,
  Download,
  Trophy,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  Clock,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Loading Skeleton Component matching design.md specification
function CategoryDetailSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#151C28]">
      <Header />
      <main className="flex-grow container mx-auto pt-28 pb-16 px-4 md:px-6 lg:px-8">
        <Skeleton className="h-10 w-36 rounded-full mb-8 bg-gray-200 dark:bg-gray-800" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151C28]/60 p-6">
              <Skeleton className="h-10 w-3/4 mb-4 bg-gray-200 dark:bg-gray-800" />
              <Skeleton className="h-5 w-1/3 mb-6 bg-gray-200 dark:bg-gray-800" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-4 w-4/5 bg-gray-200 dark:bg-gray-800" />
              </div>
            </Card>
            <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151C28]/60 p-6">
              <Skeleton className="h-6 w-48 mb-4 bg-gray-200 dark:bg-gray-800" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-20 w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-20 w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-20 w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
              </div>
            </Card>
          </div>
          <div className="space-y-8">
            <Skeleton className="h-64 w-full rounded-2xl bg-gray-200 dark:bg-gray-800" />
            <Skeleton className="h-48 w-full rounded-2xl bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Countdown Timer Component per design.md
function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!targetDate) return;
    const timer = setInterval(() => {
      const difference = new Date(targetDate) - new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) {
    return (
      <div className="text-center p-4 bg-red-500/10 rounded-2xl border border-red-500/30">
        <XCircle className="h-8 w-8 text-[#E01C20] mx-auto mb-2" />
        <p className="text-[#E01C20] font-bold text-sm">
          Pendaftaran Telah Ditutup
        </p>
      </div>
    );
  }

  return (
    <div className="text-center p-5 bg-gradient-to-b from-[#1E2939]/90 to-[#151C28]/90 dark:from-[#1E2939]/90 dark:to-[#151C28]/90 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-md">
      <div className="inline-flex items-center justify-center gap-1.5 mb-4 text-[#E01C20] font-semibold text-xs uppercase tracking-wider">
        <Clock className="h-4 w-4" />
        <span>Sisa Waktu Pendaftaran</span>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-white dark:bg-[#151C28] rounded-xl p-2.5 border border-gray-200 dark:border-gray-800 shadow-inner">
          <div className="text-xl md:text-2xl font-bold text-[#E01C20]">
            {timeLeft.days}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-[#99A1AF] font-medium uppercase mt-0.5">
            Hari
          </div>
        </div>
        <div className="bg-white dark:bg-[#151C28] rounded-xl p-2.5 border border-gray-200 dark:border-gray-800 shadow-inner">
          <div className="text-xl md:text-2xl font-bold text-[#E01C20]">
            {timeLeft.hours}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-[#99A1AF] font-medium uppercase mt-0.5">
            Jam
          </div>
        </div>
        <div className="bg-white dark:bg-[#151C28] rounded-xl p-2.5 border border-gray-200 dark:border-gray-800 shadow-inner">
          <div className="text-xl md:text-2xl font-bold text-[#E01C20]">
            {timeLeft.minutes}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-[#99A1AF] font-medium uppercase mt-0.5">
            Menit
          </div>
        </div>
        <div className="bg-white dark:bg-[#151C28] rounded-xl p-2.5 border border-gray-200 dark:border-gray-800 shadow-inner">
          <div className="text-xl md:text-2xl font-bold text-[#E01C20]">
            {timeLeft.seconds}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-[#99A1AF] font-medium uppercase mt-0.5">
            Detik
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CategoryDetailPage(props) {
  const router = useRouter();
  const params =
    typeof props.params?.then === "function"
      ? React.use(props.params)
      : props.params;
  const categoryId = params?.categoryId;

  const {
    data: category,
    isLoading,
    isError,
    error,
  } = useCategoryById(categoryId);

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    try {
      return format(new Date(dateString), "dd MMMM yyyy 'pukul' HH:mm", {
        locale: id,
      });
    } catch {
      return "Tanggal tidak valid";
    }
  };

  const isDeadlinePassed = (deadlineString) => {
    if (!deadlineString) return false;
    return new Date(deadlineString) < new Date();
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "VERIFIED":
        return {
          icon: CheckCircle2,
          text: "Terverifikasi",
          bg: "bg-[#00B445]/20 text-[#00B445] border-[#00B445]/40",
        };
      case "NOT_VERIFIED":
        return {
          icon: AlertCircle,
          text: "Belum Terverifikasi",
          bg: "bg-yellow-500/20 text-yellow-500 border-yellow-500/40",
        };
      default:
        return {
          icon: XCircle,
          text: "Status Tidak Diketahui",
          bg: "bg-gray-800 text-gray-300 border-gray-700",
        };
    }
  };

  if (isLoading) return <CategoryDetailSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-[#151C28]">
        <Header />
        <main className="flex-grow container mx-auto pt-28 pb-16 px-4">
          <Alert variant="destructive" className="max-w-lg mx-auto rounded-2xl">
            <AlertTitle className="font-semibold">Gagal Memuat Detail Kategori</AlertTitle>
            <AlertDescription>
              {error?.message ||
                "Terjadi kesalahan saat memuat detail kategori. Silakan coba lagi."}
            </AlertDescription>
          </Alert>
          <div className="text-center mt-6">
            <Button
              variant="outline"
              className="rounded-full cursor-pointer"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-[#151C28]">
        <Header />
        <main className="flex-grow container mx-auto pt-28 pb-16 px-4">
          <Alert variant="destructive" className="max-w-lg mx-auto rounded-2xl">
            <AlertTitle className="font-semibold">Kategori Tidak Ditemukan</AlertTitle>
            <AlertDescription>
              Kategori yang Anda cari tidak ditemukan atau mungkin telah dihapus.
            </AlertDescription>
          </Alert>
          <div className="text-center mt-6">
            <Link href="/category">
              <Button variant="outline" className="rounded-full cursor-pointer">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Daftar Kategori
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const statusConfig = getStatusConfig(category.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#151C28] text-gray-900 dark:text-[#FFF9F5] relative overflow-hidden font-sans">
      {/* Background Radial & Grid Pattern (per design.md) */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:hidden"></div>

      <div className="hidden dark:block absolute inset-0 -z-10 h-full w-full bg-[#151C28]">
        {/* Spotlights & Red Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-[#810220]/40 via-[#E01C20]/15 to-transparent blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[350px] bg-gradient-to-t from-[#810220]/30 to-transparent blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </div>

      <Header />

      <main className="flex-grow container mx-auto pt-28 pb-16 px-4 md:px-6 lg:px-8 relative z-10">
        {/* Top Back Navigation Bar */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="rounded-full border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#1E2939]/80 backdrop-blur-md hover:border-[#E01C20] transition-all cursor-pointer shadow-sm group text-xs px-5 h-10"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Katalog Kategori</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Left Column (Detail Info & Schedule) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Primary Detail Card */}
            <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151C28]/80 rounded-3xl shadow-sm overflow-hidden p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
                <div className="flex-1 space-y-2">
                  <div className="inline-flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#E01C20]/10 text-[#E01C20] border border-[#E01C20]/30">
                      <Trophy className="h-3 w-3 mr-1 text-[#FED700]" />
                      {category.category_name}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-[#FFF9F5] leading-tight">
                    {category.title || category.category_name}
                  </h1>
                </div>

                {/* Status Badge */}
                <span
                  className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border shadow-sm ${statusConfig.bg}`}
                >
                  <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
                  {statusConfig.text}
                </span>
              </div>

              {/* Category Description */}
              <div className="space-y-6 pt-2">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-[#99A1AF] mb-3">
                    Deskripsi Lomba
                  </h3>
                  <p className="text-sm md:text-base text-gray-700 dark:text-[#AAB1BD] leading-relaxed">
                    {category.description ||
                      "Tidak ada deskripsi rinci tersedia untuk kategori lomba ini."}
                  </p>
                </div>

                {/* Info Chips (Organizer & Team Type) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {/* Penyelenggara */}
                  <div className="flex items-center gap-3.5 p-3.5 bg-gray-50 dark:bg-[#1E2939]/70 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 bg-[#E01C20]/10 dark:bg-[#E01C20]/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-[#E01C20]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-[#99A1AF]">
                        Diselenggarakan oleh
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-[#FFF9F5]">
                        {category.organizer || "Penyelenggara MIA 2026"}
                      </p>
                    </div>
                  </div>

                  {/* Tipe Tim */}
                  <div className="flex items-center gap-3.5 p-3.5 bg-gray-50 dark:bg-[#1E2939]/70 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 bg-blue-500/10 dark:bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-[#99A1AF]">
                        Tipe Tim
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-[#FFF9F5]">
                        {category.team_type === "GROUP"
                          ? "Kelompok / Tim"
                          : "Individu"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Schedule Card */}
            <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151C28]/80 rounded-3xl shadow-sm p-6 md:p-8">
              <CardTitle className="flex items-center gap-2 text-lg font-bold mb-6 text-gray-900 dark:text-[#FFF9F5]">
                <Calendar className="h-5 w-5 text-[#E01C20]" />
                <span>Jadwal Pelaksanaan Lomba</span>
              </CardTitle>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Mulai */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#1E2939]/60 border border-gray-100 dark:border-gray-800 space-y-1">
                  <div className="text-xs text-gray-400 dark:text-[#99A1AF]">
                    Pendaftaran Mulai
                  </div>
                  <div className="text-sm font-bold text-gray-900 dark:text-[#FFF9F5]">
                    {formatDate(category.startDate)}
                  </div>
                </div>

                {/* Deadline (Highlighted) */}
                <div className="p-4 rounded-2xl bg-[#E01C20]/10 dark:bg-[#E01C20]/15 border border-[#E01C20]/30 space-y-1">
                  <div className="text-xs text-[#E01C20] font-semibold">
                    Deadline Pendaftaran
                  </div>
                  <div className="text-sm font-bold text-[#E01C20]">
                    {formatDate(category.deadline)}
                  </div>
                </div>

                {/* Selesai */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#1E2939]/60 border border-gray-100 dark:border-gray-800 space-y-1">
                  <div className="text-xs text-gray-400 dark:text-[#99A1AF]">
                    Lomba Berakhir
                  </div>
                  <div className="text-sm font-bold text-gray-900 dark:text-[#FFF9F5]">
                    {formatDate(category.endDate)}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column (Image, Countdown, Actions) */}
          <div className="space-y-8">
            {/* Image Preview Card */}
            <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151C28]/80 rounded-3xl shadow-sm">
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-red-950/20 via-black to-red-900/10">
                <img
                  src={category.image || "/placeholder-image.jpg"}
                  alt={category.category_name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
              </div>
            </Card>

            {/* Countdown Timer */}
            <CountdownTimer targetDate={category.deadline} />

            {/* Registration Actions Card */}
            <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151C28]/80 rounded-3xl shadow-sm p-6 space-y-4">
              {category.status === "VERIFIED" ? (
                <>
                  {/* Button Daftar */}
                  <Link
                    href={
                      isDeadlinePassed(category.deadline)
                        ? "#"
                        : `/competition-registration?category=${category.category_id}`
                    }
                    className={`block ${
                      isDeadlinePassed(category.deadline)
                        ? "pointer-events-none"
                        : ""
                    }`}
                  >
                    <Button
                      disabled={isDeadlinePassed(category.deadline)}
                      className={`w-full h-12 rounded-full font-bold text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
                        isDeadlinePassed(category.deadline)
                          ? "bg-gray-400 dark:bg-gray-700 text-gray-200 opacity-60 cursor-not-allowed"
                          : "bg-[#E01C20] hover:bg-[#9D1416] text-[#FFF9F5] shadow-[0_4px_20px_rgba(224,28,32,0.35)] hover:scale-[1.02] cursor-pointer"
                      }`}
                    >
                      <Trophy className="h-4 w-4 text-[#FED700]" />
                      <span>
                        {isDeadlinePassed(category.deadline)
                          ? "Pendaftaran Telah Ditutup"
                          : "Daftar Sekarang"}
                      </span>
                    </Button>
                  </Link>

                  {/* Button Download Panduan */}
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-full font-semibold text-sm border-gray-300 dark:border-gray-700 hover:border-[#E01C20] text-gray-800 dark:text-[#FFF9F5] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                    asChild
                  >
                    <a
                      href={
                        category.file_url ||
                        "https://drive.google.com/drive/folders/1x34lDmoqSFdOfsxUpxpe2KiAaGT2zk5m"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4 text-[#E01C20]" />
                      <span>Download Guidebook</span>
                    </a>
                  </Button>
                </>
              ) : (
                <div className="text-center p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/30">
                  <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-yellow-500 font-bold text-sm">
                    Kategori Belum Terverifikasi
                  </p>
                  <p className="text-xs text-yellow-600/80 dark:text-yellow-400/80 mt-1">
                    Pendaftaran akan dibuka setelah kategori ini diverifikasi oleh admin.
                  </p>
                </div>
              )}
            </Card>

            {/* Metadata Extra Card */}
            <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151C28]/80 rounded-3xl shadow-sm p-6">
              <h3 className="font-semibold mb-4 text-sm text-gray-900 dark:text-[#FFF9F5]">
                Informasi Tambahan
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800/60">
                  <span className="text-gray-400 dark:text-[#99A1AF]">
                    Nama Kompetisi:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-[#FFF9F5]">
                    {category.name || category.category_name}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800/60">
                  <span className="text-gray-400 dark:text-[#99A1AF]">
                    Status Akses:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-[#FFF9F5]">
                    Publik
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
