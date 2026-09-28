import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  generateReferralCode,
  getAdminReferrals,
  approveAdminReferral,
  rejectAdminReferral,
} from "@/services/referral.service";
import { toast } from "sonner";

// Hook untuk generate referral code peserta
export function useGenerateReferralCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (registrationId) => generateReferralCode(registrationId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["myRegistrations"] });
      queryClient.invalidateQueries({ queryKey: ["registration"] });
      toast.success(response.message || "Kode referral berhasil dibuat!");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || error?.message || "Gagal membuat kode referral",
      );
    },
  });
}

// Hook untuk query admin referrals
export function useAdminReferrals(params = {}) {
  return useQuery({
    queryKey: ["adminReferrals", params],
    queryFn: () => getAdminReferrals(params),
  });
}

// Hook untuk ACC referral oleh admin
export function useApproveReferral() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ referralLogId, adminNotes }) =>
      approveAdminReferral(referralLogId, adminNotes),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["adminReferrals"] });
      toast.success(response.message || "Referral berhasil di-ACC!");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || error?.message || "Gagal menyetujui referral",
      );
    },
  });
}

// Hook untuk Batal referral oleh admin
export function useRejectReferral() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ referralLogId, adminNotes }) =>
      rejectAdminReferral(referralLogId, adminNotes),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["adminReferrals"] });
      toast.success(response.message || "Referral berhasil dibatalkan!");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || error?.message || "Gagal membatalkan referral",
      );
    },
  });
}
