"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { useAllSubmissions } from "@/hooks/user-use-submissions";
import { useCategories } from "@/hooks/user-use-gamifikasi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
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
  MousePointer, // Icon untuk indikator clickable
} from "lucide-react";

export default function ThinkItPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const router = useRouter(); // Initialize router

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
  const meta = submissionsData?.meta || {};

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-600 text-white border-green-500";
      case "PENDING":
        return "bg-yellow-600 text-white border-yellow-500";
      case "REJECTED":
        return "bg-red-600 text-white border-red-500";
      default:
        return "bg-gray-600 text-white border-gray-500";
    }
  };

  const getLinkIcon = (linkType) => {
    switch (linkType) {
      case "GITHUB":
        return <Github className="h-4 w-4" />;
      case "YOUTUBE":
        return <Youtube className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  // Function untuk navigate ke detail submission
  const handleSubmissionClick = (submissionId) => {
    router.push(`/show-it/${submissionId}`);
  };

  return (
    <>
      <DashboardHeader />
      <main className="min-h-screen pt-20 bg-gray-50 dark:bg-gradient-to-r dark:from-red-900 dark:via-black dark:to-black  text-gray-900 dark:text-white">
        <div className="container mx-auto py-6 md:py-8 px-4 max-w-7xl">
          <div className="space-y-6 md:space-y-8">
            {/* Enhanced Header */}
            <div className="text-center space-y-3 md:space-y-4 py-6 md:py-8">
              <div className="flex items-center justify-center gap-2 md:gap-3 mb-4">
                <div className="p-2 md:p-3 bg-red-600 rounded-xl md:rounded-2xl shadow-lg">
                  <Lightbulb className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white bg-clip-text">
                  Show It -
                </h1>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-red-600 bg-clip-text">
                  Galeri Karya
                </h1>
              </div>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
                Jelajahi dan temukan inspirasi dari karya-karya luar biasa
                peserta kompetisi!
              </p>
            </div>

            {/* Enhanced Category Selection */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-900/50 border-orange-200 dark:backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl text-gray-900 dark:text-white">
                  <div className="p-1.5 md:p-2 bg-red-600 rounded-lg">
                    <Target className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </div>
                  Pilih Kategori Lomba
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <Select
                  value={selectedCategoryId}
                  onValueChange={handleCategoryChange}
                  disabled={categoriesLoading}
                >
                  <SelectTrigger className="w-full h-10 md:h-12 bg-white dark:from-gray-900 dark:to-gray-900/50 border-2 hover:border-orange-400 transition-colors text-gray-900 dark:text-white cursor-pointer">
                    <SelectValue
                      placeholder={
                        categoriesLoading
                          ? "Memuat kategori..."
                          : "💡 Pilih kategori lomba"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-900/50 border-orange-200 dark:border-orange-200">
                    {categories?.map((category) => (
                      <SelectItem
                        key={category.category_id}
                        value={category.category_id}
                        className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <div className="flex flex-row space-x-1 py-2 cursor-pointer">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {category.name}
                          </span>
                          <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                            {category.category_name}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedCategory && (
                  <Card className="dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-900/50 border-orange-200 dark:border-orange-200">
                    <CardContent className="p-4 md:p-6">
                      <div className="space-y-3 md:space-y-4">
                        <div className="flex items-start gap-2 md:gap-3">
                          <div className="p-1.5 md:p-2 bg-red-600 rounded-lg">
                            <Star className="h-3 w-3 md:h-4 md:w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-orange-100 mb-1 md:mb-2">
                              {selectedCategory.name}
                            </h3>
                            <p className="text-sm md:text-base text-gray-900 dark:text-orange-200 leading-relaxed">
                              {selectedCategory.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-4 pt-2">
                          <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-orange-200/50 dark:bg-orange-800/50 rounded-full">
                            <Calendar className="h-3 w-3 md:h-4 md:w-4 text-gray-900 dark:text-orange-300" />
                            <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-orange-200">
                              Berakhir:{" "}
                              {new Date(
                                selectedCategory.deadline
                              ).toLocaleDateString("id-ID")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-orange-200/50 dark:bg-orange-800/50 rounded-full">
                            <Users className="h-3 w-3 md:h-4 md:w-4 text-gray-900 dark:text-orange-300" />
                            <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-orange-200">
                              Tim: {selectedCategory.team_type}
                            </span>
                          </div>
                          {submissions.length > 0 && (
                            <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-orange-200/50 dark:bg-orange-800/50 rounded-full">
                              <Grid3X3 className="h-3 w-3 md:h-4 md:w-4 text-gray-900 dark:text-orange-300" />
                              <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-orange-200">
                                {submissions.length} Karya
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* Loading State */}
            {submissionsLoading && selectedCategoryId && (
              <div className="text-center py-6 md:py-8">
                <div className="inline-flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-b-2 border-orange-400"></div>
                  <span className="text-base md:text-lg">Memuat karya...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {isError && selectedCategoryId && (
              <Card className="border-red-400 bg-red-50 dark:bg-red-900/20 shadow-lg">
                <CardContent className="flex items-center gap-3 md:gap-4 p-6 md:p-8">
                  <div className="p-2 md:p-3 bg-red-500 rounded-full flex-shrink-0">
                    <AlertCircle className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-800 dark:text-red-200 mb-1">
                      Gagal Memuat Data
                    </h3>
                    <p className="text-sm md:text-base text-red-700 dark:text-red-300">
                      Tidak dapat memuat karya. Silakan coba lagi dalam beberapa
                      saat.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {submissions.length === 0 &&
              selectedCategoryId &&
              !submissionsLoading && (
                <Card className="border-2 border-dashed bg-gradient-to-r dark:from-gray-900 dark:to-gray-900/50 border-orange-200">
                  <CardContent className="flex flex-col items-center justify-center py-12 md:py-16">
                    <div className="p-3 md:p-4 bg-red-600 rounded-full mb-4 md:mb-6">
                      <Lightbulb className="h-12 w-12 md:h-16 md:w-16 text-white " />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">
                      Belum Ada Karya
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 text-center max-w-md px-4">
                      Belum ada karya yang dikumpulkan untuk kategori ini.
                      Jadilah yang pertama mengirimkan karya!
                    </p>
                  </CardContent>
                </Card>
              )}

            {/* Submissions Grid */}
            {submissions.length > 0 && (
              <div className="space-y-6 md:space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    💡 Karya-Karya Kreatif
                  </h2>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                    Menampilkan {submissions.length} karya dalam kategori ini
                  </p>
                  {/* Hint untuk user bahwa card bisa diklik */}
                  <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <MousePointer className="h-3 w-3" />
                    <span>Klik pada karya untuk melihat detail lengkap</span>
                  </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {submissions.map((submission) => (
                    <Card
                      key={submission.submission_id}
                      onClick={() =>
                        handleSubmissionClick(submission.submission_id)
                      }
                      className="g-gradient-to-br from-gray-900 to-gray-900/50 dark:from-gray-900 dark:to-gray-900/50 border-orange-200 dark:border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                    >
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Header dengan indikator clickable */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                  {submission.project_name}
                                </h3>
                                <Eye className="h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100" />
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <User className="h-4 w-4" />
                                <span>{submission.team_name}</span>
                              </div>
                            </div>
                            <Badge
                              className={`${getStatusBadge(
                                submission.status
                              )} text-xs flex-shrink-0`}
                            >
                              {submission.status === "APPROVED"
                                ? "✓ Disetujui"
                                : submission.status === "PENDING"
                                ? "⏳ Pending"
                                : submission.status === "REJECTED"
                                ? "✗ Ditolak"
                                : submission.status}
                            </Badge>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                            {submission.description}
                          </p>

                          {/* Score */}
                          {submission.score && submission.score > 0 && (
                            <div className="flex items-center gap-2 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                                Skor: {submission.score}
                              </span>
                            </div>
                          )}

                          {/* Links */}
                          {submission.links && submission.links.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                Links:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {submission.links.slice(0, 3).map((link) => (
                                  <Button
                                    key={link.link_id}
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="text-xs h-7"
                                    onClick={(e) => e.stopPropagation()} // Prevent card click when clicking link
                                  >
                                    <a
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1"
                                    >
                                      {getLinkIcon(link.link_type)}
                                      {link.link_type}
                                    </a>
                                  </Button>
                                ))}
                                {submission.links.length > 3 && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                                    +{submission.links.length - 3} lainnya
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Footer */}
                          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>oleh {submission.user.name}</span>
                              <span>
                                {new Date(
                                  submission.created_at
                                ).toLocaleDateString("id-ID")}
                              </span>
                            </div>
                          </div>

                          {/* Clickable indicator */}
                          <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                              Klik untuk melihat detail →
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action */}
            {!selectedCategoryId && (
              <Card className="bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-900/50 border-orange-200 shadow-xl">
                <CardContent className="text-center py-12 md:py-16 px-4">
                  <div className="p-3 md:p-4 bg-red-600 rounded-xl md:rounded-2xl w-fit mx-auto mb-4 md:mb-6">
                    <Lightbulb className="h-12 w-12 md:h-16 md:w-16 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                    Pilih Kategori untuk Melihat Karya
                  </h3>
                  <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                    Temukan inspirasi dari karya-karya kreatif peserta kompetisi
                    dan lihat apa yang bisa Anda ciptakan!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
