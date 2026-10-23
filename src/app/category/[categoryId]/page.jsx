"use client";

import React, { useState, useEffect } from "react";
import { useCategoryById } from "@/hooks/user-use-category";
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
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getSafeImageUrl } from "@/lib/image-loader";

// Loading Skeleton Component matching MIA 2026 design system
function CategoryDetailSkeleton() {
  return (
    <main className="pt-24 sm:pt-28 pb-16 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-8">
        <div className="h-10 w-44 rounded-full bg-[#1E2939] animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="mia-card p-6 md:p-8 space-y-4 animate-pulse">
              <div className="h-6 w-24 bg-[#1E2939] rounded-full" />
              <div className="h-10 w-3/4 bg-[#1E2939] rounded" />
              <div className="space-y-2 pt-4">
                <div className="h-4 w-full bg-[#1E2939] rounded" />
                <div className="h-4 w-5/6 bg-[#1E2939] rounded" />
                <div className="h-4 w-2/3 bg-[#1E2939] rounded" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="h-14 bg-[#1E2939] rounded-xl" />
                <div className="h-14 bg-[#1E2939] rounded-xl" />
              </div>
            </div>

            <div className="mia-card p-6 md:p-8 space-y-4 animate-pulse">
              <div className="h-6 w-48 bg-[#1E2939] rounded" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-20 bg-[#1E2939] rounded-xl" />
                <div className="h-20 bg-[#1E2939] rounded-xl" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="mia-card aspect-video w-full bg-[#1E2939] animate-pulse" />
            <div className="mia-card h-40 w-full bg-[#1E2939] animate-pulse" />
            <div className="mia-card h-32 w-full bg-[#1E2939] animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
}

// Countdown Timer Component matching MIA 2026 standard
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
    <div className="mia-card p-5 text-center space-y-4 shadow-lg">
      <div className="inline-flex items-center justify-center gap-1.5 text-[#E01C20] font-semibold text-xs uppercase tracking-wider">
        <Clock className="h-4 w-4" />
        <span>Sisa Waktu Pendaftaran</span>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-[#1E2939]/80 rounded-xl p-2.5 border border-white/10">
          <div className="text-xl md:text-2xl font-bold text-[#E01C20]">
            {timeLeft.days}
          </div>
          <div className="text-[10px] text-[#AAB1BD] font-medium uppercase mt-0.5">
            Hari
          </div>
        </div>
        <div className="bg-[#1E2939]/80 rounded-xl p-2.5 border border-white/10">
          <div className="text-xl md:text-2xl font-bold text-[#E01C20]">
            {timeLeft.hours}
          </div>
          <div className="text-[10px] text-[#AAB1BD] font-medium uppercase mt-0.5">
            Jam
          </div>
        </div>
        <div className="bg-[#1E2939]/80 rounded-xl p-2.5 border border-white/10">
          <div className="text-xl md:text-2xl font-bold text-[#E01C20]">
            {timeLeft.minutes}
          </div>
          <div className="text-[10px] text-[#AAB1BD] font-medium uppercase mt-0.5">
            Menit
          </div>
        </div>
        <div className="bg-[#1E2939]/80 rounded-xl p-2.5 border border-white/10">
          <div className="text-xl md:text-2xl font-bold text-[#E01C20]">
            {timeLeft.seconds}
          </div>
          <div className="text-[10px] text-[#AAB1BD] font-medium uppercase mt-0.5">
            Detik
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CategoryDetailPage(props) {
  const params = useParams();
  const categoryId = params?.categoryId;

  const {
    data: category,
    isLoading,
    isError,
    error,
  } = useCategoryById(categoryId);
  const errorMsg = error
    ? error.response?.data?.message || "Gagal mengambil data kategori"
    : null;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd MMMM yyyy 'pukul' HH:mm", {
        locale: id,
      });
    } catch {
      return "-";
    }
  };

  const isDeadlinePassed = (deadlineString) => {
    if (!deadlineString) return false;
    return new Date(deadlineString) < new Date();
  };

  const registrationDeadline =
    category?.batch_2_end || category?.final_deadline || category?.deadline;
  const isRegistrationClosed = isDeadlinePassed(registrationDeadline);

  if (isLoading) return <CategoryDetailSkeleton />;

  if (isError) {
    return (
      <main className="flex-1 flex items-center justify-center pt-24 sm:pt-28 pb-16 px-4">
        <div className="w-full max-w-2xl">
          <div className="mia-card p-8 md:p-12 text-center space-y-5">
            <div className="w-14 h-14 bg-mia-red/15 border border-mia-red/30 text-mia-red rounded-2xl flex items-center justify-center mx-auto">
              <XCircle className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-mia-text">
                Gagal Memuat Kategori
              </h2>
              <p className="text-sm text-mia-muted">
                {errorMsg ||
                  "Terjadi kesalahan saat memuat detail kategori lomba."}
              </p>
            </div>
            <Link
              href="/#lomba"
              className="mia-btn-secondary px-6 py-2.5 text-sm inline-flex items-center gap-2 cursor-pointer transition-all"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!category) {
    return (
      <main className="pt-28 pb-16 px-4 max-w-lg mx-auto text-center">
        <div className="mia-card p-8 md:p-10 space-y-4">
          <div className="w-14 h-14 bg-[#E01C20]/15 border border-[#E01C20]/30 text-[#E01C20] rounded-2xl flex items-center justify-center mx-auto">
            <Trophy className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-[#FFF9F5]">
            Kategori Tidak Ditemukan
          </h2>
          <p className="text-xs text-[#AAB1BD]">
            Kategori yang Anda cari tidak ditemukan atau telah
            dinonaktifkan.
          </p>
          <div className="pt-2">
            <Link href="/category">
              <span className="mia-btn-primary px-6 py-2.5 text-xs font-semibold inline-flex items-center gap-2 cursor-pointer shadow-md">
                <ArrowLeft className="h-4 w-4" />
                <span>Kembali ke Katalog Kompetisi</span>
              </span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 sm:pt-28 pb-16 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-8">
        {/* Top Back Navigation Bar */}
        <div>
          <Link href="/category">
            <span className="mia-btn-secondary px-4 py-2 text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer group shadow-sm">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Kembali ke Katalog Kompetisi</span>
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Left Column (Detail Info & Schedule) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Primary Detail Card */}
            <div className="mia-card p-6 md:p-8 space-y-6 relative overflow-hidden shadow-xl">
              <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div>
                    <span className="mia-pill-badge bg-[#0A0D14]/90 text-[#FFF9F5] backdrop-blur-md font-mono">
                      <Trophy className="h-3 w-3 text-[#FED700]" />
                      {category.slug || category.category_name}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#FFF9F5] leading-tight">
                    {category.name || category.category_name}
                  </h1>
                </div>

                {/* Status Badge */}
                <span
                  className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border shadow-sm ${
                    category.status === "VERIFIED"
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                      : "bg-amber-500/15 border-amber-500/30 text-amber-400"
                  }`}
                >
                  {category.status === "VERIFIED" ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
                      <span>Terverifikasi</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
                      <span>Belum Terverifikasi</span>
                    </>
                  )}
                </span>
              </div>

              {/* Category Description */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                <h3 className="text-xs uppercase tracking-wider text-[#AAB1BD] font-semibold">
                  Deskripsi Perlombaan
                </h3>
                <p className="text-sm md:text-base text-[#D5D8DE] leading-relaxed whitespace-pre-line">
                  {category.description ||
                    "Tidak ada deskripsi rinci tersedia untuk kategori lomba ini."}
                </p>
              </div>

              {/* Info Chips (Organizer & Team Type) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Penyelenggara */}
                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#1E2939]/60 border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-[#E01C20]/15 border border-[#E01C20]/30 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-[#E01C20]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#99A1AF]">
                      Diselenggarakan oleh
                    </p>
                    <p className="text-sm font-semibold text-[#FFF9F5]">
                      {category.organizer || "Panitia MIA 2026"}
                    </p>
                  </div>
                </div>

                {/* Tipe Tim */}
                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#1E2939]/60 border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-[#FED700]/15 border border-[#FED700]/30 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-[#FED700]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#99A1AF]">Tipe Tim</p>
                    <p className="text-sm font-semibold text-[#FFF9F5]">
                      {category.team_type === "GROUP"
                        ? "Tim (1-3 Orang)"
                        : "Individu"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Card */}
            <div className="mia-card p-6 md:p-8 space-y-5 shadow-xl">
              <div className="flex items-center gap-2.5 text-lg font-bold text-[#FFF9F5]">
                <Calendar className="h-5 w-5 text-[#E01C20]" />
                <span>Jadwal Pelaksanaan Lomba</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Batch 1 Pendaftaran (if available) */}
                {(category.batch_1_start || category.batch_1_end) && (
                  <div className="p-4 rounded-xl bg-[#1E2939]/60 border border-white/5 space-y-1">
                    <div className="text-xs text-[#99A1AF] font-medium flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FF4500]" />
                      <span>Pendaftaran Batch 1</span>
                    </div>
                    <div className="text-sm sm:text-base font-bold text-[#FFF9F5]">
                      {formatDate(category.batch_1_start)} –{" "}
                      {formatDate(category.batch_1_end)}
                    </div>
                  </div>
                )}

                {/* Batch 2 Pendaftaran (if available) */}
                {(category.batch_2_start || category.batch_2_end) && (
                  <div className="p-4 rounded-xl bg-[#1E2939]/60 border border-white/5 space-y-1">
                    <div className="text-xs text-[#99A1AF] font-medium flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FED700]" />
                      <span>Pendaftaran Batch 2</span>
                    </div>
                    <div className="text-sm sm:text-base font-bold text-[#FFF9F5]">
                      {formatDate(category.batch_2_start)} –{" "}
                      {formatDate(category.batch_2_end)}
                    </div>
                  </div>
                )}

                {/* Pengumpulan Karya Penyisihan (if available) */}
                {category.preliminary_deadline && (
                  <div className="p-4 rounded-xl bg-[#1E2939]/60 border border-white/5 space-y-1">
                    <div className="text-xs text-[#99A1AF] font-medium flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                      <span>Pengumpulan Karya Penyisihan</span>
                    </div>
                    <div className="text-sm sm:text-base font-bold text-[#FFF9F5]">
                      {formatDate(category.preliminary_deadline)}
                    </div>
                  </div>
                )}

                {/* Pengumpulan Karya Final (if available) */}
                {category.final_deadline && (
                  <div className="p-4 rounded-xl bg-[#1E2939]/60 border border-white/5 space-y-1">
                    <div className="text-xs text-[#99A1AF] font-medium flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                      <span>Pengumpulan Karya Final</span>
                    </div>
                    <div className="text-sm sm:text-base font-bold text-[#FFF9F5]">
                      {formatDate(category.final_deadline)}
                    </div>
                  </div>
                )}

                {/* Batas Akhir Pendaftaran (Akhir Batch 2) */}
                <div className="p-4 rounded-xl bg-[#E01C20]/15 border border-[#E01C20]/30 space-y-1 shadow-[0_0_15px_rgba(224,28,32,0.15)]">
                  <div className="text-xs text-[#FF936B] font-semibold flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#E01C20]" />
                    <span>Batas Akhir Pendaftaran</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-[#FFF9F5]">
                    {formatDate(
                      category.batch_2_end || registrationDeadline,
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Image, Countdown, Actions) */}
          <div className="space-y-6">
            {/* Image Preview Card */}
            <div className="mia-card overflow-hidden relative aspect-video w-full shadow-xl">
              <Image
                src={
                  getSafeImageUrl(category.image) ||
                  "/placeholder-image.png"
                }
                alt={category.name || category.slug || "Category"}
                fill={true}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14]/80 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Countdown Timer */}
            <CountdownTimer
              targetDate={category?.batch_2_end || registrationDeadline}
            />

            {/* Registration Actions Card */}
            <div className="mia-card p-6 space-y-3.5 shadow-xl">
              {category.status === "VERIFIED" ? (
                <>
                  {/* Button Daftar */}
                  <Link
                    href={
                      isRegistrationClosed
                        ? "#"
                        : `/competition-registration?category=${category.category_id}`
                    }
                    className={`block ${
                      isRegistrationClosed ? "pointer-events-none" : ""
                    }`}
                  >
                    <span
                      className={`w-full h-12 flex items-center justify-center gap-2 text-sm font-bold transition-all duration-300 shadow-md ${
                        isRegistrationClosed
                          ? "bg-[#1E2939] text-[#AAB1BD] opacity-60 cursor-not-allowed rounded-full"
                          : "mia-btn-primary cursor-pointer"
                      }`}
                    >
                      <Trophy className="h-4 w-4 text-[#FED700]" />
                      <span>
                        {isRegistrationClosed
                          ? "Pendaftaran Telah Ditutup"
                          : "Daftar Sekarang"}
                      </span>
                    </span>
                  </Link>

                  {/* Button Download Panduan */}
                  <a
                    href={category.file_url || globalGuidebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mia-btn-secondary w-full h-12 flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer"
                  >
                    <Download className="h-4 w-4 text-[#E01C20]" />
                    <span>Download Guidebook</span>
                  </a>
                </>
              ) : (
                <div className="text-center p-4 bg-amber-500/10 rounded-2xl border border-amber-500/30">
                  <AlertCircle className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-amber-400 font-bold text-sm">
                    Kategori Belum Terverifikasi
                  </p>
                  <p className="text-xs text-amber-300/80 mt-1">
                    Pendaftaran akan dibuka setelah kategori ini
                    diverifikasi oleh panitia.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
