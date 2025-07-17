import api from "@/lib/api";

// Ambil semua user (untuk admin)
export const getAllUsers = async () => {
  const res = await api.get("/users");
  // Ambil array users dari response
  return res.data.data.users;
};

// Update poin user (admin only)
export const patchUserPoints = async ({ id, points }) => {
  const res = await api.patch(`/gamification/users/${id}/points`, { points });
  return res.data;
};