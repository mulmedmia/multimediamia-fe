import { getAdminCategories } from "@/services/admin-category.service";
import { getAllRegistrations } from "@/services/admin-pendaftar.service";
import { getAdminProducts } from "@/services/admin-product.service";
import { getAllSubmissions } from "@/services/admin-submission.service";
import { useQuery } from "@tanstack/react-query";

export function useAdminStatsCategories() {
  return useQuery({
    queryKey: ["admin-stats-categories"],
    queryFn: () => getAdminCategories({ limit: 1, page: 1 }),
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminStatsSubmissions() {
  return useQuery({
    queryKey: ["admin-stats-submissions"],
    queryFn: () => getAllSubmissions({ limit: 1, page: 1 }),
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminStatsProducts() {
  return useQuery({
    queryKey: ["admin-stats-products"],
    queryFn: () => getAdminProducts({ limit: 1, page: 1 }),
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
}
export function useAdminStatsRegistrations() {
  return useQuery({
    queryKey: ["admin-stats-registrations"],
    queryFn: () => getAllRegistrations({ page: 1, limit: 1 }),
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
}
