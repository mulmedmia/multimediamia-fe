import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  getGamifikasiTeams,
  patchRegistrationGamification,
} from "@/services/admin-gamifikasi.service";
import { toast } from "sonner";

// Query untuk ambil semua tim terdaftar dengan pagination, search, dan kategori
export function useGamifikasiTeams({
  page = 1,
  limit = 10,
  search = "",
  category_id = "",
  sort_by = "",
  order = "",
} = {}) {
  return useQuery({
    queryKey: ["admin-gamifikasi-teams", { page, limit, search, category_id, sort_by, order }],
    queryFn: () => getGamifikasiTeams({ page, limit, search, category_id, sort_by, order }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });
}

// Mutation untuk update diamond & xp tim
export function usePatchRegistrationGamification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patchRegistrationGamification,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["admin-gamifikasi-teams"] });
      qc.invalidateQueries({ queryKey: ["admin-registrations"] });
      toast.success(data?.message || "Gamifikasi tim (Diamond & XP) berhasil diupdate!");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Gagal update gamifikasi tim!");
    },
  });
}

// Backwards compatibility aliases
export const useGamifikasiUsers = useGamifikasiTeams;
export const usePatchUserPoints = usePatchRegistrationGamification;
