import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  toggleAdminCategorySubmission,
  toggleAdminCategoryShowIt,
} from "@/services/admin-category.service";
import { toast } from "sonner";

export function useAdminCategories({ limit, page, search, status }) {
  return useQuery({
    queryKey: ["admin-categories", { limit, page, search, status }],
    queryFn: () => getAdminCategories({ limit, page, search, status }),
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

export function useToggleAdminCategorySubmission(onSuccessCb) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: toggleAdminCategorySubmission,
    onSuccess: (data, variables, context) => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success(
        data?.is_submission_open
          ? "Pengumpulan karya berhasil dibuka"
          : "Pengumpulan karya berhasil ditutup"
      );
      if (onSuccessCb) onSuccessCb(data, variables, context);
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Gagal mengubah status pengumpulan"
      );
    },
  });
}

export function useToggleAdminCategoryShowIt(onSuccessCb) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: toggleAdminCategoryShowIt,
    onSuccess: (data, variables, context) => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success(
        data?.is_show_it_open
          ? "Karya kategori berhasil ditampilkan di Show It"
          : "Karya kategori berhasil disembunyikan dari Show It"
      );
      if (onSuccessCb) onSuccessCb(data, variables, context);
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Gagal mengubah status penayangan Show It"
      );
    },
  });
}

