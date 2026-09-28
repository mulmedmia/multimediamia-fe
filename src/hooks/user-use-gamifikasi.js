import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getMyRedemptions, getLeaderboardByCategory, getCategories } from "@/services/user-gamifikasi.service";

/**
 * Hook untuk mengambil riwayat penukaran user.
 * @param {object} filters
 */
export function useMyRedemptions(filters = {}) {
  return useQuery({
    queryKey: ["my-redemptions", filters],
    queryFn: () => getMyRedemptions(filters),
  });
}

/**
 * Hook untuk mengambil leaderboard berdasarkan kategori.
 * @param {string} categoryId
 * @param {object} options
 */
export function useLeaderboardByCategory(categoryId, { page = 1, limit = 10, search = "" } = {}) {
  return useQuery({
    queryKey: ["leaderboard", categoryId, { page, limit, search }],
    queryFn: () => getLeaderboardByCategory(categoryId, { page, limit, search }),
    enabled: !!categoryId,
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook untuk mengambil semua kategori.
 */
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
}