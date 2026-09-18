import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { 
  getAllRegistrations, 
  getRegistrationById, 
  patchVerifyRegistration, 
  patchRegistrationFeedback 
} from "@/services/admin-pendaftar.service";
import { toast } from "sonner";

/**
 * Hook untuk mengambil daftar pendaftar dengan pagination, filter kategori, dan search
 * @param {Object} params
 * @param {number} params.page
 * @param {number} params.limit
 * @param {string} params.category_id
 * @param {string} params.search
 */
export function useAdminRegistrations({ page = 1, limit = 10, category_id = "", search = "" }) {
  return useQuery({
    queryKey: ["admin-registrations", { page, limit, category_id, search }],
    queryFn: () => getAllRegistrations({ page, limit, category_id, search }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2,
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