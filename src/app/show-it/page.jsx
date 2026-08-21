"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAllSubmissions } from "@/hooks/user-use-submissions";
import { useCategories } from "@/hooks/user-use-gamifikasi";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import Footer from "@/components/layout/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Users,
  Calendar,
  AlertCircle,
  Target,
  Star,
  Github,
  Youtube,
  ExternalLink,
  User,
  Lightbulb,
  Grid3X3,
  ArrowRight,
} from "lucide-react";

export default function ShowItPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const router = useRouter();

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const {
    data: submissionsData,
    isLoading: submissionsLoading,
    isError,
  } = useAllSubmissions(selectedCategoryId);

  const selectedCategory = categories?.find(
    (cat) => cat.category_id === selectedCategoryId
  );

  // Filter hanya submission yang berstatus APPROVED
  const allSubmissions = submissionsData?.submissions || [];
  const submissions = allSubmissions.filter(
    (submission) => submission.status === "APPROVED"
  );

  const getStatusBadge = (status) => {
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
  };

  const getLinkIcon = (linkType) => {
    switch (linkType?.toUpperCase()) {
      case "GITHUB":
        return <Github className="h-3.5 w-3.5" />;
      case "YOUTUBE":
        return <Youtube className="h-3.5 w-3.5" />;
      default:
        return <ExternalLink className="h-3.5 w-3.5" />;
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handleSubmissionClick = (submissionId) => {
    router.push(`/show-it/${submissionId}`);
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] mia-connected-bg text-[#FFF9F5] flex flex-col justify-between selection:bg-[#E01C20] selection:text-white">
      <div>
        <DashboardHeader />

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
                Jelajahi dan temukan inspirasi dari karya-karya inovatif dan kreatif
                peserta kompetisi Multimedia in Action 2025!
              </p>
            </div>

            {/* Category Selection Card */}
            <div className="mia-card p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E01C20]/15 border border-[#E01C20]/30 flex items-center justify-center text-[#E01C20] flex-shrink-0">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-[#FFF9F5]">
                    Pilih Kategori Lomba
                  </h2>
                  <p className="text-xs md:text-sm text-[#AAB1BD]">
                    Pilih kategori untuk melihat karya yang telah dikumpulkan
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Select
                  value={selectedCategoryId}
                  onValueChange={handleCategoryChange}
                  disabled={categoriesLoading}
                >
                  <SelectTrigger className="w-full h-12 bg-[#141824] border border-white/15 hover:border-[#E01C20]/60 rounded-xl text-[#FFF9F5] focus:ring-[#E01C20] transition-colors cursor-pointer">
                    <SelectValue
                      placeholder={
                        categoriesLoading
                          ? "Memuat kategori..."
                          : "💡 Pilih kategori lomba..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141824] border border-white/15 text-[#FFF9F5] rounded-xl shadow-2xl">
                    {categories?.map((category) => (
                      <SelectItem
                        key={category.category_id}
                        value={category.category_id}
                        className="flex flex-col items-start py-2.5 px-3.5 gap-1 text-left text-[#FFF9F5] hover:bg-[#E01C20]/20 focus:bg-[#E01C20]/20 rounded-lg cursor-pointer transition-colors"
                      >
                        <span className="font-semibold text-sm md:text-base">
                          {category.name}
                        </span>
                        <span className="text-xs text-[#AAB1BD]">
                          {category.category_name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedCategory && (
                  <div className="bg-[#1E2939]/40 border border-white/10 rounded-xl p-4 md:p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#E01C20]/20 border border-[#E01C20]/30 rounded-lg text-[#E01C20] flex-shrink-0">
                        <Star className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-lg font-bold text-[#FFF9F5] mb-1">
                          {selectedCategory.name}
                        </h3>
                        <p className="text-xs md:text-sm text-[#AAB1BD] leading-relaxed">
                          {selectedCategory.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 md:gap-3 pt-2">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1E2939] border border-white/10 rounded-full text-xs md:text-sm text-[#AAB1BD]">
                        <Calendar className="h-3.5 w-3.5 text-[#E01C20]" />
                        <span>
                          Deadline:{" "}
                          <strong className="text-[#FFF9F5]">
                            {new Date(selectedCategory.deadline).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1E2939] border border-white/10 rounded-full text-xs md:text-sm text-[#AAB1BD]">
                        <Users className="h-3.5 w-3.5 text-[#FED700]" />
                        <span>
                          Tipe Tim: <strong className="text-[#FFF9F5]">{selectedCategory.team_type}</strong>
                        </span>
                      </div>

                      {submissions.length > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1E2939] border border-white/10 rounded-full text-xs md:text-sm text-[#AAB1BD]">
                          <Grid3X3 className="h-3.5 w-3.5 text-[#00B445]" />
                          <span>
                            <strong className="text-[#FFF9F5]">{submissions.length}</strong> Karya Disetujui
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Loading State */}
            {submissionsLoading && selectedCategoryId && (
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
                    Tidak dapat memuat karya untuk kategori ini. Silakan coba beberapa saat lagi.
                  </p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {submissions.length === 0 && selectedCategoryId && !submissionsLoading && !isError && (
              <div className="mia-card p-8 md:p-14 text-center space-y-4 border-dashed border-white/15">
                <div className="w-14 h-14 bg-[#E01C20]/15 border border-[#E01C20]/30 text-[#E01C20] rounded-2xl flex items-center justify-center mx-auto">
                  <Lightbulb className="h-7 w-7" />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="text-xl font-bold text-[#FFF9F5]">
                    Belum Ada Karya
                  </h3>
                  <p className="text-sm text-[#AAB1BD]">
                    Belum ada karya yang disetujui untuk kategori ini. Jadilah yang pertama mengirimkan karya terbaikmu!
                  </p>
                </div>
              </div>
            )}

            {/* Submissions Grid */}
            {submissions.length > 0 && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#FFF9F5]">
                      Daftar Karya Peserta
                    </h2>
                    <p className="text-xs sm:text-sm text-[#AAB1BD]">
                      Menampilkan {submissions.length} karya inovatif dalam kategori ini
                    </p>
                  </div>
                  <span className="text-xs text-[#AAB1BD] bg-[#1E2939] border border-white/10 px-3 py-1.5 rounded-full w-fit">
                    Klik karya untuk melihat detail & media
                  </span>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {submissions.map((submission) => (
                    <div
                      key={submission.submission_id}
                      onClick={() => handleSubmissionClick(submission.submission_id)}
                      className="mia-card p-6 flex flex-col justify-between hover:border-[#E01C20]/60 hover:shadow-[0_0_30px_rgba(224,28,32,0.15)] transition-all duration-300 group cursor-pointer"
                    >
                      <div className="space-y-4">
                        {/* Header & Status */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-[#FFF9F5] group-hover:text-[#E01C20] transition-colors line-clamp-2">
                              {submission.project_name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-[#AAB1BD] mt-1.5">
                              <Users className="h-3.5 w-3.5 text-[#FED700]" />
                              <span className="truncate font-medium">{submission.team_name}</span>
                            </div>
                          </div>
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${getStatusBadge(
                              submission.status
                            )}`}
                          >
                            {submission.status === "APPROVED"
                              ? "✓ Disetujui"
                              : submission.status}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-[#AAB1BD] line-clamp-3 leading-relaxed">
                          {submission.description || "Tidak ada deskripsi singkat."}
                        </p>

                        {/* Score (If Available) */}
                        {submission.score && submission.score > 0 && (
                          <div className="flex items-center gap-2 p-2 bg-[#FED700]/10 border border-[#FED700]/20 rounded-lg w-fit">
                            <Star className="h-4 w-4 text-[#FED700] fill-[#FED700]" />
                            <span className="text-xs font-bold text-[#FED700]">
                              Skor: {submission.score}
                            </span>
                          </div>
                        )}

                        {/* Project Links */}
                        {submission.links && submission.links.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[11px] uppercase tracking-wider text-[#99A1AF] font-semibold">
                              Tautan Karya:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {submission.links.slice(0, 3).map((link) => (
                                <a
                                  key={link.link_id}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1E2939] hover:bg-[#E01C20]/20 border border-white/10 hover:border-[#E01C20]/40 rounded-md text-xs text-[#FFF9F5] transition-colors"
                                >
                                  {getLinkIcon(link.link_type)}
                                  <span className="capitalize">{link.link_type?.toLowerCase()}</span>
                                </a>
                              ))}
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
                          <span className="truncate">{submission.user?.name || "Peserta"}</span>
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
                    Pilih salah satu kategori lomba di atas untuk melihat karya-karya terbaik yang telah dipublikasikan oleh para peserta.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

