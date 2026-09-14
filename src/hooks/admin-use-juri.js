import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllJuri, createJuri, deleteJuri } from "@/services/admin-juri.service";
import { toast } from "sonner";

// Query: ambil semua juri
export function useAdminJuri() {
  return useQuery({
    queryKey: ["admin-juri"],
    queryFn: getAllJuri,
  });
}

// Mutation: tambah juri
export function useCreateJuri(onSuccessCb) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createJuri,
    onSuccess: (data, variables, context) => {
      qc.invalidateQueries({ queryKey: ["admin-juri"] });
      toast.success(data.message || "Juri berhasil ditambahkan!");
      if (onSuccessCb) onSuccessCb(data, variables, context);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Gagal menambah juri!");
    },
  });
}

// Mutation: hapus juri
export function useDeleteJuri() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteJuri,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["admin-juri"] });
      toast.success(data.message || "Juri berhasil dihapus!");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Gagal menghapus juri!");
    },
  });
}