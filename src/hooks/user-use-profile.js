import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, updateUserProfile } from "@/services/user-profile.service";
import { toast } from "sonner";

/**
 * Hook untuk mengambil profil user
 */
export function useUserProfile() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook untuk update profil user
 */
export function useUpdateUserProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Profil berhasil diperbarui!");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Gagal memperbarui profil!");
    },
  });
}