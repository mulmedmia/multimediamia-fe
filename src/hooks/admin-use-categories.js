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

export function useCreateAdminCategory(onSuccessCb) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAdminCategory,
    onSuccess: (data, variables, context) => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Kategori berhasil ditambahkan");
      if (onSuccessCb) onSuccessCb(data, variables, context);
    },
    onError: () => {
      toast.error("Gagal menambah kategori");
    },
  });
}

export function useUpdateAdminCategory(onSuccessCb) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateAdminCategory,
    onSuccess: (data, variables, context) => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Kategori berhasil diupdate");
      if (onSuccessCb) onSuccessCb(data, variables, context);
    },
    onError: () => {
      toast.error("Gagal update kategori");
    },
  });
}

export function useDeleteAdminCategory(onSuccessCb) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminCategory,
    onSuccess: (data, variables, context) => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Kategori berhasil dihapus");
      if (onSuccessCb) onSuccessCb(data, variables, context);
    },
    onError: () => {
      toast.error("Gagal menghapus kategori");
    },
  });
}
