import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getAllRegistrations, 
  getRegistrationById, 
  patchVerifyRegistration, 
  patchRegistrationFeedback 
} from "@/services/admin-pendaftar.service";
import { toast } from "sonner";

// Query: ambil semua pendaftar
export function useAdminRegistrations() {
  return useQuery({
    queryKey: ["admin-registrations"],
    queryFn: getAllRegistrations,
  });
}

// Mutation: verifikasi pendaftar
export function useVerifyRegistration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patchVerifyRegistration,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["admin-registrations"] });
      qc.invalidateQueries({ queryKey: ["admin-registration-detail"] });
      toast.success(data.message || "Verifikasi berhasil!");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Gagal verifikasi!");
    },
  });
}

// Mutation: feedback pendaftar
export function useFeedbackRegistration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patchRegistrationFeedback,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["admin-registrations"] });
      qc.invalidateQueries({ queryKey: ["admin-registration-detail"] });
      toast.success(data.message || "Feedback berhasil dikirim!");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Gagal mengirim feedback!");
    },
  });
}

// Query: detail pendaftar by id
export function useRegistrationDetail(id) {
  return useQuery({
    queryKey: ["admin-registration-detail", id],
    queryFn: () => getRegistrationById(id),
    enabled: !!id,
  });
}