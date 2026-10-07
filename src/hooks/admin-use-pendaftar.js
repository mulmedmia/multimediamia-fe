import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { 
  getAllRegistrations, 
  getRegistrationById, 
  getRegistrationStats,
  patchVerifyRegistration, 
  patchVerifyFinanceRegistration,
  patchRegistrationFeedback 
} from "@/services/admin-pendaftar.service";
import { toast } from "sonner";

/**
 * Hook untuk mengambil daftar pendaftar dengan pagination, filter kategori, search, dan status
 */
export function useAdminRegistrations({
  page = 1,
  limit = 10,
  category_id = "",
  search = "",
  is_verified = "",
  is_verified_finance = "",
}) {
  return useQuery({
    queryKey: [
      "admin-registrations",
      { page, limit, category_id, search, is_verified, is_verified_finance },
    ],
    queryFn: () =>
      getAllRegistrations({
        page,
        limit,
        category_id,
        search,
        is_verified,
        is_verified_finance,
      }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Hook untuk mengambil statistik agregat pendaftar dari PostgreSQL native (Admin & Finance)
 */
export function useRegistrationStats({ category_id = "" } = {}) {
  return useQuery({
    queryKey: ["registration-summary-stats", { category_id }],
    queryFn: () => getRegistrationStats({ category_id }),
    staleTime: 1000 * 60 * 2,
  });
}

// Mutation: verifikasi pendaftar oleh Admin
export function useVerifyRegistration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patchVerifyRegistration,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["admin-registrations"] });
      qc.invalidateQueries({ queryKey: ["admin-registration-detail"] });
      qc.invalidateQueries({ queryKey: ["registration-summary-stats"] });
      toast.success(data.message || "Verifikasi berhasil!");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Gagal verifikasi!");
    },
  });
}

// Mutation: verifikasi bukti pembayaran oleh Finance
export function useFinanceVerifyRegistration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patchVerifyFinanceRegistration,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["admin-registrations"] });
      qc.invalidateQueries({ queryKey: ["admin-registration-detail"] });
      qc.invalidateQueries({ queryKey: ["registration-summary-stats"] });
      toast.success(data.message || "Status pembayaran berhasil diperbarui!");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Gagal memperbarui status pembayaran!");
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