import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllRegistrations,
  patchVerifyRegistration,
  getRegistrationById,
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
      toast.success(data.message || "Verifikasi berhasil!");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Gagal verifikasi!");
    },
  });
}

// Query: detail pendaftar by id (optional, jika butuh detail)
export function useRegistrationDetail(id) {
  return useQuery({
    queryKey: ["admin-registration-detail", id],
    queryFn: () => getRegistrationById(id),
    enabled: !!id,
  });
}