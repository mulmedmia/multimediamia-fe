import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from "@/services/admin-product.service";
import { toast } from "sonner";

export function useAdminProducts({ limit, page, search }) {
  return useQuery({
    queryKey: ["admin-products", { limit, page, search }],
    queryFn: () => getAdminProducts({ limit, page, search }),
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
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
    onError: () => {
      toast.error("Gagal menambah produk");
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
    onError: () => {
      toast.error("Gagal update produk");
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
    onError: () => {
      toast.error("Gagal menghapus produk");
    },
  });
}