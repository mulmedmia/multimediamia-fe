import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminMissions,
  getAdminMission,
  createAdminMission,
  updateAdminMission,
  deleteAdminMission,
  getAdminMissionSubmissions,
  reviewAdminSubmission,
} from "@/services/admin-mission.service";
import { toast } from "sonner";

/**
 * Hook untuk mengambil daftar misi harian di panel Admin.
 * @param {object} params - query filters
 */
export function useAdminMissions(params = {}) {
  return useQuery({
    queryKey: ["admin-missions", params],
    queryFn: () => getAdminMissions(params),
  });
}

/**
 * Hook untuk mengambil detail satu misi harian di panel Admin.
 * @param {string} id - Mission ID
 */
export function useAdminMissionDetail(id) {
  return useQuery({
    queryKey: ["admin-mission", id],
    queryFn: () => getAdminMission(id),
    enabled: !!id,
  });
}

/**
 * Mutation untuk membuat misi harian baru.
 */
export function useCreateAdminMission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminMission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-missions"] });
      toast.success("Misi harian berhasil dibuat!");
    },
    onError: (err) => {
      const errorMsg =
        err?.response?.data?.message || "Gagal membuat misi harian.";
      toast.error(errorMsg);
    },
  });
}

/**
 * Mutation untuk mengupdate misi harian.
 */
export function useUpdateAdminMission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminMission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-missions"] });
      toast.success("Misi harian berhasil diperbarui!");
    },
    onError: (err) => {
      const errorMsg =
        err?.response?.data?.message || "Gagal memperbarui misi harian.";
      toast.error(errorMsg);
    },
  });
}

/**
 * Mutation untuk menghapus misi harian.
 */
export function useDeleteAdminMission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminMission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-missions"] });
      toast.success("Misi harian berhasil dihapus!");
    },
    onError: (err) => {
      const errorMsg =
        err?.response?.data?.message || "Gagal menghapus misi harian.";
      toast.error(errorMsg);
    },
  });
}

/**
 * Hook untuk mengambil daftar pengumpulan peserta pada misi tertentu.
 * @param {string} missionId
 * @param {object} params
 */
export function useAdminMissionSubmissions(missionId, params = {}) {
  return useQuery({
    queryKey: ["admin-mission-submissions", missionId, params],
    queryFn: () => getAdminMissionSubmissions(missionId, params),
    enabled: !!missionId,
  });
}

/**
 * Mutation untuk meninjau (ACC/Reject) pengumpulan peserta dan memberikan reward.
 */
export function useReviewAdminSubmission(missionId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewAdminSubmission,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-mission-submissions"],
      });
      queryClient.invalidateQueries({ queryKey: ["admin-missions"] });
      toast.success(
        data?.submission?.status === "APPROVED"
          ? "Pengumpulan berhasil di-ACC dan reward XP/Diamond telah dikreditkan!"
          : "Pengumpulan ditolak."
      );
    },
    onError: (err) => {
      const errorMsg =
        err?.response?.data?.message || "Gagal memproses review pengumpulan.";
      toast.error(errorMsg);
    },
  });
}
