import api from "@/lib/api";

// Ambil semua user (untuk admin) dengan pagination
export const getAllUsers = async ({ page = 1, limit = 10 } = {}) => {
  const res = await api.get(`/users?page=${page}&limit=${limit}`);
  // Kembalikan seluruh data termasuk meta
  return res.data.data;
};

// Update poin user (admin only)
export const patchUserPoints = async ({ id, points }) => {
  const res = await api.patch(`/gamification/users/${id}/points`, { points });
  return res.data;
};
