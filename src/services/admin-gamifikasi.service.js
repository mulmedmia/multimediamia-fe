import api from "@/lib/api";

// Ambil semua tim terdaftar (untuk admin) dengan pagination, search, dan kategori
export const getGamifikasiTeams = async ({
  page = 1,
  limit = 10,
  search = "",
  category_id = "",
} = {}) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (search && search.trim()) params.append("search", search.trim());
  if (category_id && category_id !== "ALL") params.append("category_id", category_id);

  const res = await api.get(`/registrations?${params.toString()}`);
  return res.data.data;
};

// Update diamond & xp pendaftaran tim (admin only)
export const patchRegistrationGamification = async ({ id, diamond, xp }) => {
  const res = await api.patch(`/gamification/registrations/${id}`, { diamond, xp });
  return res.data;
};

// Aliases for backwards compatibility
export const getAllUsers = getGamifikasiTeams;
export const patchUserPoints = patchRegistrationGamification;
