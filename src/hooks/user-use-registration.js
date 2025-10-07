import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRegistration } from "@/services/competition.service";
import { toast } from "sonner";

export function useUpdateRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ registrationId, data }) =>
      updateRegistration(registrationId, data),
    onSuccess: (response) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["myRegistrations"] });
      queryClient.invalidateQueries({ queryKey: ["mySubmissions"] });
      queryClient.invalidateQueries({ queryKey: ["registration"] });
      toast.success(response.message || "Data tim berhasil diperbarui!");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Gagal memperbarui data tim!"
      );
    },
  });
}
