"use client";

import { useState } from "react";
import { useLeaderboardByCategory, useCategories } from "@/hooks/user-use-gamifikasi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Medal, Award, Star, Users, Calendar, AlertCircle, Crown, Target, Timer } from "lucide-react";

export default function LeaderboardPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: leaderboardData, isLoading: leaderboardLoading, isError } = useLeaderboardByCategory(selectedCategoryId);

  const selectedCategory = categories?.find(cat => cat.category_id === selectedCategoryId);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 md:h-7 md:w-7 text-yellow-500 drop-shadow-sm" />;
      case 2:
        return <Medal className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />;
      default:
        return (
          <div className="h-6 w-6 md:h-8 md:w-8 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full text-xs md:text-sm font-bold text-gray-600 dark:text-gray-300 shadow-sm">
            {rank}
          </div>
        );
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white shadow-lg border-0";
      case 2:
        return "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 text-white shadow-md border-0";
      case 3:
        return "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-white shadow-md border-0";
      default:
        return "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700";
    }
  };

  const getPodiumCardStyle = (rank) => {
    const heights = {
      1: "h-48 md:h-64", // Responsive height for 1st place
      2: "h-40 md:h-48", // Responsive height for 2nd place  
      3: "h-36 md:h-40"  // Responsive height for 3rd place
    };
    
    const gradients = {
      1: "bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100 dark:from-yellow-900/30 dark:via-amber-900/30 dark:to-orange-900/30",
      2: "bg-gradient-to-br from-gray-100 via-slate-50 to-zinc-100 dark:from-gray-800/50 dark:via-slate-800/50 dark:to-zinc-800/50", 
      3: "bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 dark:from-amber-900/30 dark:via-orange-900/30 dark:to-yellow-900/30"
    };

    const borders = {
      1: 'border-yellow-300 dark:border-yellow-600',
      2: 'border-gray-300 dark:border-gray-600',
      3: 'border-amber-300 dark:border-amber-600'
    };

    return `${heights[rank]} ${gradients[rank]} border-2 ${borders[rank]} shadow-xl`;
  };

  const topThree = leaderboardData?.slice(0, 3) || [];
  const remaining = leaderboardData?.slice(3) || [];

  return (
    <>
      <DashboardHeader />   
      <main className="min-h-screen pt-20 bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-gray-900 dark:to-indigo-900 text-gray-900 dark:text-white">
        <div className="container mx-auto py-6 md:py-8 px-4 max-w-7xl">
          <div className="space-y-6 md:space-y-8">
            {/* Enhanced Header */}
            <div className="text-center space-y-3 md:space-y-4 py-6 md:py-8">
              <div className="flex items-center justify-center gap-2 md:gap-3 mb-4">
                <div className="p-2 md:p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl md:rounded-2xl shadow-lg">
                  <Trophy className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Leaderboard Kompetisi
                </h1>
              </div>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
                Lihat peringkat terbaik dari setiap kategori kompetisi dan raih posisi teratas!
              </p>
            </div>

            {/* Enhanced Category Selection */}
            <Card className="shadow-lg border-0 bg-white dark:bg-gray-800/80 dark:backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl text-gray-900 dark:text-white">
                  <div className="p-1.5 md:p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg">
                    <Target className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </div>
                  Pilih Kategori Kompetisi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <Select
                  value={selectedCategoryId}
                  onValueChange={setSelectedCategoryId}
                  disabled={categoriesLoading}
                >
                  <SelectTrigger className="w-full h-10 md:h-12 bg-white dark:bg-gray-700 border-2 hover:border-blue-400 transition-colors text-gray-900 dark:text-white">
                    <SelectValue 
                      placeholder={categoriesLoading ? "Memuat kategori..." : "🏆 Pilih kategori kompetisi"} 
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    {categories?.map((category) => (
                      <SelectItem 
                        key={category.category_id} 
                        value={category.category_id} 
                        className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex flex-col py-1">
                          <span className="font-semibold text-gray-900 dark:text-white">{category.name}</span>
                          <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{category.category_name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedCategory && (
                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/50 dark:to-indigo-900/50 border-blue-200 dark:border-blue-400 shadow-md">
                    <CardContent className="p-4 md:p-6">
                      <div className="space-y-3 md:space-y-4">
                        <div className="flex items-start gap-2 md:gap-3">
                          <div className="p-1.5 md:p-2 bg-blue-500 rounded-lg">
                            <Star className="h-3 w-3 md:h-4 md:w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg md:text-xl font-bold text-blue-900 dark:text-blue-100 mb-1 md:mb-2">
                              {selectedCategory.name}
                            </h3>
                            <p className="text-sm md:text-base text-blue-800 dark:text-blue-200 leading-relaxed">
                              {selectedCategory.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-4 pt-2">
                          <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-blue-200/50 dark:bg-blue-800/50 rounded-full">
                            <Calendar className="h-3 w-3 md:h-4 md:w-4 text-blue-600 dark:text-blue-300" />
                            <span className="text-xs md:text-sm font-medium text-blue-800 dark:text-blue-200">
                              Berakhir: {new Date(selectedCategory.deadline).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-blue-200/50 dark:bg-blue-800/50 rounded-full">
                            <Users className="h-3 w-3 md:h-4 md:w-4 text-blue-600 dark:text-blue-300" />
                            <span className="text-xs md:text-sm font-medium text-blue-800 dark:text-blue-200">
                              Tim: {selectedCategory.team_type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* Loading State */}
            {leaderboardLoading && selectedCategoryId && (
              <div className="text-center py-6 md:py-8">
                <div className="inline-flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-b-2 border-blue-400"></div>
                  <span className="text-base md:text-lg">Memuat data leaderboard...</span>
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
                      Tidak dapat memuat data leaderboard. Silakan coba lagi dalam beberapa saat.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {leaderboardData && leaderboardData.length === 0 && selectedCategoryId && (
              <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/30">
                <CardContent className="flex flex-col items-center justify-center py-12 md:py-16">
                  <div className="p-3 md:p-4 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 md:mb-6">
                    <Trophy className="h-12 w-12 md:h-16 md:w-16 text-gray-400" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">
                    Belum Ada Peserta
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 text-center max-w-md px-4">
                    Belum ada peserta yang terdaftar atau dinilai untuk kategori ini. Jadilah yang pertama!
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Podium Display for Top 3 */}
            {topThree.length > 0 && (
              <div className="space-y-6 md:space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">🏆 Hall of Fame</h2>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">Para juara terbaik dalam kategori ini</p>
                </div>

                {/* Podium Layout - Stack on mobile, side-by-side on desktop */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-center gap-4 px-2 md:px-4">
                  {/* 1st Place - Always first on mobile */}
                  <div className="order-1 md:order-2">
                    <Card className={getPodiumCardStyle(1)}>
                      <CardContent className="p-4 md:p-6 h-full flex flex-col justify-center items-center text-center">
                        <div className="space-y-2 md:space-y-4">
                          <div className="flex flex-col items-center gap-2 md:gap-3">
                            {getRankIcon(1)}
                            <Badge className={`text-xs md:text-sm px-2 md:px-3 py-1 font-semibold ${getRankBadgeColor(1)}`}>
                              #1
                            </Badge>
                          </div>
                          <div>
                            <h3 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2 break-words">
                              {topThree[0].team_name}
                            </h3>
                            <div className="flex items-center justify-center gap-1 md:gap-2">
                              <Star className="h-4 w-4 md:h-6 md:w-6 text-orange-500" />
                              <span className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                {topThree[0].score}
                              </span>
                            </div>
                            <Badge className="mt-1 md:mt-2 bg-yellow-500 text-yellow-900 px-2 md:px-3 py-1 text-xs md:text-sm">
                              👑 CHAMPION
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 2nd Place */}
                  {topThree[1] && (
                    <div className="order-2 md:order-1">
                      <Card className={getPodiumCardStyle(2)}>
                        <CardContent className="p-4 md:p-6 h-full flex flex-col justify-center items-center text-center">
                          <div className="space-y-2 md:space-y-3">
                            <div className="flex flex-col items-center gap-1 md:gap-2">
                              {getRankIcon(2)}
                              <Badge className={`text-xs md:text-sm px-2 md:px-3 py-1 font-semibold ${getRankBadgeColor(2)}`}>
                                #2
                              </Badge>
                            </div>
                            <div>
                              <h3 className="text-base md:text-xl font-bold text-gray-900 dark:text-white mb-1 break-words">
                                {topThree[1].team_name}
                              </h3>
                              <div className="flex items-center justify-center gap-1">
                                <Star className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
                                <span className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                                  {topThree[1].score}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {topThree[2] && (
                    <div className="order-3">
                      <Card className={getPodiumCardStyle(3)}>
                        <CardContent className="p-4 md:p-6 h-full flex flex-col justify-center items-center text-center">
                          <div className="space-y-2 md:space-y-3">
                            <div className="flex flex-col items-center gap-1 md:gap-2">
                              {getRankIcon(3)}
                              <Badge className={`text-xs md:text-sm px-2 md:px-3 py-1 font-semibold ${getRankBadgeColor(3)}`}>
                                #3
                              </Badge>
                            </div>
                            <div>
                              <h3 className="text-base md:text-xl font-bold text-gray-900 dark:text-white mb-1 break-words">
                                {topThree[2].team_name}
                              </h3>
                              <div className="flex items-center justify-center gap-1">
                                <Star className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
                                <span className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                                  {topThree[2].score}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Remaining Participants Table */}
            {remaining.length > 0 && (
              <div className="space-y-4 md:space-y-6">
                <div className="text-center">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">Peringkat Lainnya</h3>
                  <Badge variant="outline" className="text-sm md:text-base px-3 md:px-4 py-1 md:py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                    {remaining.length} peserta lainnya
                  </Badge>
                </div>

                <Card className="bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 shadow-xl">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      {/* Desktop Table Header */}
                      <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <div className="col-span-1 text-center">Peringkat</div>
                        <div className="col-span-6">Tim</div>
                        <div className="col-span-3 text-center">Poin</div>
                        <div className="col-span-2 text-center">Status</div>
                      </div>

                      {/* Table Rows */}
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {remaining.map((item, index) => {
                          const rank = index + 4;
                          return (
                            <div 
                              key={item.submission_id}
                              className="p-3 md:p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150"
                            >
                              {/* Mobile Layout */}
                              <div className="md:hidden space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    {getRankIcon(rank)}
                                    <div>
                                      <h4 className="font-semibold text-gray-900 dark:text-white text-base">
                                        {item.team_name}
                                      </h4>
                                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        oleh {item.user.name}
                                      </p>
                                    </div>
                                  </div>
                                  <Badge className={`text-xs px-2 py-1 ${getRankBadgeColor(rank)}`}>
                                    #{rank}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 text-orange-500" />
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                      {item.score}
                                    </span>
                                  </div>
                                  <Badge 
                                    variant={item.status === 'APPROVED' ? 'default' : 'secondary'}
                                    className={`${item.status === 'APPROVED' 
                                      ? 'bg-green-600 text-white border-green-500' 
                                      : 'bg-gray-600 text-gray-200 border-gray-500'
                                    } px-2 py-1 text-xs`}
                                  >
                                    {item.status === 'APPROVED' ? '✓ Disetujui' : item.status}
                                  </Badge>
                                </div>
                              </div>

                              {/* Desktop Layout */}
                              <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                                <div className="col-span-1 flex justify-center">
                                  <div className="flex flex-col items-center gap-2">
                                    {getRankIcon(rank)}
                                    <Badge className={`text-xs px-2 py-1 ${getRankBadgeColor(rank)}`}>
                                      #{rank}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="col-span-6 flex items-center">
                                  <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                                      {item.team_name}
                                    </h4>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                      oleh {item.user.name}
                                    </p>
                                  </div>
                                </div>

                                <div className="col-span-3 flex items-center justify-center">
                                  <div className="flex items-center gap-2">
                                    <Star className="h-5 w-5 text-orange-500" />
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                      {item.score}
                                    </span>
                                  </div>
                                </div>

                                <div className="col-span-2 flex items-center justify-center">
                                  <Badge 
                                    variant={item.status === 'APPROVED' ? 'default' : 'secondary'}
                                    className={`${item.status === 'APPROVED' 
                                      ? 'bg-green-600 text-white border-green-500' 
                                      : 'bg-gray-600 text-gray-200 border-gray-500'
                                    } px-3 py-1`}
                                  >
                                    {item.status === 'APPROVED' ? '✓ Disetujui' : item.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Call to Action */}
            {!selectedCategoryId && (
              <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/50 dark:to-indigo-900/50 border-purple-200 dark:border-purple-400 shadow-xl">
                <CardContent className="text-center py-12 md:py-16 px-4">
                  <div className="p-3 md:p-4 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl md:rounded-2xl w-fit mx-auto mb-4 md:mb-6">
                    <Trophy className="h-12 w-12 md:h-16 md:w-16 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                    Pilih Kategori untuk Melihat Leaderboard
                  </h3>
                  <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                    Lihat siapa yang memimpin di setiap kategori kompetisi dan raih kesempatan untuk menjadi yang terdepan!
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