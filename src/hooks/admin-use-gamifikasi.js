import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, patchUserPoints } from "@/services/admin-gamifikasi.service";
import { toast } from "sonner";

// Query untuk ambil semua user
export function useGamifikasiUsers() {
  return useQuery({
    queryKey: ["admin-gamifikasi-users"],
    queryFn: getAllUsers,
  });
}

// Mutation untuk update poin user
export function usePatchUserPoints() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patchUserPoints,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["admin-gamifikasi-users"] });
      toast.success(data.message || "Poin berhasil diupdate!");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Gagal update poin!");
    },
  });
}