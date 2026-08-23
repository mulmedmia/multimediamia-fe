"use client";

import { useState } from "react";
import {
  useLeaderboardByCategory,
  useCategories,
} from "@/hooks/user-use-gamifikasi";
import { Badge } from "@/components/ui/badge";
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
  Trophy,
  Medal,
  Award,
  Star,
  Users,
  Calendar,
  AlertCircle,
  Crown,
  Target,
  Sparkles,
} from "lucide-react";

export default function LeaderboardPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const {
    data: leaderboardData,
    isLoading: leaderboardLoading,
    isError,
  } = useLeaderboardByCategory(selectedCategoryId);

  const selectedCategory = categories?.find(
    (cat) => cat.category_id === selectedCategoryId
  );

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return (
          <Crown className="h-6 w-6 md:h-7 md:w-7 text-[#FED700] drop-shadow-[0_0_8px_rgba(254,215,0,0.5)]" />
        );
      case 2:
        return <Medal className="h-5 w-5 md:h-6 md:w-6 text-[#D5D8DE]" />;
      case 3:
        return <Award className="h-5 w-5 md:h-6 md:w-6 text-[#FF936B]" />;
      default:
        return (
          <div className="h-7 w-7 md:h-8 md:w-8 flex items-center justify-center bg-[#1E2939] border border-white/10 rounded-full text-xs md:text-sm font-bold text-[#AAB1BD]">
            {rank}
          </div>
        );
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-[#FED700] text-[#151C28] font-bold shadow-[0_0_12px_rgba(254,215,0,0.4)] border-0";
      case 2:
        return "bg-[#D5D8DE] text-[#151C28] font-bold border-0";
      case 3:
        return "bg-[#FF936B] text-[#151C28] font-bold border-0";
      default:
        return "bg-[#1E2939] text-[#AAB1BD] border border-white/10";
    }
  };

  const topThree = leaderboardData?.slice(0, 3) || [];
  const remaining = leaderboardData?.slice(3) || [];

  return (
    <div className="min-h-screen bg-[#0A0D14] mia-connected-bg text-[#FFF9F5] flex flex-col justify-between selection:bg-[#E01C20] selection:text-white">
      <div>
        <DashboardHeader />

        <main className="pt-24 sm:pt-28 pb-16 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-8 md:space-y-12">
            
            {/* Header Section */}
            <div className="text-center space-y-3 md:space-y-4 max-w-3xl mx-auto">
              <div className="mia-pill-badge mx-auto">
                <Trophy className="h-3.5 w-3.5 text-[#FED700]" />
                <span>Klasemen & Peringkat</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FFF9F5]">
                Leaderboard <span className="text-[#E01C20]">Kompetisi</span>
              </h1>
              
              <p className="text-sm sm:text-base md:text-lg text-[#AAB1BD] leading-relaxed">
                Lihat peringkat karya terbaik dari setiap kategori kompetisi MIA 2025 dan raih posisi teratas!
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
                    Pilih Kategori Kompetisi
                  </h2>
                  <p className="text-xs md:text-sm text-[#AAB1BD]">
                    Pilih salah satu kategori untuk memuat papan skor
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Select
                  value={selectedCategoryId}
                  onValueChange={setSelectedCategoryId}
                  disabled={categoriesLoading}
                >
                  <SelectTrigger className="w-full h-12 bg-[#141824] border border-white/15 hover:border-[#E01C20]/60 rounded-xl text-[#FFF9F5] focus:ring-[#E01C20] transition-colors cursor-pointer">
                    <SelectValue
                      placeholder={
                        categoriesLoading
                          ? "Memuat daftar kategori..."
                          : "🏆 Pilih kategori kompetisi..."
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

                {/* Selected Category Details */}
                {selectedCategory && (
                  <div className="bg-[#1E2939]/40 border border-white/10 rounded-xl p-5 md:p-6 space-y-4 backdrop-blur-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#E01C20]/20 border border-[#E01C20]/40 text-[#FFF9F5] text-xs font-semibold">
                          {selectedCategory.category_name}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-[#FFF9F5]">
                        {selectedCategory.name}
                      </h3>
                      <p className="text-sm text-[#AAB1BD] leading-relaxed">
                        {selectedCategory.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#141824] border border-white/10 rounded-full text-xs md:text-sm text-[#AAB1BD]">
                        <Calendar className="h-3.5 w-3.5 text-[#E01C20]" />
                        <span>
                          Batas Akhir:{" "}
                          <strong className="text-[#FFF9F5]">
                            {new Date(selectedCategory.deadline).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#141824] border border-white/10 rounded-full text-xs md:text-sm text-[#AAB1BD]">
                        <Users className="h-3.5 w-3.5 text-[#FED700]" />
                        <span>
                          Tipe Tim:{" "}
                          <strong className="text-[#FFF9F5]">
                            {selectedCategory.team_type}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Loading State */}
            {leaderboardLoading && selectedCategoryId && (
              <div className="mia-card p-12 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E01C20]/15 border border-[#E01C20]/30 animate-spin">
                  <div className="w-6 h-6 border-2 border-[#E01C20] border-t-transparent rounded-full"></div>
                </div>
                <p className="text-base text-[#AAB1BD]">
                  Memuat data leaderboard kategori...
                </p>
              </div>
            )}

            {/* Error State */}
            {isError && selectedCategoryId && (
              <div className="mia-card border-[#E01C20]/40 bg-[#E01C20]/10 p-6 md:p-8 flex items-start gap-4">
                <div className="p-2.5 bg-[#E01C20] rounded-xl text-white flex-shrink-0">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg text-[#FFF9F5] mb-1">
                    Gagal Memuat Data Leaderboard
                  </h3>
                  <p className="text-sm text-[#AAB1BD]">
                    Terjadi kendala saat mengambil data skor. Silakan periksa koneksi Anda dan coba lagi.
                  </p>
                </div>
              </div>
            )}

            {/* Empty State when Category Selected but no participants */}
            {leaderboardData &&
              leaderboardData.length === 0 &&
              selectedCategoryId && (
                <div className="mia-card border-dashed border-white/20 p-12 md:p-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#1E2939] border border-white/10 flex items-center justify-center mx-auto text-[#AAB1BD]">
                    <Trophy className="h-8 w-8 text-[#AAB1BD]" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#FFF9F5]">
                    Belum Ada Peserta Dinilai
                  </h3>
                  <p className="text-sm md:text-base text-[#AAB1BD] max-w-md mx-auto">
                    Belum ada karya yang terdaftar atau selesai dinilai untuk kategori ini. Jadilah yang pertama meraih posisi teratas!
                  </p>
                </div>
              )}

            {/* Top 3 Podium (Hall of Fame) */}
            {topThree.length > 0 && (
              <div className="space-y-6 md:space-y-8">
                <div className="text-center space-y-2">
                  <div className="mia-pill-badge mx-auto">
                    <Sparkles className="h-3.5 w-3.5 text-[#FED700]" />
                    <span>Top 3 Champions</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#FFF9F5]">
                    🏆 Hall of Fame
                  </h2>
                  <p className="text-sm md:text-base text-[#AAB1BD]">
                    Para peserta terbaik dengan perolehan skor tertinggi
                  </p>
                </div>

                {/* Podium Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-5xl mx-auto pt-4">
                  
                  {/* Rank 2 (Silver) - Positioned Left on Desktop */}
                  {topThree[1] ? (
                    <div className="order-2 md:order-1">
                      <div className="bg-gradient-to-b from-[#D5D8DE]/15 via-[#1E2939]/80 to-[#141824] border border-[#D5D8DE]/40 rounded-2xl p-6 text-center shadow-[0_0_25px_rgba(213,216,222,0.08)] backdrop-blur-md space-y-4 hover:border-[#D5D8DE]/80 transition-all">
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-3 rounded-full bg-[#1E2939] border border-[#D5D8DE]/30">
                            {getRankIcon(2)}
                          </div>
                          <Badge className={getRankBadgeColor(2)}>
                            Rank #2
                          </Badge>
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-lg md:text-xl font-bold text-[#FFF9F5] truncate">
                            {topThree[1].team_name}
                          </h3>
                          <p className="text-xs text-[#AAB1BD] truncate">
                            oleh {topThree[1].user?.name || "Peserta"}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-2">
                          <Star className="h-5 w-5 text-[#FF4500]" />
                          <span className="text-2xl font-bold text-[#FFF9F5]">
                            {topThree[1].score}
                          </span>
                          <span className="text-xs text-[#AAB1BD]">pts</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="hidden md:block order-2 md:order-1" />
                  )}

                  {/* Rank 1 (Gold / Champion) - Center & Taller */}
                  <div className="order-1 md:order-2">
                    <div className="bg-gradient-to-b from-[#FED700]/20 via-[#1E2939]/90 to-[#141824] border-2 border-[#FED700] rounded-2xl p-6 md:p-8 text-center shadow-[0_0_35px_rgba(254,215,0,0.25)] backdrop-blur-md space-y-4 relative md:-translate-y-4 transition-all">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FED700] text-[#151C28] text-xs font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                        👑 Champion
                      </div>

                      <div className="flex flex-col items-center gap-2 pt-2">
                        <div className="p-3.5 rounded-full bg-[#1E2939] border border-[#FED700]/50 shadow-[0_0_15px_rgba(254,215,0,0.3)]">
                          {getRankIcon(1)}
                        </div>
                        <Badge className={getRankBadgeColor(1)}>
                          Rank #1
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-xl md:text-2xl font-bold text-[#FFF9F5] truncate">
                          {topThree[0].team_name}
                        </h3>
                        <p className="text-xs md:text-sm text-[#AAB1BD] truncate">
                          oleh {topThree[0].user?.name || "Peserta"}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-2">
                        <Star className="h-6 w-6 text-[#FED700]" />
                        <span className="text-3xl font-extrabold text-[#FFF9F5]">
                          {topThree[0].score}
                        </span>
                        <span className="text-sm text-[#AAB1BD]">pts</span>
                      </div>
                    </div>
                  </div>

                  {/* Rank 3 (Bronze) - Positioned Right on Desktop */}
                  {topThree[2] ? (
                    <div className="order-3">
                      <div className="bg-gradient-to-b from-[#FF936B]/15 via-[#1E2939]/80 to-[#141824] border border-[#FF936B]/40 rounded-2xl p-6 text-center shadow-[0_0_25px_rgba(255,147,107,0.08)] backdrop-blur-md space-y-4 hover:border-[#FF936B]/80 transition-all">
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-3 rounded-full bg-[#1E2939] border border-[#FF936B]/30">
                            {getRankIcon(3)}
                          </div>
                          <Badge className={getRankBadgeColor(3)}>
                            Rank #3
                          </Badge>
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-lg md:text-xl font-bold text-[#FFF9F5] truncate">
                            {topThree[2].team_name}
                          </h3>
                          <p className="text-xs text-[#AAB1BD] truncate">
                            oleh {topThree[2].user?.name || "Peserta"}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-2">
                          <Star className="h-5 w-5 text-[#FF4500]" />
                          <span className="text-2xl font-bold text-[#FFF9F5]">
                            {topThree[2].score}
                          </span>
                          <span className="text-xs text-[#AAB1BD]">pts</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="hidden md:block order-3" />
                  )}
                </div>
              </div>
            )}

            {/* Remaining Participants (Rank 4+) */}
            {remaining.length > 0 && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-[#FFF9F5]">
                      Peringkat Lainnya
                    </h3>
                    <p className="text-xs md:text-sm text-[#AAB1BD]">
                      Daftar perolehan nilai peserta kompetisi
                    </p>
                  </div>
                  <div className="mia-pill-badge w-fit">
                    <span>{remaining.length} Peserta Lainnya</span>
                  </div>
                </div>

                <div className="mia-card overflow-hidden">
                  {/* Desktop Table Header */}
                  <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 bg-[#1E2939]/80 border-b border-white/10 text-xs font-semibold text-[#AAB1BD] uppercase tracking-wider">
                    <div className="col-span-2 text-center">Peringkat</div>
                    <div className="col-span-6">Tim & Peserta</div>
                    <div className="col-span-2 text-center">Perolehan Poin</div>
                    <div className="col-span-2 text-center">Status</div>
                  </div>

                  {/* Rows */}
                  <div className="divide-y divide-white/5">
                    {remaining.map((item, index) => {
                      const rank = index + 4;
                      return (
                        <div
                          key={item.submission_id || index}
                          className="p-4 sm:p-5 hover:bg-white/[0.03] transition-colors duration-150"
                        >
                          {/* Mobile View */}
                          <div className="md:hidden space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-3">
                                {getRankIcon(rank)}
                                <div>
                                  <h4 className="font-semibold text-base text-[#FFF9F5]">
                                    {item.team_name}
                                  </h4>
                                  <p className="text-xs text-[#AAB1BD]">
                                    oleh {item.user?.name || "Peserta"}
                                  </p>
                                </div>
                              </div>
                              <Badge className={getRankBadgeColor(rank)}>
                                #{rank}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                              <div className="flex items-center gap-1.5">
                                <Star className="h-4 w-4 text-[#FF4500]" />
                                <span className="text-lg font-bold text-[#FFF9F5]">
                                  {item.score}
                                </span>
                                <span className="text-xs text-[#AAB1BD]">pts</span>
                              </div>

                              <span className="px-2.5 py-0.5 rounded-full bg-[#00B445]/20 border border-[#00B445]/40 text-[#6BD493] text-xs font-medium">
                                {item.status === "APPROVED" ? "✓ Disetujui" : item.status}
                              </span>
                            </div>
                          </div>

                          {/* Desktop View */}
                          <div className="hidden md:grid md:grid-cols-12 gap-4 items-center px-2">
                            <div className="col-span-2 flex items-center justify-center gap-2">
                              {getRankIcon(rank)}
                              <Badge className={getRankBadgeColor(rank)}>
                                #{rank}
                              </Badge>
                            </div>

                            <div className="col-span-6">
                              <h4 className="font-semibold text-base text-[#FFF9F5]">
                                {item.team_name}
                              </h4>
                              <p className="text-xs text-[#AAB1BD]">
                                oleh {item.user?.name || "Peserta"}
                              </p>
                            </div>

                            <div className="col-span-2 flex items-center justify-center gap-1.5">
                              <Star className="h-4 w-4 text-[#FF4500]" />
                              <span className="text-xl font-bold text-[#FFF9F5]">
                                {item.score}
                              </span>
                              <span className="text-xs text-[#AAB1BD]">pts</span>
                            </div>

                            <div className="col-span-2 flex items-center justify-center">
                              <span className="px-3 py-1 rounded-full bg-[#00B445]/20 border border-[#00B445]/40 text-[#6BD493] text-xs font-medium">
                                {item.status === "APPROVED" ? "✓ Disetujui" : item.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Empty Selection CTA */}
            {!selectedCategoryId && (
              <div className="mia-card p-10 md:p-14 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#E01C20]/15 border border-[#E01C20]/30 flex items-center justify-center mx-auto text-[#E01C20]">
                  <Trophy className="h-8 w-8 text-[#E01C20]" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#FFF9F5]">
                  Pilih Kategori untuk Melihat Leaderboard
                </h3>
                <p className="text-sm md:text-base text-[#AAB1BD] max-w-md mx-auto">
                  Pilih salah satu kategori kompetisi pada dropdown di atas untuk melihat klasemen dan perolehan poin tim terbaik.
                </p>
              </div>
            )}

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
