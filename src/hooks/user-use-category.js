import { useQuery } from "@tanstack/react-query";
import { getUserCategories, getCategoryById, getAllUserCategories } from "@/services/user-category.service";

/**
 * Hook untuk mengambil daftar kategori dengan pagination
 * @param {Object} params - Parameter query
 * @returns {Object} Query result dari React Query
 */
export function useUserCategories({ 
  limit = 10, 
  page = 1, 
  status = "", 
  search = "",
  enabled = true 
} = {}) {
  return useQuery({
    queryKey: ["user-categories", { limit, page, status, search }],
    queryFn: () => getUserCategories({ limit, page, status, search }),
    staleTime: 1000 * 60 * 5, // 5 menit
    refetchInterval: 1000 * 60 * 10, // 10 menit
    enabled,
  });
}

/**
 * Hook untuk mengambil detail kategori berdasarkan ID
 * @param {string} categoryId - ID kategori
 * @param {boolean} enabled - Apakah query enabled
 * @returns {Object} Query result dari React Query
 */
export function useCategoryById(categoryId, enabled = true) {
  return useQuery({
    queryKey: ["user-category", categoryId],
    queryFn: () => getCategoryById(categoryId),
    staleTime: 1000 * 60 * 5, // 5 menit
    refetchInterval: 1000 * 60 * 10, // 10 menit
    enabled: enabled && !!categoryId,
  });
}

/**
 * Hook untuk mengambil semua kategori (tanpa pagination)
 * @param {boolean} enabled - Apakah query enabled
 * @returns {Object} Query result dari React Query
 */
export function useAllUserCategories(enabled = true) {
  return useQuery({
    queryKey: ["all-user-categories"],
    queryFn: getAllUserCategories,
    staleTime: 1000 * 60 * 10, // 10 menit
    refetchInterval: 1000 * 60 * 15, // 15 menit
    enabled,
  });
}