import { useQuery } from "@tanstack/react-query";
import { getAllRedemptions } from "@/services/admin-reddem.service";

// Query untuk ambil semua data redeem user (admin)
export function useAdminRedemptions({ page = 1, limit = 10 } = {}) {
  return useQuery({
    queryKey: ["admin-reddem", page, limit],
    queryFn: () => getAllRedemptions({ page, limit }),
    keepPreviousData: true,
  });
}