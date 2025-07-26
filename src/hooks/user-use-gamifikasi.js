import { useQuery } from "@tanstack/react-query";
import { getMyRedemptions, getLeaderboardByCategory, getCategories } from "@/services/user-gamifikasi.service";

/**
 * Hook untuk mengambil riwayat penukaran user.
 */
export function useMyRedemptions() {
  return useQuery({
    queryKey: ["my-redemptions"],
    queryFn: getMyRedemptions,
  });
}

/**
 * Hook untuk mengambil leaderboard berdasarkan kategori.
 * @param {string} categoryId
 */
export function useLeaderboardByCategory(categoryId) {
  return useQuery({
    queryKey: ["leaderboard", categoryId],
    queryFn: () => getLeaderboardByCategory(categoryId),
    enabled: !!categoryId,
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