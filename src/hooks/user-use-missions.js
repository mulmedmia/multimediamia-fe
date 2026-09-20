import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMissions,
  getMissionDetail,
  submitMission,
} from "@/services/mission.service";
import { toast } from "sonner";

/**
 * Hook untuk mengambil seluruh misi harian peserta beserta status pengumpulan.
 * @param {object} filters
 */
export function useMissions(filters = {}) {
  return useQuery({
    queryKey: ["user-missions", filters],
    queryFn: () => getMissions(filters),
  });
}

/**
 * Hook untuk mengambil detail misi tertentu.
 * @param {string} id - Mission ID
 */
export function useMissionDetail(id) {
  return useQuery({
    queryKey: ["user-mission-detail", id],
    queryFn: () => getMissionDetail(id),
    enabled: !!id,
  });
}

/**
 * Mutation untuk mengirim/mengupload link tugas misi harian.
 */
export function useSubmitMission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitMission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-missions"] });
      queryClient.invalidateQueries({ queryKey: ["user-mission-detail"] });
      queryClient.invalidateQueries({ queryKey: ["myRegistrations"] });
      toast.success("Misi berhasil dikumpulkan! Menunggu peninjauan admin.");
    },
    onError: (err) => {
      const errorMsg =
        err?.response?.data?.message || "Gagal mengumpulkan misi. Silakan coba lagi.";
      toast.error(errorMsg);
    },
  });
}
