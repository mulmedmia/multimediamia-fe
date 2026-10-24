"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAllSubmissions } from "@/hooks/user-use-submissions";
import { useCategories } from "@/hooks/user-use-gamifikasi";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Users,
  AlertCircle,
  Target,
  User,
  Lightbulb,
  ArrowRight,
  Search,
  X,
} from "lucide-react";
import YouTubePreview from "@/components/common/YouTubePreview";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getRankBadgeColor } from "@/components/leaderboard/RankIcon";
import {
  getTopSubmissionLinks,
  LinkTypeIcon,
  normalizeLinkType,
} from "@/components/LinTypekIcon";

function getStatusBadge({ status }) {
  switch (status) {
    case "APPROVED":
      return "bg-[#00B445]/15 text-[#00B445] border border-[#00B445]/30";
    case "PENDING":
      return "bg-[#FED700]/15 text-[#FED700] border border-[#FED700]/30";
    case "REJECTED":
      return "bg-[#E01C20]/15 text-[#E01C20] border border-[#E01C20]/30";
    default:
      return "bg-[#1E2939] text-[#AAB1BD] border border-white/10";
  }
}

function ShowItSelectItem({ value = "", content = "" }) {
  return (
    <SelectItem
      value={value}
      className="flex flex-col items-start py-2.5 px-3.5 gap-1 text-left text-[#FFF9F5] hover:bg-[#E01C20]/20 focus:bg-[#E01C20]/20 rounded-lg cursor-pointer transition-colors"
    >
      <span className="font-semibold text-sm md:text-base">{content}</span>
    </SelectItem>
  );
}

function ShowItContent() {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();

  const defaultCategoryId = searchParams?.get("category_id") || "all";
  const defaultSearch = searchParams?.get("search") || "";

  const [selectedCategoryId, setSelectedCategoryId] =
    useState(defaultCategoryId);
  const [searchInput, setSearchInput] = useState(defaultSearch);
  const [appliedSearch, setAppliedSearch] = useState(defaultSearch);
  const router = useRouter();

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const isAllCategory = selectedCategoryId === "all";
  const selectedCategorySlug = isAllCategory
    ? "seluruh kategori"
    : categories?.find((c) => c.category_id === selectedCategoryId).slug;

  const {
    data: submissionsData,
    isLoading: submissionsLoading,
    isError,
  } = useAllSubmissions(selectedCategoryId);

  // Filter hanya submission yang berstatus APPROVED dan diizinkan tampil di Show It
  const allSubmissions = submissionsData?.submissions || [];
  const submissions = allSubmissions.filter(
    (submission) =>
      submission.status === "APPROVED" && Boolean(submission.is_verified),
  );

  const isSearching = Boolean(appliedSearch.trim());

  // Filter pencarian berdasarkan judul karya, nama tim, atau deskripsi
  const filteredSubmissions = submissions.filter((submission) => {
    if (!isSearching) return true;
    const q = appliedSearch.toLowerCase().trim();
    const teamName =
      submission.registration?.team_name || submission.team_name || "";
    return (
      submission.project_name?.toLowerCase().includes(q) ||
      teamName.toLowerCase().includes(q) ||
      submission.description?.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (!mounted && !searchParams.toString()) {
      setMounted(true);
      router.replace(`/show-it?category_id=${selectedCategoryId}`);
    }
  }, [mounted, searchParams, router, selectedCategoryId]);

  const createQueryString = useCallback(
    (keyValueObj = {}) => {
      const params = new URLSearchParams(searchParams?.toString());

      for (const [name = "", value = ""] of Object.entries(keyValueObj)) {
        if (typeof name === "string" && typeof value === "string") {
          const trimmedValue = value.trim();

          if (trimmedValue) params.set(name, trimmedValue);
          else params.delete(name);
        }
      }

      return params.toString();
    },
    [searchParams],
  );

  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);
    router.replace(
      `/show-it?${createQueryString({ category_id: categoryId })}`,
      {
        scroll: false,
      },
    );
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    setAppliedSearch(searchInput.trim());
    router.replace(
      `/show-it?${createQueryString({ search: searchInput.trim() })}`,
      {
        scroll: false,
      },
    );
  };

  const handleResetSearch = () => {
    setSearchInput("");
    setAppliedSearch("");
    router.replace(`/show-it?${createQueryString({ search: "" })}`, {
      scroll: false,
    });
  };

  const handleSubmissionClick = (submissionId) => {
    sessionStorage.setItem(
      "previousShowIt",
      `/show-it?${searchParams.toString()}`,
    );
    router.push(`/show-it/${submissionId}`);
  };

  return (
    <main className="pt-24 sm:pt-28 pb-16 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-8 md:space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-3 md:space-y-4 max-w-3xl mx-auto">
          <div className="mia-pill-badge mx-auto">
            <Sparkles className="h-3.5 w-3.5 text-[#E01C20]" />
            <span>Showcase Karya Peserta</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FFF9F5]">
            Show It — <span className="text-[#E01C20]">Galeri Karya</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[#AAB1BD] leading-relaxed">
            Jelajahi dan temukan inspirasi dari karya-karya inovatif dan
            kreatif peserta kompetisi Multimedia in Action 2026!
          </p>
        </div>

        {/* Category Selection & Search Card */}
        <div className="mia-card p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E01C20]/15 border border-[#E01C20]/30 flex items-center justify-center text-[#E01C20] flex-shrink-0">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-[#FFF9F5]">
                Pilih Kategori & Cari Karya
              </h2>
              <p className="text-xs md:text-sm text-[#AAB1BD]">
                Pilih kategori untuk memuat karya dan gunakan kotak
                pencarian untuk mencari karya spesifik
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Select Kategori */}
            <div className="md:col-span-5">
              <Select
                value={selectedCategoryId}
                onValueChange={handleCategoryChange}
                disabled={categoriesLoading}
              >
                <SelectTrigger className="w-full h-12! bg-[#141824] border border-white/15 hover:border-[#E01C20]/60 rounded-xl text-[#FFF9F5] focus:ring-[#E01C20] transition-colors cursor-pointer">
                  <SelectValue
                    placeholder={
                      categoriesLoading
                        ? "Memuat kategori..."
                        : "💡 Pilih kategori lomba..."
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-[#141824] border border-white/15 text-[#FFF9F5] rounded-xl shadow-2xl">
                  <ShowItSelectItem
                    key="all"
                    value="all"
                    content="Semua Kategori"
                  />

                  {categories?.map((category) => (
                    <ShowItSelectItem
                      key={category.category_id}
                      value={category.category_id}
                      content={category.name}
                    />
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Form */}
            <form
              onSubmit={handleSearchSubmit}
              className="md:col-span-7 flex flex-col sm:flex-row gap-2.5"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#AAB1BD] pointer-events-none" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={
                    selectedCategoryId
                      ? "Ketik nama karya atau nama tim..."
                      : "Pilih kategori terlebih dahulu..."
                  }
                  disabled={!selectedCategoryId}
                  className="w-full h-12 bg-[#141824] border border-white/15 focus:border-[#E01C20] focus:ring-1 focus:ring-[#E01C20] rounded-xl pl-10 pr-10 text-sm text-[#FFF9F5] placeholder-[#99A1AF] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleResetSearch}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#AAB1BD] hover:text-[#FFF9F5] p-1 cursor-pointer transition-colors"
                    title="Hapus pencarian"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  type="submit"
                  disabled={!selectedCategoryId}
                  className="h-12 px-5 bg-[#E01C20] hover:bg-[#b01417] text-white font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#E01C20]/20"
                >
                  <Search className="h-4 w-4" />
                  <span>Cari</span>
                </Button>
                {isSearching && (
                  <Button
                    type="button"
                    onClick={handleResetSearch}
                    variant="outline"
                    className="h-12 px-4 rounded-xl border-white/15 text-xs text-[#FFF9F5] hover:bg-white/10 cursor-pointer"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Loading State */}
        {submissionsLoading && !submissionsData && selectedCategoryId && (
          <div className="text-center py-12 md:py-16">
            <div className="inline-flex items-center gap-3 text-[#AAB1BD]">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#E01C20] border-t-transparent"></div>
              <span className="text-base font-medium">Memuat karya...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && selectedCategoryId && (
          <div className="mia-card border-[#E01C20]/40 p-6 md:p-8 flex items-center gap-4">
            <div className="p-3 bg-[#E01C20]/20 text-[#E01C20] rounded-xl flex-shrink-0">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-base md:text-lg text-[#FFF9F5] mb-1">
                Gagal Memuat Data
              </h3>
              <p className="text-xs md:text-sm text-[#AAB1BD]">
                Tidak dapat memuat karya untuk kategori ini. Silakan coba
                beberapa saat lagi.
              </p>
            </div>
          </div>
        )}

        {/* Empty State jika belum ada karya sama sekali dalam kategori */}
        {submissions.length === 0 &&
          selectedCategoryId &&
          !submissionsLoading &&
          !isError && (
            <div className="mia-card p-8 md:p-14 text-center space-y-4 border-dashed border-white/15">
              <div className="w-14 h-14 bg-[#E01C20]/15 border border-[#E01C20]/30 text-[#E01C20] rounded-2xl flex items-center justify-center mx-auto">
                <Lightbulb className="h-7 w-7" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-xl font-bold text-[#FFF9F5]">
                  Belum Ada Karya
                </h3>
                <p className="text-sm text-[#AAB1BD]">
                  Belum ada karya yang disetujui dan ditampilkan untuk
                  kategori ini.
                </p>
              </div>
            </div>
          )}

        {/* Empty State jika hasil pencarian tidak ditemukan */}
        {submissions.length > 0 &&
          isSearching &&
          filteredSubmissions.length === 0 &&
          !submissionsLoading && (
            <div className="mia-card p-8 md:p-14 text-center space-y-4 border-dashed border-white/15">
              <div className="w-14 h-14 bg-white/5 border border-white/10 text-[#AAB1BD] rounded-2xl flex items-center justify-center mx-auto">
                <Search className="h-7 w-7 text-[#AAB1BD]" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-xl font-bold text-[#FFF9F5]">
                  Karya Tidak Ditemukan
                </h3>
                <p className="text-sm text-[#AAB1BD]">
                  Tidak ada karya {!isAllCategory && selectedCategorySlug}{" "}
                  yang cocok dengan kata kunci &quot;
                  <span className="text-[#FFF9F5] font-semibold">
                    {appliedSearch}
                  </span>
                  &quot;.
                </p>
              </div>
              <Button
                onClick={handleResetSearch}
                variant="outline"
                size="sm"
                className="rounded-full border-white/15 text-xs text-[#FFF9F5] hover:bg-white/10 cursor-pointer"
              >
                Reset Pencarian
              </Button>
            </div>
          )}

        {/* Submissions Grid */}
        {filteredSubmissions.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#FFF9F5]">
                  Daftar Karya Peserta
                </h2>
                <p className="text-xs sm:text-sm text-[#AAB1BD]">
                  {isSearching
                    ? `Menampilkan ${filteredSubmissions.length} dari ${submissions.length} karya untuk pencarian "${appliedSearch}"`
                    : `Menampilkan ${filteredSubmissions.length} karya inovatif dari ${selectedCategoryId === "all" ? "semua kategori" : `kategori ${selectedCategorySlug}`}`}
                </p>
              </div>
              <span className="text-xs text-[#AAB1BD] bg-[#1E2939] border border-white/10 px-3 py-1.5 rounded-full w-fit">
                Klik karya untuk melihat detail & media
              </span>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubmissions.map((submission) => (
                <div
                  key={submission.submission_id}
                  onClick={() =>
                    handleSubmissionClick(submission.submission_id)
                  }
                  className="mia-card p-6 flex flex-col justify-between hover:border-[#E01C20]/60 hover:shadow-[0_0_30px_rgba(224,28,32,0.15)] transition-all duration-300 group cursor-pointer"
                >
                  <div className="space-y-4">
                    {/* Preview YouTube (Dapat di-play langsung) */}
                    <YouTubePreview
                      submission={submission}
                      title={`Video Karya ${submission.project_name}`}
                      showFallback={false}
                      className="rounded-xl border border-white/10"
                    />

                    {/* Header & Status */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-bold text-[#FFF9F5] group-hover:text-[#E01C20] transition-colors line-clamp-2">
                          {submission.project_name}
                        </h3>
                        <span
                          className={cn(
                            "text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap",
                            getStatusBadge(submission.status),
                          )}
                        >
                          {submission.status === "APPROVED"
                            ? "✓ Disetujui"
                            : submission.status}
                        </span>
                      </div>

                      <div className="flex flex-row items-center gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-[#AAB1BD]">
                          <Users className="h-3.5 w-3.5 text-[#FED700]" />
                          <span className="truncate font-medium">
                            {submission.registration?.team_name ||
                              submission.team_name ||
                              submission.registration?.user?.name ||
                              submission.user?.name ||
                              "-"}
                          </span>
                        </div>
                        {isAllCategory && (
                          <Badge
                            className={cn(
                              getRankBadgeColor(-1),
                              "scale-90 bg-[#1E2939]/30",
                            )}
                          >
                            {submission.category?.name}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-[#AAB1BD] line-clamp-3 leading-relaxed">
                      {submission.description ||
                        "Tidak ada deskripsi singkat."}
                    </p>

                    {/* Project Links */}
                    {submission.links && submission.links.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] uppercase tracking-wider text-[#99A1AF] font-semibold">
                          Tautan Karya:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {getTopSubmissionLinks(3, submission.links).map(
                            (link) => (
                              <a
                                key={link.link_id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1E2939] hover:bg-[#E01C20]/20 border border-white/10 hover:border-[#E01C20]/40 rounded-md text-xs text-[#FFF9F5] transition-colors"
                              >
                                <LinkTypeIcon linkType={link.link_type} />
                                <span className="capitalize">
                                  {normalizeLinkType(link.link_type)}
                                </span>
                              </a>
                            ),
                          )}
                          {submission.links.length > 3 && (
                            <span className="text-xs text-[#AAB1BD] self-center px-1">
                              +{submission.links.length - 3} lainnya
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Info */}
                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#99A1AF]">
                    <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                      <User className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">
                        {submission.registration?.user?.name ||
                          submission.user?.name ||
                          "Peserta"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[#E01C20] font-semibold group-hover:translate-x-1 transition-transform">
                      <span>Detail</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Default Call to Action (When No Category Selected) */}
        {!selectedCategoryId && (
          <div className="mia-card p-8 md:p-16 text-center space-y-4">
            <div className="w-16 h-16 bg-[#E01C20]/15 border border-[#E01C20]/30 text-[#E01C20] rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Lightbulb className="h-8 w-8" />
            </div>
            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="text-xl sm:text-2xl font-bold text-[#FFF9F5]">
                Pilih Kategori untuk Melihat Galeri Karya
              </h3>
              <p className="text-sm sm:text-base text-[#AAB1BD] leading-relaxed">
                Pilih salah satu kategori lomba di atas untuk melihat
                karya-karya terbaik yang telah dipublikasikan oleh para
                peserta.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ShowItPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-[#06080C] text-[#FFF9F5]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-xs text-[#AAB1BD]">Memuat galeri Show It...</p>
          </div>
        </div>
      }
    >
      <ShowItContent />
    </Suspense>
  );
}
