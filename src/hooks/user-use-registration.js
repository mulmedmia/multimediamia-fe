import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyRegistrations,
  updateRegistration,
} from "@/services/competition.service";
import { toast } from "sonner";

export function useMyRegistrations(userId) {
  return useQuery({
    queryKey: ["myRegistrations", userId],
    queryFn: () => getMyRegistrations(userId),
    enabled: !!userId,
  });
}

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
      const errData = error?.response?.data || error;
      let msg = errData?.message || error?.message || "Gagal memperbarui data tim!";

      if (errData?.errors) {
        if (errData.errors.team_name?._errors?.[0]) {
          const raw = errData.errors.team_name._errors[0];
          msg = raw.includes("invalid characters")
            ? "Nama tim mengandung karakter yang tidak diizinkan. Gunakan huruf, angka, spasi, atau simbol lazim (&, _, (), /, !, #, +, -, ., ')"
            : raw;
        } else if (errData.errors.file_url?._errors?.[0]) {
          const raw = errData.errors.file_url._errors[0];
          msg = raw.includes("Google Drive link")
            ? "Link berkas harus berupa link Google Drive yang valid"
            : raw;
        }
      }

      if (msg === "Validation error" || msg.includes("status code")) {
        msg = "Data yang dimasukkan tidak valid. Harap periksa kembali isian form Anda.";
      }

      toast.error(msg);
    },
  });
}
