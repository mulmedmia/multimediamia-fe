import api from "@/lib/api";

// Ambil semua pendaftar dengan pagination & filter kategori
export const getAllRegistrations = async ({
  page = 1,
  limit = 10,
  category = "",
  search = "",
} = {}) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (category) params.append("category", category);
  if (search) params.append("search", search);

  const res = await api.get(`/registrations?${params.toString()}`);
  return res.data.data; // { registrations: [], meta: { page, limit, totalPages, ... } }
};

// Ambil detail pendaftar by id
export const getRegistrationById = async (id) => {
  const res = await api.get(`/registrations/${id}`);
  return res.data.data;
};

// Patch verifikasi pendaftar
export const patchVerifyRegistration = async ({ id, is_verified }) => {
  const res = await api.patch(`/registrations/${id}/verify`, { is_verified });
  return res.data;
};

// Patch feedback pendaftar
export const patchRegistrationFeedback = async ({ id, feedback }) => {
  const res = await api.patch(`/registrations/${id}/feedback`, { feedback });
  return res.data;
};