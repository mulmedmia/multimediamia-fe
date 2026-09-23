"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { getSafeImageUrl } from "@/lib/image-loader";
import { useUserCategories } from "@/hooks/user-use-category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Search,
  Calendar,
  User,
  Users,
  ArrowRight,
  Trophy,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";

const PAGE_SIZE = 6;

// Loading Skeleton Component matching MIA 2026 design system
function CategorySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="mia-card overflow-hidden animate-pulse flex flex-col"
        >
          <div className="aspect-video w-full bg-[#1E2939]" />
          <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-5 w-3/4 bg-[#1E2939] rounded" />
              <div className="h-3.5 w-full bg-[#1E2939] rounded" />
              <div className="h-3.5 w-2/3 bg-[#1E2939] rounded" />
            </div>
            <div className="space-y-2.5 pt-2">
              <div className="h-10 w-full bg-[#1E2939] rounded-xl" />
              <div className="h-10 w-full bg-[#1E2939] rounded-xl" />
              <div className="h-10 w-full bg-[#1E2939] rounded-xl" />
            </div>
            <div className="h-11 w-full bg-[#1E2939] rounded-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

const CATEGORY_CUSTOM_DATA = {
  UIA: {
    title: "UIA (UI/UX In Action)",
    description:
      "UI/UX In Action (UIA) adalah kompetisi desain UI/UX tingkat nasional bagi pelajar SMA/SMK dan mahasiswa. Melalui pendekatan Problem Based Design, UIA menantang peserta untuk memecahkan studi kasus dan menciptakan produk digital yang relevan dengan kebutuhan industri.",
    organizer: "KSM Multimedia UPN Veteran Jakarta",
    batch1: "24 September – 5 Oktober 2026",
    batch2: "6 – 16 Oktober 2026",
    teamType: "1 hingga 3 Orang",
  },
  WIA: {
    title: "🌐 WIA (Web In Action)",
    description:
      'Web In Action (WIA) adalah kompetisi web development tingkat nasional bagi pelajar SMA/SMK dan mahasiswa. Membawa semangat "From Visionaries to Architects of Change", WIA menantang peserta untuk merancang aplikasi web yang fungsional, solutif, dan berbasis studi kasus.',
    organizer: "KSM Multimedia UPN Veteran Jakarta",
    batch1: "24 September – 5 Oktober 2026",
    batch2: "6 – 16 Oktober 2026",
    teamType: "1 hingga 3 Orang",
  },
};

const formatBatchDateRange = (startDateStr, endDateStr, fallbackStr) => {
  if (!startDateStr && !endDateStr) return fallbackStr;
  try {
    const start = startDateStr ? new Date(startDateStr) : null;
    const end = endDateStr ? new Date(endDateStr) : null;

    if (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
      const sameMonth = start.getMonth() === end.getMonth();
      const sameYear = start.getFullYear() === end.getFullYear();

      const startDay = start.getDate();
      const endDay = end.getDate();

      const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];

      if (sameMonth && sameYear) {
        return `${startDay} – ${endDay} ${months[start.getMonth()]} ${start.getFullYear()}`;
      } else if (sameYear) {
        return `${startDay} ${months[start.getMonth()]} – ${endDay} ${months[end.getMonth()]} ${start.getFullYear()}`;
      } else {
        return `${startDay} ${months[start.getMonth()]} ${start.getFullYear()} – ${endDay} ${months[end.getMonth()]} ${end.getFullYear()}`;
      }
    } else if (start && !isNaN(start.getTime())) {
      return `Mulai ${start.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`;
    } else if (end && !isNaN(end.getTime())) {
      return `Hingga ${end.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`;
    }
  } catch (err) {
    console.error("Error formatting batch date range:", err);
  }
  return fallbackStr;
};

// Category Card Component matching MIA 2026 standards
function CategoryCard({ category }) {
  const slugUpper = (category.slug || "").toUpperCase();
  const custom = CATEGORY_CUSTOM_DATA[slugUpper] || {};

  const title = custom.title || category.name || category.category_name;
  const description = category.description || custom.description || "Kompetisi multimedia terbaik untuk mengasah skill digital dan kreasi visualmu.";
  const organizer = category.organizer || custom.organizer || "KSM Multimedia UPN Veteran Jakarta";

  const batch1 = formatBatchDateRange(
    category.batch_1_start,
    category.batch_1_end,
    custom.batch1 || "24 September – 5 Oktober 2026"
  );
  const batch2 = formatBatchDateRange(
    category.batch_2_start,
    category.batch_2_end,
    custom.batch2 || "6 – 16 Oktober 2026"
  );
  const teamType = custom.teamType || (category.team_type === "GROUP" ? "1 hingga 3 Orang" : "Individu");

  return (
    <div className="mia-card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#E01C20]/40 flex flex-col h-full shadow-xl">
      {/* 16:9 Aspect Ratio Image Section */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#1E2939]">
        <Image
          src={getSafeImageUrl(category.image) || "/placeholder-image.png"}
          alt={title}
          fill={true}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-3 left-3 z-10">
          <span className="mia-pill-badge bg-[#0A0D14]/90 text-[#FFF9F5] backdrop-blur-md font-mono">
            <Trophy className="h-3 w-3 text-[#FED700]" />
            {category.slug || category.category_name}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4 flex flex-col flex-1">
        <div>
          <h3 className="text-xl font-bold text-[#FFF9F5] group-hover:text-[#E01C20] transition-colors mb-2">
            {title}
          </h3>
          <p className="text-sm text-[#AAB1BD] leading-relaxed">
            {description}
          </p>
        </div>

        {/* Metadata Rows with Circular Icon Badges */}
        <div className="space-y-2.5 pt-2">
          {/* Penyelenggara */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#1E2939]/60 border border-white/5">
            <div className="w-7 h-7 rounded-full bg-[#E01C20]/15 border border-[#E01C20]/30 flex items-center justify-center flex-shrink-0">
              <User className="h-3.5 w-3.5 text-[#E01C20]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[#99A1AF]">Penyelenggara</p>
              <p className="text-xs font-semibold text-[#FFF9F5] truncate">
                {organizer}
              </p>
            </div>
          </div>

          {/* Batch 1 & Batch 2 Rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#1E2939]/60 border border-white/5">
              <div className="w-6 h-6 rounded-full bg-[#FF4500]/15 border border-[#FF4500]/30 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-3 w-3 text-[#FF4500]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-[#99A1AF]">Batch 1</p>
                <p className="text-xs font-semibold text-[#FFF9F5] truncate">
                  {batch1}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#1E2939]/60 border border-white/5">
              <div className="w-6 h-6 rounded-full bg-[#FED700]/15 border border-[#FED700]/30 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-3 w-3 text-[#FED700]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-[#99A1AF]">Batch 2</p>
                <p className="text-xs font-semibold text-[#FFF9F5] truncate">
                  {batch2}
                </p>
              </div>
            </div>
          </div>

          {/* Kategori Tim */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#1E2939]/60 border border-white/5">
            <div className="w-7 h-7 rounded-full bg-[#00B445]/15 border border-[#00B445]/30 flex items-center justify-center flex-shrink-0">
              <Users className="h-3.5 w-3.5 text-[#00B445]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[#99A1AF]">Kategori Tim</p>
              <p className="text-xs font-semibold text-[#FFF9F5]">
                {teamType}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 mt-auto">
          <Link href={`/category/${category.category_id}`} className="block">
            <span className="mia-btn-primary w-full py-2.5 px-4 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md group-hover:shadow-[0_0_20px_rgba(224,28,32,0.4)]">
              <span>Detail Kompetisi</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CategoryListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");

  const { data, isLoading, isError, error } = useUserCategories({
    limit: PAGE_SIZE,
    page,
    search,
    status,
  });

  const categories = data?.categories || [];
  const totalPages = data?.meta?.totalPages || 1;

  const handleSearch = () => {
    setSearch(input.trim());
    setPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const filteredCategories = useMemo(() => {
    if (status) {
      return categories.filter((category) => category.status === status);
    }
    return categories;
  }, [categories, status]);

  return (
    <div className="min-h-screen bg-[#0A0D14] mia-connected-bg text-[#FFF9F5] flex flex-col justify-between selection:bg-[#E01C20] selection:text-white">
      <div>
        <Header />

        <main className="pt-24 sm:pt-28 pb-16 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-8 md:space-y-12">
            {/* Eyebrow & Page Header */}
            <div className="text-center space-y-3 md:space-y-4 max-w-3xl mx-auto">
              <div className="mia-pill-badge mx-auto">
                <Trophy className="h-3.5 w-3.5 text-[#FED700]" />
                <span>Katalog Kompetisi MIA 2026</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FFF9F5]">
                Pilihan <span className="text-[#E01C20]">Kompetisi</span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-[#AAB1BD] leading-relaxed">
                Temukan berbagai cabang kompetisi digital kreatif, tunjukkan karya
                terbaikmu, dan raih kesempatan memenangkan hadiah bergengsi di
                Multimedia in Action 2026.
              </p>
            </div>

            {/* Search Bar Card */}
            <div className="mia-card p-3 sm:p-4 max-w-2xl mx-auto shadow-lg">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full flex items-center">
                  <Search className="absolute left-3.5 h-4 w-4 text-[#AAB1BD]" />
                  <Input
                    placeholder="Cari kategori lomba (misal: UI/UX, Web Dev...)"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="pl-10 h-11 bg-[#1E2939]/60 border-white/10 rounded-xl text-sm text-[#FFF9F5] placeholder:text-[#AAB1BD] focus-visible:ring-1 focus-visible:ring-[#E01C20]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    onClick={handleSearch}
                    className="mia-btn-primary h-11 px-6 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                  >
                    <Search className="h-4 w-4" />
                    <span>Cari</span>
                  </Button>
                  {search && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setInput("");
                        setSearch("");
                        setPage(1);
                      }}
                      className="h-11 px-3 text-xs text-[#AAB1BD] hover:text-[#FFF9F5] rounded-xl cursor-pointer"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Content Section */}
            {isLoading ? (
              <CategorySkeleton />
            ) : isError ? (
              <div className="mia-card p-8 md:p-12 text-center space-y-4 max-w-lg mx-auto">
                <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 text-[#E01C20] rounded-2xl flex items-center justify-center mx-auto">
                  <AlertCircle className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#FFF9F5]">Gagal Memuat Data</h3>
                  <p className="text-xs text-[#AAB1BD]">
                    {error?.message || "Terjadi kesalahan saat memuat kategori lomba. Silakan coba kembali."}
                  </p>
                </div>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="mia-card p-10 sm:p-14 text-center space-y-4 max-w-lg mx-auto">
                <div className="w-16 h-16 bg-[#E01C20]/15 border border-[#E01C20]/30 text-[#E01C20] rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(224,28,32,0.2)]">
                  <Trophy className="h-8 w-8 text-[#E01C20]" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#FFF9F5]">
                    Kategori Tidak Ditemukan
                  </h3>
                  <p className="text-sm text-[#AAB1BD] leading-relaxed">
                    {search
                      ? `Tidak ada kategori lomba yang cocok dengan kata kunci "${search}".`
                      : "Belum ada kategori lomba yang tersedia saat ini."}
                  </p>
                </div>
                {search && (
                  <Button
                    onClick={() => {
                      setInput("");
                      setSearch("");
                      setPage(1);
                    }}
                    className="mia-btn-secondary px-5 py-2 text-xs font-semibold cursor-pointer"
                  >
                    Bersihkan Pencarian
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredCategories.map((category) => (
                  <CategoryCard key={category.category_id} category={category} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && !isError && totalPages > 1 && (
              <div className="flex justify-center pt-4">
                <Pagination>
                  <PaginationContent className="mia-card p-1.5 rounded-full border border-white/10 flex items-center gap-1">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className={
                          page === 1
                            ? "pointer-events-none opacity-40 rounded-full text-[#AAB1BD]"
                            : "cursor-pointer rounded-full text-[#FFF9F5] hover:bg-white/10"
                        }
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink className="bg-[#E01C20] text-[#FFF9F5] hover:bg-[#c4181c] rounded-full font-bold shadow-md shadow-red-900/30">
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                    {totalPages > 1 && page < totalPages && (
                      <PaginationItem>
                        <span className="px-2 text-[#99A1AF]">...</span>
                      </PaginationItem>
                    )}
                    {totalPages > 1 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setPage(totalPages)}
                          className="rounded-full text-[#AAB1BD] hover:text-[#FFF9F5] hover:bg-white/10 cursor-pointer"
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        className={
                          page === totalPages
                            ? "pointer-events-none opacity-40 rounded-full text-[#AAB1BD]"
                            : "cursor-pointer rounded-full text-[#FFF9F5] hover:bg-white/10"
                      }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
