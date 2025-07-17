import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from "@/services/admin-category.service";
import { toast } from "sonner";

export function useAdminCategories({ limit, page, search }) {
  return useQuery({
    queryKey: ["admin-categories", { limit, page, search }],
    queryFn: () => getAdminCategories({ limit, page, search }),
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
  });
}

export function useCreateAdminCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAdminCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Kategori berhasil ditambahkan");
    },
    onError: () => {
      toast.error("Gagal menambah kategori");
    },
  });
}

export function useUpdateAdminCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateAdminCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Kategori berhasil diupdate");
    },
    onError: () => {
      toast.error("Gagal update kategori");
    },
  });
}

export function useDeleteAdminCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Kategori berhasil dihapus");
    },
    onError: () => {
      toast.error("Gagal menghapus kategori");
    },
  });
}
