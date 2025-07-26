import api from "@/lib/api";

// Ambil semua data redeem user (admin)
export const getAllRedemptions = async ({ page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams({ page, limit });
  const res = await api.get(`/gamification/admin/redeem/all?${params.toString()}`);
  // Return array redemptions dan meta
  return {
    redemptions: res.data.data.redemptions,
    meta: res.data.data.meta,
  };
};