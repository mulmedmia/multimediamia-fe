"use client";

import { useState } from "react";
import {
  useLeaderboardByCategory,
  useCategories,
} from "@/hooks/user-use-gamifikasi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
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
  AlertCircle,
  Target,
  Sparkles,
  Zap,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PodiumCard } from "@/components/leaderboard/PodiumCard";
import { getRankBadgeColor, RankIcon } from "@/components/leaderboard/RankIcon";

function LeaderboardSelectItem({ value = "", content = "" }) {
  return (
    <SelectItem
      value={value}
      className="flex flex-col items-start py-2.5 px-3.5 gap-1 text-left text-[#FFF9F5] hover:bg-[#E01C20]/20 focus:bg-[#E01C20]/20 rounded-lg cursor-pointer transition-colors"
    >
      <span className="font-semibold text-sm md:text-base">{content}</span>
    </SelectItem>
  );
}

export default function LeaderboardPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const {
    data: apiData,
    isLoading: leaderboardLoading,
    isFetching: leaderboardFetching,
    isError,
  } = useLeaderboardByCategory(selectedCategoryId, {
    page,
    limit,
    search: appliedSearch,
  });

  const leaderboardData = Array.isArray(apiData)
    ? apiData
    : apiData?.leaderboard || [];
  const meta = apiData?.meta || {
    total: leaderboardData.length,
    page: 1,
    limit,
    totalPages: 1,
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategoryId(catId);
    setSearchInput("");
    setAppliedSearch("");
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

  const isSearching = Boolean(appliedSearch.trim());

  // Client-side filtering as fallback/immediate filter for applied search
  const filteredLeaderboard = leaderboardData.filter((item) => {
    if (!isSearching) return true;
    const q = appliedSearch.toLowerCase().trim();
    return (
      item.team_name?.toLowerCase().includes(q) ||
      item.user?.name?.toLowerCase().includes(q)
    );
  });

  const isAllCategory = selectedCategoryId === "all";
  const topThree =
    page === 1 && isAllCategory && !isSearching
      ? leaderboardData.slice(0, 3)
      : [];
  const remaining =
    page === 1 && isAllCategory && !isSearching
      ? leaderboardData.slice(3)
      : filteredLeaderboard;

  return (
    <div className="min-h-screen bg-[#0A0D14] mia-connected-bg text-[#FFF9F5] flex flex-col justify-between selection:bg-[#E01C20] selection:text-white">
      <div>
        <Header />

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
                Lihat peringkat tim berdasarkan perolehan XP dan keaktifan misi
                dari setiap kategori kompetisi MIA 2026!
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
                    Pilih Kategori & Cari Tim
                  </h2>
                  <p className="text-xs md:text-sm text-[#AAB1BD]">
                    Pilih salah satu kategori untuk memuat papan skor dan
                    gunakan kotak pencarian untuk mencari nama tim atau peserta
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
                    modal={false}
                  >
                    <SelectTrigger className="w-full h-12! bg-[#141824] border border-white/15 hover:border-[#E01C20]/60 rounded-xl text-[#FFF9F5] focus:ring-[#E01C20] transition-colors cursor-pointer">
                      <SelectValue
                        placeholder={
                          categoriesLoading
                            ? "Memuat daftar kategori..."
                            : "🏆 Pilih kategori kompetisi..."
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-[#141824] border border-white/15 text-[#FFF9F5] rounded-xl shadow-2xl">
                      <LeaderboardSelectItem
                        key="all"
                        value="all"
                        content="Semua Kategori"
                      />

                      {categories?.map((category) => (
                        <LeaderboardSelectItem
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
                          ? "Ketik nama tim atau peserta..."
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
                      {leaderboardFetching && isSearching ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
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

            {/* Loading State - only when initially loading category without cached data */}
            {leaderboardLoading && !apiData && selectedCategoryId && (
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
                    Terjadi kendala saat mengambil data skor. Silakan periksa
                    koneksi Anda dan coba lagi.
                  </p>
                </div>
              </div>
            )}

            {/* Empty State when Category Selected but no participants */}
            {leaderboardData &&
              leaderboardData.length === 0 &&
              !isSearching &&
              selectedCategoryId &&
              !leaderboardLoading &&
              !isError && (
                <div className="mia-card border-dashed border-white/20 p-12 md:p-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#1E2939] border border-white/10 flex items-center justify-center mx-auto text-[#AAB1BD]">
                    <Trophy className="h-8 w-8 text-[#AAB1BD]" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#FFF9F5]">
                    Belum Ada Tim di Leaderboard
                  </h3>
                  <p className="text-sm md:text-base text-[#AAB1BD] max-w-md mx-auto">
                    Belum ada tim yang terdaftar atau memiliki perolehan XP
                    untuk kategori ini. Tuntaskan misi harian untuk meraih
                    posisi puncak!
                  </p>
                </div>
              )}

            {/* Empty State when search returns no result */}
            {isSearching &&
              remaining.length === 0 &&
              selectedCategoryId &&
              !leaderboardLoading &&
              !isError && (
                <div className="mia-card border-dashed border-white/20 p-12 md:p-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#AAB1BD]">
                    <Search className="h-8 w-8 text-[#AAB1BD]" />
                  </div>
                  <div className="space-y-1 max-w-md mx-auto">
                    <h3 className="text-xl md:text-2xl font-bold text-[#FFF9F5]">
                      Tim Tidak Ditemukan
                    </h3>
                    <p className="text-sm md:text-base text-[#AAB1BD]">
                      Tidak ada tim atau peserta yang cocok dengan kata kunci
                      &quot;
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

            {/* Top 3 Podium (Hall of Fame) - Shown only on page 1 */}
            {selectedCategoryId == "all" && topThree.length > 0 && (
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
                    Para tim terbaik dengan perolehan XP tertinggi
                  </p>
                </div>

                {/* Podium Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-5xl mx-auto pt-4">
                  {/* Rank 2 (Silver) - Positioned Left on Desktop */}
                  {topThree[1] ? (
                    <PodiumCard rank={2} topThree={topThree} />
                  ) : (
                    <div className="hidden md:block order-2 md:order-1" />
                  )}

                  {/* Rank 1 (Gold / Champion) - Center & Taller */}
                  <PodiumCard rank={1} topThree={topThree} />

                  {/* Rank 3 (Bronze) - Positioned Right on Desktop */}
                  {topThree[2] ? (
                    <PodiumCard rank={3} topThree={topThree} />
                  ) : (
                    <div className="hidden md:block order-3" />
                  )}
                </div>
              </div>
            )}

            {/* Table of Participants */}
            {remaining.length > 0 && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-[#FFF9F5]">
                      {isSearching
                        ? "Hasil Pencarian Tim"
                        : isAllCategory
                          ? page === 1
                            ? "Peringkat Lainnya"
                            : "Daftar Peringkat"
                          : `Peringkat ${remaining[0].category?.name}`}
                    </h3>
                    <p className="text-xs md:text-sm text-[#AAB1BD]">
                      {isSearching
                        ? `Menampilkan tim ${!isAllCategory ? remaining[0].category?.name : ""} yang cocok dengan kata kunci "${appliedSearch}"`
                        : page === 1
                          ? `Daftar tim ${!isAllCategory ? remaining[0].category?.slug : "peringkat ke-4 dan seterusnya"} berdasarkan total XP dan diamond`
                          : `Menampilkan tim peringkat ${(page - 1) * limit + 1} sampai ${Math.min(meta.total, page * limit)}`}
                    </p>
                  </div>
                  <div className="mia-pill-badge w-fit sm:shrink-0 text-end">
                    <span>
                      {isSearching
                        ? `Ditemukan ${meta.total} Tim`
                        : `Total ${meta.total} Tim Terdaftar`}
                    </span>
                  </div>
                </div>

                <div className="mia-card overflow-hidden">
                  {/* Desktop Table Header */}
                  <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 bg-[#1E2939]/80 border-b border-white/10 text-xs font-semibold text-[#AAB1BD] uppercase tracking-wider">
                    <div className="col-span-2 text-center">Peringkat</div>
                    <div
                      className={cn(
                        isAllCategory ? "col-span-4" : "col-span-6",
                      )}
                    >
                      Tim & Peserta
                    </div>
                    {isAllCategory && (
                      <div className="col-span-2 text-center">Kategori</div>
                    )}
                    <div className="col-span-2 text-center">Perolehan XP</div>
                    <div className="col-span-2 text-center">Diamond</div>
                  </div>

                  {/* Rows */}
                  <div className="divide-y divide-white/5">
                    {remaining.map((item, index) => {
                      const rank =
                        item.rank ??
                        (page === 1 && !isSearching
                          ? index + 4
                          : (page - 1) * limit + index + 1);
                      return (
                        <div
                          key={item.registration_id || index}
                          className="p-4 sm:p-5 hover:bg-white/[0.03] transition-colors duration-150"
                        >
                          {/* Mobile View */}
                          <div className="md:hidden space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-3">
                                <div className="self-start mt-2">
                                  <RankIcon
                                    rank={rank}
                                    hallOfFameMode={false}
                                  />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-base text-[#FFF9F5]">
                                    {item.team_name}
                                  </h4>
                                  <p className="text-xs text-[#AAB1BD]">
                                    oleh {item.user?.name || "Peserta"}
                                  </p>
                                  {isAllCategory && (
                                    <Badge
                                      className={cn(
                                        getRankBadgeColor(-1),
                                        "bg-[#1E2939]/30 text-[11px] py-0.5 mt-1",
                                      )}
                                    >
                                      {item.category?.name}
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                                  <Zap className="h-4 w-4 fill-amber-400" />
                                  <span className="text-lg text-[#FFF9F5]">
                                    {item.xp.toLocaleString()}
                                  </span>
                                  <span className="text-xs text-[#AAB1BD]">
                                    XP
                                  </span>
                                </div>

                                <span className="flex items-center w-fit self-end gap-1 px-2.5 py-0.5 rounded-full bg-[#FED700]/10 border border-[#FED700]/30 text-[#FED700] text-xs font-semibold">
                                  <span>💎</span>
                                  <span>{item.diamond.toLocaleString()}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Desktop View */}
                          <div className="hidden md:grid md:grid-cols-12 gap-4 items-center px-2">
                            <div className="col-span-2 flex items-center justify-center gap-2">
                              <RankIcon rank={rank} hallOfFameMode={false} />
                            </div>

                            <div
                              className={cn(
                                isAllCategory ? "col-span-4" : "col-span-6",
                              )}
                            >
                              <h4 className="font-semibold text-base text-[#FFF9F5]">
                                {item.team_name}
                              </h4>
                              <p className="text-xs text-[#AAB1BD]">
                                oleh {item.user?.name || "Peserta"}
                              </p>
                            </div>

                            {isAllCategory && (
                              <div className="col-span-2 flex items-center justify-center">
                                <Badge
                                  className={cn(
                                    getRankBadgeColor(-1),
                                    "scale-90 bg-[#1E2939]/30",
                                  )}
                                >
                                  {item.category?.name}
                                </Badge>
                              </div>
                            )}

                            <div className="col-span-2 flex items-center justify-center gap-1.5 font-bold text-amber-400">
                              <Zap className="h-4 w-4 fill-amber-400" />
                              <span className="text-xl text-[#FFF9F5]">
                                {item.xp.toLocaleString()}
                              </span>
                              <span className="text-xs text-[#AAB1BD]">XP</span>
                            </div>

                            <div className="col-span-2 flex items-center justify-center">
                              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FED700]/10 border border-[#FED700]/30 text-[#FED700] text-xs font-semibold">
                                <span>💎</span>
                                <span>{item.diamond.toLocaleString()}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pagination Controls */}
                {meta.totalPages > 1 && (
                  <div className="mia-card p-3 sm:p-4 flex items-center justify-between gap-4 max-w-md mx-auto mt-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full cursor-pointer hover:bg-white/10 text-xs px-4 text-[#FFF9F5]"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                      onClick={() =>
                        setPage((p) => Math.min(meta.totalPages, p + 1))
                      }
                    >
                      Berikutnya
                    </Button>
                  </div>
                )}
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
                  Pilih salah satu kategori kompetisi pada dropdown di atas
                  untuk melihat klasemen dan perolehan XP tim terbaik.
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
