"use client";

import React, { useState, useMemo } from "react";
import { useUserCategories } from "@/hooks/user-use-category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";

const PAGE_SIZE = 6;

// Loading Skeleton Component matching design.md specification
function CategorySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card
          key={i}
          className="overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151C28]/60 shadow-sm"
        >
          <div className="relative h-48 bg-gray-100 dark:bg-gray-800/50">
            <Skeleton className="w-full h-full bg-gray-200 dark:bg-gray-800" />
          </div>
          <CardHeader className="pt-5 pb-3">
            <Skeleton className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 mb-2" />
            <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-800" />
            <Skeleton className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 mt-1" />
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="space-y-2">
              <Skeleton className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
              <Skeleton className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
              <Skeleton className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
            </div>
            <Skeleton className="h-10 w-full rounded-full bg-gray-200 dark:bg-gray-800 mt-4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Category Card Component built per design.md guidelines
function CategoryCard({ category }) {
  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: id });
    } catch {
      return "Tanggal tidak valid";
    }
  };

  const isDeadlineSoon = () => {
    if (!category.deadline) return false;
    const deadline = new Date(category.deadline);
    const now = new Date();
    const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  return (
    <Card className="group overflow-hidden hover:shadow-[0_10px_30px_rgba(224,28,32,0.15)] transition-all duration-300 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151C28]/80 hover:border-[#E01C20]/50 dark:hover:border-[#E01C20]/60 hover:-translate-y-1 relative flex flex-col rounded-2xl">
      {/* Thumbnail Image Header */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-red-950/20 via-black to-red-900/10">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>

        <div class="w-full h-full transition-transform duration-500 group-hover:scale-105">
          <Image
            src={category.image || "/placeholder-image.png"}
            alt={category.category_name}
            fill={true}
            className="object-cover"
            onError={(e) => {
              e.target.src = "/placeholder-image.png";
            }}
          />
        </div>

        {/* Verification Status Badge */}
        <div className="absolute top-3 left-3 z-20">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border shadow-sm ${
              category.status === "VERIFIED"
                ? "bg-[#00B445]/20 text-[#00B445] border-[#00B445]/40"
                : "bg-gray-800/80 text-gray-300 border-gray-700"
            }`}
          >
            {category.status === "VERIFIED" ? (
              <>
                <CheckCircle2 className="h-3 w-3 mr-1 text-[#00B445]" />
                Terverifikasi
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1 text-gray-400" />
                Belum Verifikasi
              </>
            )}
          </span>
        </div>

        {/* Category Pill Tag Overlay */}
        <div className="absolute bottom-3 left-3 z-20">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-black/70 text-[#FFF9F5] border border-white/10 backdrop-blur-md">
            <Trophy className="h-3 w-3 mr-1.5 text-[#FED700]" />
            {category.category_name}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1 space-y-4">
        <div>
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-[#FFF9F5] line-clamp-2 group-hover:text-[#E01C20] dark:group-hover:text-[#E01C20] transition-colors duration-300 mb-2 leading-snug">
            {category.title || category.category_name}
          </CardTitle>
          <p className="text-xs text-gray-600 dark:text-[#AAB1BD] line-clamp-2 leading-relaxed">
            {category.description ||
              "Tidak ada deskripsi tersedia untuk kategori lomba ini."}
          </p>
        </div>

        {/* Info Rows */}
        <div className="space-y-2 mt-auto pt-2">
          {/* Penyelenggara */}
          <div className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-[#1E2939]/70 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="w-6 h-6 bg-[#E01C20]/10 dark:bg-[#E01C20]/20 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-3.5 w-3.5 text-[#E01C20]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-900 dark:text-[#FFF9F5] truncate">
                {category.organizer || "Penyelenggara MIA 2026"}
              </p>
            </div>
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-[#1E2939]/70 rounded-xl border border-gray-100 dark:border-gray-800">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                isDeadlineSoon()
                  ? "bg-[#E01C20]/15 dark:bg-[#E01C20]/25"
                  : "bg-[#00B445]/15 dark:bg-[#00B445]/25"
              }`}
            >
              <Calendar
                className={`h-3.5 w-3.5 ${
                  isDeadlineSoon() ? "text-[#E01C20]" : "text-[#00B445]"
                }`}
              />
            </div>
            <div className="min-w-0 flex-1 flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-[#99A1AF]">
                Deadline:
              </span>
              <span
                className={`text-xs font-semibold ${
                  isDeadlineSoon()
                    ? "text-[#E01C20] dark:text-[#E01C20]"
                    : "text-gray-900 dark:text-[#FFF9F5]"
                }`}
              >
                {formatDate(category.deadline)}
              </span>
            </div>
          </div>

          {/* Tipe Tim */}
          <div className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-[#1E2939]/70 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="w-6 h-6 bg-blue-500/10 dark:bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <div className="min-w-0 flex-1 flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-[#99A1AF]">
                Tipe Tim:
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                {category.team_type === "GROUP" ? "Kelompok / Tim" : "Individu"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Link Button */}
        <div className="pt-2">
          <Link href={`/category/${category.category_id}`} className="block">
            <Button className="w-full bg-[#E01C20] hover:bg-[#9D1416] text-[#FFF9F5] rounded-full font-semibold text-xs h-10 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group/btn flex items-center justify-center">
              <span>Lihat Detail Kategori</span>
              <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
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
    setSearch(input);
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
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#151C28] text-gray-900 dark:text-[#FFF9F5] relative overflow-hidden font-sans">
      {/* Background Radial & Grid Pattern (per design.md) */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:hidden"></div>

      <div className="hidden dark:block absolute inset-0 -z-10 h-full w-full bg-[#151C28]">
        {/* Spotlights & Red Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#810220]/40 via-[#E01C20]/15 to-transparent blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[350px] bg-gradient-to-t from-[#810220]/30 to-transparent blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </div>

      <Header />

      <main className="flex-grow container mx-auto pt-28 pb-16 px-4 md:px-6 lg:px-8 relative z-10">
        {/* Hero Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-[#E01C20] to-[#FF4500] text-[#FFF9F5] border-0 px-4 py-1.5 text-xs font-semibold shadow-lg inline-flex items-center gap-1.5 rounded-full">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Katalog Kompetisi MIA 2026</span>
          </Badge>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
            Jelajahi Kategori{" "}
            <span className="bg-gradient-to-r from-[#E01C20] via-[#FF4500] to-[#FED700] bg-clip-text text-transparent">
              Lomba Populer
            </span>
          </h1>

          <p className="text-sm md:text-base text-gray-600 dark:text-[#AAB1BD] leading-relaxed max-w-2xl mx-auto">
            Temukan berbagai cabang kompetisi digital kreatif, tunjukkan karya
            terbaikmu, dan raih kesempatan memenangkan hadiah bergengsi di
            Multimedia in Action 2026.
          </p>

          <div className="w-24 h-1 bg-gradient-to-r from-[#E01C20] to-[#FF4500] mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 bg-gray-50/80 dark:bg-[#1E2939]/80 p-2 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-md">
            <div className="flex-1 relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-gray-400 dark:text-[#99A1AF]" />
              <Input
                placeholder="Cari kategori lomba (misal: UI/UX, Web Dev...)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="pl-10 h-11 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm text-gray-900 dark:text-[#FFF9F5] placeholder:text-gray-400 dark:placeholder:text-[#99A1AF]"
              />
            </div>

            <Button
              onClick={handleSearch}
              className="h-11 px-6 bg-[#E01C20] hover:bg-[#9D1416] text-[#FFF9F5] rounded-xl font-semibold text-sm shadow-md transition-all duration-300 cursor-pointer flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              <span>Cari Lomba</span>
            </Button>
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <CategorySkeleton />
        ) : isError ? (
          <Alert variant="destructive" className="max-w-lg mx-auto rounded-2xl">
            <AlertTitle className="font-semibold">Gagal Memuat Data</AlertTitle>
            <AlertDescription>
              {error?.message ||
                "Terjadi kesalahan saat memuat kategori. Silakan coba lagi."}
            </AlertDescription>
          </Alert>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-16 bg-gray-50/50 dark:bg-[#1E2939]/30 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-[#E01C20]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-[#E01C20]" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-[#FFF9F5]">
              Kategori Tidak Ditemukan
            </h3>
            <p className="text-sm text-gray-500 dark:text-[#AAB1BD] max-w-md mx-auto mb-6">
              {search
                ? `Tidak ada kategori lomba yang cocok dengan kata kunci "${search}"`
                : "Belum ada kategori lomba yang tersedia saat ini."}
            </p>
            {search && (
              <Button
                variant="outline"
                onClick={() => {
                  setInput("");
                  setSearch("");
                  setPage(1);
                }}
                className="rounded-full border-gray-300 dark:border-gray-700 text-sm cursor-pointer"
              >
                Bersihkan Pencarian
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategories.map((category) => (
              <CategoryCard key={category.category_id} category={category} />
            ))}
          </div>
        )}

        {/* Pagination Section */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <Pagination>
              <PaginationContent className="bg-gray-50 dark:bg-[#1E2939]/80 p-1.5 rounded-full border border-gray-200 dark:border-gray-800">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={
                      page === 1
                        ? "pointer-events-none opacity-40 rounded-full"
                        : "cursor-pointer rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink className="bg-[#E01C20] text-[#FFF9F5] hover:bg-[#9D1416] rounded-full font-bold">
                    {page}
                  </PaginationLink>
                </PaginationItem>
                {totalPages > 1 && page < totalPages && (
                  <PaginationItem>
                    <span className="px-3 text-[#99A1AF]">...</span>
                  </PaginationItem>
                )}
                {totalPages > 1 && (
                  <PaginationItem>
                    <PaginationLink className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-sm">
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-40 rounded-full"
                        : "cursor-pointer rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
