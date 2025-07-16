import { useQuery } from "@tanstack/react-query";
import { getAdminCategories } from "@/services/admin-category.service";

// Fetch categories with react-query
export function useAdminCategories({ limit, page, search }) {
  return useQuery({
    queryKey: ["admin-categories", { limit, page, search }],
    queryFn: () => getAdminCategories({ limit, page, search }),
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
  });
}
