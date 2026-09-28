import api from "@/lib/api";

// Participant: Generate kode referral untuk pendaftaran tim/individu
export const generateReferralCode = async (registrationId) => {
  const response = await api.post(`/registrations/${registrationId}/generate-referral-code`);
  return response.data;
};

// Participant: Validasi kode referral saat mendaftar lomba
export const validateReferralCode = async (code) => {
  if (!code || !code.trim()) {
    return { valid: false, message: "Kode referral kosong" };
  }
  const response = await api.get(`/referrals/validate?code=${encodeURIComponent(code.trim())}`);
  return response.data;
};

// Admin: Mengambil daftar referral logs dengan filter & pagination
export const getAdminReferrals = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.status && params.status !== "ALL") query.append("status", params.status);
  if (params.search) query.append("search", params.search);
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);

  const response = await api.get(`/admin/referrals?${query.toString()}`);
  return response.data.data;
};

// Admin: Menyetujui (ACC) referral dan mencairkan XP
export const approveAdminReferral = async (referralLogId, adminNotes = null) => {
  const response = await api.post(`/admin/referrals/${referralLogId}/approve`, {
    admin_notes: adminNotes,
  });
  return response.data;
};

// Admin: Membatalkan / Menolak referral dan menarik kembali XP jika sebelumnya berstatus APPROVED
export const rejectAdminReferral = async (referralLogId, adminNotes = null) => {
  const response = await api.post(`/admin/referrals/${referralLogId}/reject`, {
    admin_notes: adminNotes,
  });
  return response.data;
};
