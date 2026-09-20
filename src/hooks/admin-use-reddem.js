import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllRedemptions } from "@/services/admin-reddem.service";

// Query untuk ambil semua data redeem user (admin)
export function useAdminRedemptions({ page = 1, limit = 10, search = "", product_id = "" } = {}) {
  return useQuery({
    queryKey: ["admin-reddem", { page, limit, search, product_id }],
    queryFn: () => getAllRedemptions({ page, limit, search, product_id }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });
}