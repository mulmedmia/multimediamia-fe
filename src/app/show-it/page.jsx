"use client";

import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAllSubmissions } from "@/hooks/user-use-submissions";
import { useCategories } from "@/hooks/user-use-gamifikasi";
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
  ImageIcon,
  Trophy,
} from "lucide-react";
import { getSafeImageUrl } from "@/lib/image-loader";
import { getYouTubeVideoId } from "@/lib/youtube";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function getCategoryBadgeColor(category) {
  const slug = (category?.slug || "").toUpperCase();
  const name = (category?.name || category?.category_name || "").toUpperCase();

  if (
    slug === "WIA" ||
    slug === "WEB DEVELOPMENT" ||
    name.includes("WEB IN ACTION") ||
    name.includes("WEB")
  ) {
    return "bg-sky-500/15 text-sky-300 border border-sky-500/40";
  }

  if (
    slug === "UIA" ||
    slug === "UI/UX DESIGN" ||
    name.includes("UI/UX")
  ) {
    return "bg-purple-500/15 text-purple-300 border border-purple-500/40";
  }

  return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40";
}

function getSubmissionThumbnail(submission) {
  const directThumbnail = submission?.thumbnail_url || submission?.thumbnail;
  if (directThumbnail) return getSafeImageUrl(directThumbnail);

  // Fallback ke thumbnail YouTube jika ada link video
  const ytLink =
    submission?.links?.find((l) => l?.link_type?.toUpperCase() === "YOUTUBE")?.url ||
    submission?.links?.find((l) => l?.url?.includes("youtu"))?.url;
  if (ytLink) {
    const videoId = getYouTubeVideoId(ytLink);
    if (videoId) return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  }

  return null;
}

function getFinalistCategoryMeta(category) {
  const slug = (category?.slug || "").toUpperCase();
  const name = (category?.name || category?.category_name || "").toUpperCase();

  if (slug === "UIA" || slug === "UI/UX DESIGN" || name.includes("UI/UX")) {
    return {
      key: "UIA",
      shortLabel: "UIA",
      fullName: category?.name || category?.category_name || "UI/UX In Action",
      order: 1,
      badgeClass: "bg-purple-500/15 text-purple-300 border border-purple-500/40",
    };
  }

  if (
    slug === "WIA" ||
    slug === "WEB DEVELOPMENT" ||
    name.includes("WEB IN ACTION") ||
    name.includes("WEB")
  ) {
    return {
      key: "WIA",
      shortLabel: "WIA",
      fullName: category?.name || category?.category_name || "Web In Action",
      order: 2,
      badgeClass: "bg-sky-500/15 text-sky-300 border border-sky-500/40",
    };
  }

  const fallbackLabel = category?.slug || category?.name || "Kompetisi";
  return {
    key: category?.category_id || fallbackLabel,
    shortLabel: fallbackLabel,
    fullName: category?.name || category?.category_name || fallbackLabel,
    order: 3,
    badgeClass: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40",
  };
}

function SubmissionCard({
  submission,
  isAllCategory,
  isFinalist = false,
  onClick,
}) {
  const thumbUrl = getSubmissionThumbnail(submission);

  return (
    <div
      onClick={() => onClick(submission.submission_id)}
      className={cn(
        "mia-card p-6 flex flex-col justify-between transition-all duration-300 group cursor-pointer",
        isFinalist
          ? "border-[#FED700]/30 hover:border-[#FED700]/70 hover:shadow-[0_0_30px_rgba(254,215,0,0.14)]"
          : "hover:border-[#E01C20]/60 hover:shadow-[0_0_30px_rgba(224,28,32,0.15)]",
      )}
    >
      <div className="space-y-4">
        {/* Thumbnail Karya */}
        <div
          className={cn(
            "relative aspect-video w-full rounded-xl overflow-hidden bg-[#141824] border transition-all duration-300 shadow-inner flex items-center justify-center",
            isFinalist
              ? "border-[#FED700]/25 group-hover:border-[#FED700]/60"
              : "border-white/10 group-hover:border-[#E01C20]/40",
          )}
        >
          {isFinalist && (
            <div className="absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0A0D14]/85 backdrop-blur-sm border border-[#FED700]/50 text-[#FED700] text-[11px] font-semibold shadow-md">
              <Trophy className="h-3 w-3" />
              <span>Top 10 Finalist</span>
            </div>
          )}

          {thumbUrl ? (
            <img
              src={thumbUrl}
              alt={submission.project_name || "Thumbnail Karya"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#AAB1BD] p-4 bg-gradient-to-br from-[#1E2939]/40 to-[#0F131E]/60 group-hover:bg-[#1E2939]/60 transition-colors">
              <ImageIcon className="w-10 h-10 text-[#FED700]/50 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-[#99A1AF] font-medium text-center line-clamp-1">
                {submission.project_name}
              </span>
            </div>
          )}
        </div>

        {/* Header & Category */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-3">
            <h3
              className={cn(
                "text-lg font-bold text-[#FFF9F5] transition-colors line-clamp-2",
                isFinalist
                  ? "group-hover:text-[#FED700]"
                  : "group-hover:text-[#E01C20]",
              )}
            >
              {submission.project_name}
            </h3>
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
            {isAllCategory && !isFinalist && (
              <Badge
                className={cn(
                  "scale-90 font-semibold",
                  getCategoryBadgeColor(submission.category),
                )}
              >
                {submission.category?.name}
              </Badge>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#AAB1BD] line-clamp-3 leading-relaxed">
          {submission.description || "Tidak ada deskripsi singkat."}
        </p>
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
        <div
          className={cn(
            "flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform",
            isFinalist ? "text-[#FED700]" : "text-[#E01C20]",
          )}
        >
          <span>Detail</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
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
  const searchParams = useSearchParams();

  const defaultCategoryId = searchParams?.get("category_id") || "all";
  const defaultSearch = searchParams?.get("search") || "";
  const defaultPage = Number(searchParams?.get("page")) || 1;

  const [selectedCategoryId, setSelectedCategoryId] =
    useState(defaultCategoryId);
  const [searchInput, setSearchInput] = useState(defaultSearch);
  const [appliedSearch, setAppliedSearch] = useState(defaultSearch);
  const [page, setPage] = useState(defaultPage);
  const limit = 21;
  const phase = "FINAL";
  const router = useRouter();

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const isAllCategory = selectedCategoryId === "all";
  const selectedCategorySlug = isAllCategory
    ? "seluruh kategori"
    : categories?.find((c) => c.category_id === selectedCategoryId)?.slug;

  const {
    data: finalistsData,
    isLoading: finalistsLoading,
    isError: isFinalistsError,
  } = useAllSubmissions(selectedCategoryId, appliedSearch, null, 1, 50, phase, "true");

  const {
    data: submissionsData,
    isLoading: submissionsLoading,
    isError: isRegularError,
  } = useAllSubmissions(selectedCategoryId, appliedSearch, null, page, limit, phase, "false");

  const isLoadingAny = finalistsLoading || submissionsLoading;
  const isError = isFinalistsError || isRegularError;

  // Filter hanya submission yang berstatus APPROVED dan diizinkan tampil di Show It
  const finalistSubmissions = useMemo(() => {
    const raw = finalistsData?.submissions || [];
    return raw.filter(
      (submission) =>
        submission.status === "APPROVED" &&
        Boolean(submission.is_verified) &&
        Boolean(submission.is_finalist),
    );
  }, [finalistsData?.submissions]);

  // Kelompokkan Top 10 Finalist per kategori (terpisah UIA & WIA saat Semua Kategori)
  const finalistSections = useMemo(() => {
    const grouped = new Map();

    for (const submission of finalistSubmissions) {
      const catMeta = getFinalistCategoryMeta(submission.category);
      if (!grouped.has(catMeta.key)) {
        grouped.set(catMeta.key, {
          ...catMeta,
          items: [],
        });
      }
      grouped.get(catMeta.key).items.push(submission);
    }

    return Array.from(grouped.values()).sort((a, b) => a.order - b.order);
  }, [finalistSubmissions]);

  const allRegularSubmissions = submissionsData?.submissions || [];
  const filteredSubmissions = allRegularSubmissions.filter(
    (submission) =>
      submission.status === "APPROVED" &&
      Boolean(submission.is_verified) &&
      !submission.is_finalist,
  );

  const isSearching = Boolean(appliedSearch.trim());
  const hasAnySubmissions =
    finalistSubmissions.length > 0 || filteredSubmissions.length > 0;
  const showFinalistSections = page === 1 && finalistSections.length > 0;
  const meta = submissionsData?.meta || {
    total: filteredSubmissions.length,
    page,
    limit,
    totalPages: 1,
  };

  useEffect(() => {
    router.replace(
      `/show-it?${createQueryString({
        category_id: selectedCategoryId,
        page: page.toString(),
        search: appliedSearch,
      })}`,
      { scroll: false },
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [router, selectedCategoryId, page, appliedSearch]);

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
    setPage(1);
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    setAppliedSearch(searchInput.trim());
    setPage(1);
  };

  const handleResetSearch = () => {
    setSearchInput("");
    setAppliedSearch("");
    setPage(1);
  };

  const handleSubmissionClick = (submissionId) => {
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
        {isLoadingAny && !submissionsData && !finalistsData && selectedCategoryId && (
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
        {!hasAnySubmissions &&
          !isSearching &&
          selectedCategoryId &&
          !isLoadingAny &&
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
        {isSearching &&
          !hasAnySubmissions &&
          selectedCategoryId &&
          !isLoadingAny &&
          !isError && (
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

        {/* Top 10 Finalist Sections (dipisah per kategori: UIA & WIA) */}
        {showFinalistSections &&
          finalistSections.map((section) => (
            <section key={section.key} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FED700]/25 pb-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FED700]/15 border border-[#FED700]/35 flex items-center justify-center text-[#FED700] flex-shrink-0">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-[#FFF9F5]">
                        Daftar 10 Karya Finalis{" "}
                        <span className="text-[#FED700]">{section.shortLabel}</span>
                      </h2>
                      <Badge className={cn("font-semibold", section.badgeClass)}>
                        {section.fullName}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-[#AAB1BD] mt-0.5">
                      {isSearching
                        ? `Menampilkan karya finalis ${section.shortLabel} untuk pencarian "${appliedSearch}"`
                        : `Karya terbaik kategori ${section.fullName} yang lolos ke tahap Top 10 Finalis`}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#FED700] bg-[#FED700]/10 border border-[#FED700]/30 px-3 py-1.5 rounded-full w-fit font-medium">
                  {section.items.length} Karya Finalis
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((submission) => (
                  <SubmissionCard
                    key={submission.submission_id}
                    submission={submission}
                    isAllCategory={isAllCategory}
                    isFinalist={true}
                    onClick={handleSubmissionClick}
                  />
                ))}
              </div>
            </section>
          ))}

        {/* Regular Submissions Grid (Karya Peserta Non-Finalist) */}
        {filteredSubmissions.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#FFF9F5]">
                  Daftar Karya Peserta
                </h2>
                <p className="text-xs sm:text-sm text-[#AAB1BD]">
                  {isSearching
                    ? `Menampilkan karya peserta untuk pencarian "${appliedSearch}" dari ${selectedCategoryId === "all" ? "semua kategori" : `kategori ${selectedCategorySlug}`}`
                    : finalistSubmissions.length > 0
                      ? `Menampilkan karya peserta lainnya dari ${selectedCategoryId === "all" ? "semua kategori" : `kategori ${selectedCategorySlug}`}`
                      : `Menampilkan semua karya inovatif dari ${selectedCategoryId === "all" ? "semua kategori" : `kategori ${selectedCategorySlug}`}`}
                </p>
              </div>
              <span className="text-xs text-[#AAB1BD] bg-[#1E2939] border border-white/10 px-3 py-1.5 rounded-full w-fit">
                Klik karya untuk melihat detail & media
              </span>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubmissions.map((submission) => (
                <SubmissionCard
                  key={submission.submission_id}
                  submission={submission}
                  isAllCategory={isAllCategory}
                  isFinalist={false}
                  onClick={handleSubmissionClick}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {meta.totalPages > 1 && (
              <div className="mia-card p-3 sm:p-4 flex items-center justify-between gap-4 max-w-md mx-auto mt-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full cursor-pointer hover:bg-white/10 text-xs px-4 text-[#FFF9F5]"
                  disabled={page <= 1}
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                  }}
                >
                  Sebelumnya
                </Button>
                <span className="text-xs text-[#AAB1BD] font-medium">
                  Halaman{" "}
                  <strong className="text-[#FFF9F5]">{meta.page}</strong>{" "}
                  dari{" "}
                  <strong className="text-[#FFF9F5]">
                    {meta.totalPages}
                  </strong>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full cursor-pointer hover:bg-white/10 text-xs px-4 text-[#FFF9F5]"
                  disabled={page >= meta.totalPages}
                  onClick={() => {
                    setPage((p) => Math.min(meta.totalPages, p + 1));
                  }}
                >
                  Berikutnya
                </Button>
              </div>
            )}
          </section>
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
