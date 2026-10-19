"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";
import { useMissions } from "@/hooks/user-use-missions";
import { useMyRegistrations } from "@/hooks/user-use-registration";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import Footer from "@/components/layout/Footer";
import { MissionCard } from "@/components/misi-harian/MissionCard";
import { MissionDetailModal } from "@/components/misi-harian/MissionDetailModal";
import { MissionSubmitModal } from "@/components/misi-harian/MissionSubmitModal";
import { Input } from "@/components/ui/input";
import {
  Target,
  Zap,
  Gem,
  Search,
  AlertCircle,
  ArrowRight,
  Trophy,
  Gift,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { isExpired } from "@/lib/utils";

export default function MisiHarianPage() {
  const { user, loading: authLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const userId = user?.users_id || user?.userId;
  const { data: myRegistrations, isLoading: registrationsLoading } =
    useMyRegistrations(userId);

  const participatingCategories = useMemo(() => {
    if (!myRegistrations || !Array.isArray(myRegistrations)) return [];
    const map = new Map();
    myRegistrations.forEach((reg) => {
      const catId = reg.category_id || reg.category?.category_id;
      if (catId && !map.has(catId)) {
        map.set(catId, {
          category_id: catId,
          name:
            reg.category?.name || reg.category?.category_name || "Kompetisi",
          slug: reg.category?.slug,
          team_name: reg.team_name,
          diamond: Number(reg.diamond ?? 0),
          xp: Number(reg.xp ?? 0),
          registration_id: reg.registration_id,
        });
      }
    });
    return Array.from(map.values());
  }, [myRegistrations]);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  useEffect(() => {
    if (participatingCategories.length > 0) {
      if (
        !selectedCategoryId ||
        !participatingCategories.some(
          (c) => c.category_id === selectedCategoryId,
        )
      ) {
        setSelectedCategoryId(participatingCategories[0].category_id);
      }
    }
  }, [participatingCategories, selectedCategoryId]);

  const activeCategory = useMemo(() => {
    return (
      participatingCategories.find(
        (c) => c.category_id === selectedCategoryId,
      ) ||
      participatingCategories[0] ||
      null
    );
  }, [participatingCategories, selectedCategoryId]);

  const {
    data: missions,
    isLoading,
    isError,
    refetch,
  } = useMissions({
    category_id: selectedCategoryId || undefined,
    registration_id: activeCategory?.registration_id || undefined,
  });

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal Submit State
  const [selectedMission, setSelectedMission] = useState(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  const [backToDetail, setBackToDetail] = useState(false);

  // Modal Detail State
  const [selectedDetailMission, setSelectedDetailMission] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleOpenDetail = (mission) => {
    setSelectedDetailMission(mission);
    setIsDetailOpen(true);
  };

  const handleOpenSubmit = (mission, newBackToDetail = false) => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu untuk mengumpulkan misi!");
      return;
    }
    if (!activeCategory) {
      toast.error(
        "Silakan daftar kompetisi terlebih dahulu untuk mengumpulkan misi!",
      );
      return;
    }
    setSelectedMission(mission);
    setIsSubmitOpen(true);
    setBackToDetail(newBackToDetail);
  };

  // Filtered missions
  const filteredMissions = useMemo(() => {
    if (!missions) return [];

    return missions.filter((mission) => {
      const matchesSearch =
        mission.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mission.description?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      const subStatus = mission.my_submission?.status;
      const expired = isExpired(mission.deadline);

      if (activeTab === "available") {
        return !subStatus && !expired;
      }
      if (activeTab === "pending") {
        return subStatus === "PENDING";
      }
      if (activeTab === "approved") {
        return subStatus === "APPROVED";
      }
      if (activeTab === "rejected") {
        return subStatus === "REJECTED";
      }
      if (activeTab === "expired") {
        return expired && !subStatus;
      }

      return true;
    });
  }, [missions, searchQuery, activeTab]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen w-full bg-[#0A0D14] flex items-center justify-center text-[#FFF9F5]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#E01C20] border-t-transparent mx-auto"></div>
          <p className="text-sm text-[#AAB1BD]">Memverifikasi sesi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0D14] mia-connected-bg text-[#FFF9F5] flex flex-col justify-between selection:bg-[#E01C20] selection:text-white">
      <div>
        <DashboardHeader />

        <main className="pt-24 sm:pt-28 pb-16 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-8 md:space-y-10">
            {/* Eyebrow & Page Header */}
            <div className="text-center space-y-3 md:space-y-4 max-w-3xl mx-auto">
              <div className="mia-pill-badge mx-auto">
                <Target className="h-3.5 w-3.5 text-[#FED700]" />
                <span>Misi Harian & Gamifikasi</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FFF9F5]">
                Misi <span className="text-[#E01C20]">Harian</span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-[#AAB1BD] leading-relaxed">
                Tuntaskan misi harian, kumpulkan XP untuk menaikkan peringkat di
                Leaderboard dan raih Diamonds{" "}
                <span className="inline-block">💎</span> untuk ditukarkan dengan
                hadiah eksklusif MIA 2026.
              </p>
            </div>

            {/* Top Summary / Action Card (Card 1) */}
            <div className="mia-card p-6 md:p-8 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-14 h-14 bg-[#E01C20]/15 border border-[#E01C20]/30 rounded-2xl flex items-center justify-center text-[#E01C20] flex-shrink-0 shadow-[0_0_15px_rgba(224,28,32,0.15)]">
                    <Target className="h-7 w-7 text-[#E01C20]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#AAB1BD] font-semibold mb-0.5">
                      Katalog Misi Resmi
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-[#FFF9F5]">
                      {missions?.length || 0}{" "}
                      <span className="text-sm sm:text-base font-normal text-[#AAB1BD]">
                        Misi Tersedia
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-stretch sm:justify-end">
                  {activeCategory ? (
                    <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold self-stretch sm:self-auto justify-center">
                      <span className="text-[#AAB1BD]">Tim:</span>
                      <span className="text-[#FFF9F5] font-bold">
                        {activeCategory.team_name || "-"}
                      </span>
                      <span className="text-border/40 select-none">|</span>
                      <span className="text-amber-400 flex items-center gap-1.5 font-bold">
                        <Zap className="h-3.5 w-3.5 fill-amber-400" />
                        {activeCategory.xp.toLocaleString()} XP
                      </span>
                      <span className="text-border/40 select-none">|</span>
                      <span className="text-cyan-400 flex items-center gap-1.5 font-bold">
                        <Gem className="h-3 w-3 fill-cyan-400" />
                        {activeCategory.diamond.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold self-stretch sm:self-auto justify-center text-[#AAB1BD]">
                      <span>Belum terdaftar tim lomba</span>
                    </div>
                  )}
                  <Link
                    href="/product"
                    className="mia-btn-secondary px-5 py-2.5 text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer transition-all self-stretch sm:self-auto justify-center group"
                  >
                    <Gift className="h-4 w-4 text-[#E01C20] group-hover:scale-110 transition-transform" />
                    <span>Tukar Hadiah</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Competition Category Filter Bar */}
            {registrationsLoading ? (
              <div className="p-4 rounded-2xl bg-[#141824] border border-white/10 animate-pulse h-14"></div>
            ) : participatingCategories.length === 0 ? (
              <div className="mia-card p-6 md:p-8 text-center border-amber-500/30 bg-amber-500/5 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-lg font-bold text-[#FFF9F5]">
                    Belum Terdaftar di Kompetisi
                  </h3>
                  <p className="text-xs sm:text-sm text-[#AAB1BD] leading-relaxed">
                    Misi harian terhubung ke masing-masing kategori lomba (WIA,
                    UIA, dll). Silakan daftar kompetisi terlebih dahulu untuk
                    dapat mengakses dan mengumpulkan misi harian.
                  </p>
                </div>
                <Link
                  href="/competition-registration"
                  className="mia-btn-primary px-5 py-2.5 text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Daftar Kompetisi Sekarang</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2 p-3.5 rounded-2xl bg-[#141824] border border-white/10">
                <span className="text-xs font-semibold text-[#AAB1BD] px-1">
                  {participatingCategories.length > 1
                    ? "Filter Kategori Lomba:"
                    : "Kategori Lomba Anda:"}
                </span>
                {participatingCategories.length === 1 ? (
                  <div className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#E01C20] text-white shadow-[0_0_15px_rgba(224,28,32,0.3)] flex items-center gap-2">
                    <Trophy className="h-3.5 w-3.5" />
                    <span>{activeCategory?.name}</span>
                    {activeCategory?.team_name && (
                      <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-normal">
                        Tim: {activeCategory.team_name}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {participatingCategories.map((cat) => {
                      const isSelected = cat.category_id === selectedCategoryId;
                      return (
                        <button
                          key={cat.category_id}
                          type="button"
                          onClick={() => setSelectedCategoryId(cat.category_id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                            isSelected
                              ? "bg-[#E01C20] text-white shadow-[0_0_15px_rgba(224,28,32,0.3)]"
                              : "text-[#AAB1BD] bg-white/5 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <Trophy
                            className={`h-3.5 w-3.5 ${
                              isSelected ? "text-white" : "text-[#AAB1BD]"
                            }`}
                          />
                          <span>{cat.name}</span>
                          {cat.team_name && (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] ${
                                isSelected
                                  ? "bg-white/20 text-white"
                                  : "bg-white/5 text-[#AAB1BD]"
                              }`}
                            >
                              {cat.team_name}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Filters & Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Filter Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#141824] border border-white/10 overflow-x-auto">
                {[
                  { id: "all", label: "Semua Misi" },
                  { id: "available", label: "Tersedia" },
                  { id: "pending", label: "Menunggu Review" },
                  { id: "approved", label: "Disetujui" },
                  { id: "rejected", label: "Ditolak" },
                  { id: "expired", label: "Kadaluarsa" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-[#E01C20] text-white shadow-[0_0_15px_rgba(224,28,32,0.3)]"
                        : "text-[#AAB1BD] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#AAB1BD]" />
                <Input
                  type="text"
                  placeholder="Cari misi harian..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 bg-[#141824] border-white/10 text-[#FFF9F5] placeholder:text-[#AAB1BD]/60 rounded-xl focus-visible:ring-[#E01C20] text-xs"
                />
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="mia-card overflow-hidden animate-pulse flex flex-col p-5 sm:p-6 space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-24 bg-[#1E2939] rounded"></div>
                      <div className="h-5 w-16 bg-[#1E2939] rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-5 w-3/4 bg-[#1E2939] rounded-md"></div>
                      <div className="h-3 w-full bg-[#1E2939] rounded"></div>
                      <div className="h-3 w-2/3 bg-[#1E2939] rounded"></div>
                    </div>
                    <div className="h-14 w-full bg-[#1E2939] rounded-xl"></div>
                    <div className="h-10 w-full bg-[#1E2939] rounded-full mt-2"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {!isLoading && isError && (
              <div className="mia-card border-[#E01C20]/40 p-8 md:p-12 text-center space-y-6 max-w-xl mx-auto">
                <div className="w-16 h-16 bg-[#E01C20]/15 border border-[#E01C20]/30 text-[#E01C20] rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(224,28,32,0.2)]">
                  <AlertCircle className="h-8 w-8 text-[#E01C20]" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#FFF9F5]">
                    Gagal Memuat Misi Harian
                  </h2>
                  <p className="text-sm text-[#AAB1BD] max-w-md mx-auto leading-relaxed">
                    Terjadi kendala saat mengambil data misi harian. Silakan
                    periksa koneksi internet atau server backend sedang
                    berjalan.
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => refetch()}
                    className="mia-btn-secondary px-5 py-2.5 text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
                  >
                    <RefreshCw className="h-4 w-4 text-[#E01C20]" />
                    <span>Coba Lagi</span>
                  </button>
                  <Link
                    href="/product"
                    className="mia-btn-primary px-5 py-2.5 text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
                  >
                    <Gift className="h-4 w-4 text-white" />
                    <span>Ke Katalog Hadiah</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Empty State (Card 2) */}
            {!isLoading && !isError && filteredMissions.length === 0 && (
              <div className="mia-card p-8 md:p-14 text-center space-y-6 w-full">
                <div className="w-16 h-16 bg-[#E01C20]/15 border border-[#E01C20]/30 text-[#E01C20] rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-[0_0_20px_rgba(224,28,32,0.2)]">
                  <Target className="h-8 w-8 text-[#E01C20]" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#FFF9F5]">
                    Tidak Ada Misi Ditemukan
                  </h3>
                  <p className="text-sm text-[#AAB1BD] leading-relaxed">
                    {searchQuery || activeTab !== "all"
                      ? "Belum ada misi yang sesuai dengan filter atau kata kunci pencarian Anda saat ini. Silakan coba reset filter atau gunakan kata kunci lain."
                      : "Saat ini belum ada misi harian yang tersedia. Silakan cek kembali beberapa saat lagi untuk misi dan tantangan terbaru!"}
                  </p>
                </div>
                {(searchQuery || activeTab !== "all") && (
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setActiveTab("all");
                        setSearchQuery("");
                      }}
                      className="mia-btn-secondary px-6 py-2.5 text-sm inline-flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <RefreshCw className="h-4 w-4 text-[#E01C20]" />
                      <span>Reset Filter</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Missions Grid */}
            {!isLoading && !isError && filteredMissions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMissions.map((mission) => (
                  <MissionCard
                    key={mission.mission_id}
                    mission={mission}
                    onOpenDetail={handleOpenDetail}
                    onOpenSubmit={handleOpenSubmit}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mission Detail Modal Dialog */}
      <MissionDetailModal
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        mission={selectedDetailMission}
        onOpenSubmit={handleOpenSubmit}
      />

      {/* Submission Modal Dialog */}
      <MissionSubmitModal
        isOpen={isSubmitOpen}
        onOpenChange={setIsSubmitOpen}
        mission={selectedMission}
        activeCategory={activeCategory}
        onOpenDetail={handleOpenDetail}
        backToDetail={backToDetail}
      />

      <Footer />
    </div>
  );
}
