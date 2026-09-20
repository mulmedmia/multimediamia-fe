import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from "@/services/admin-product.service";
import { toast } from "sonner";

export function useAdminProducts({ limit = 10, page = 1, search = "", is_active = "" } = {}) {
  return useQuery({
    queryKey: ["admin-products", { limit, page, search, is_active }],
    queryFn: () => getAdminProducts({ limit, page, search, is_active }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });
}

export function useCreateAdminProduct(onSuccess) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAdminProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Produk berhasil ditambahkan");
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Gagal menambah produk");
    },
  });
}

export function useUpdateAdminProduct(onSuccess) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateAdminProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Produk berhasil diupdate");
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Gagal update produk");
    },
  });
}

export function useDeleteAdminProduct(onSuccess) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Produk berhasil dihapus");
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Gagal menghapus produk");
    },
  });
}