import api from "@/lib/api";

// Ambil semua pendaftar dengan pagination & filter kategori
export const getAllRegistrations = async ({
  page = 1,
  limit = 10,
  category_id = "",
  search = "",
  is_verified,
} = {}) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (category_id && category_id !== "ALL") params.append("category_id", category_id);
  if (search) params.append("search", search);
  if (is_verified !== undefined && is_verified !== "" && is_verified !== "ALL") {
    params.append("is_verified", is_verified);
  }

  const url = `/registrations?${params.toString()}`;
  const res = await api.get(url);

  return res.data.data; // { registrations: [], meta: { page, limit, totalPages, ... } }
};

// Ambil statistik agregat pendaftar (Admin & Finance)
export const getRegistrationStats = async ({ category_id = "" } = {}) => {
  const params = new URLSearchParams();
  if (category_id && category_id !== "ALL") {
    params.append("category_id", category_id);
  }
  const url = `/registrations/stats${params.toString() ? `?${params.toString()}` : ""}`;
  const res = await api.get(url);
  return res.data.data; // { total, verified, not_verified, team, verified_finance, not_verified_finance }
};

// Ambil detail pendaftar by id
export const getRegistrationById = async (id) => {
  const res = await api.get(`/registrations/${id}`);
  return res.data.data;
};

// Patch verifikasi pendaftar (keseluruhan oleh Admin)
export const patchVerifyRegistration = async ({ id, is_verified }) => {
  const res = await api.patch(`/registrations/${id}/verify`, { is_verified });
  return res.data;
};

// Patch feedback pendaftar
export const patchRegistrationFeedback = async ({ id, feedback }) => {
  const res = await api.patch(`/registrations/${id}/feedback`, { feedback });
  return res.data;
};
