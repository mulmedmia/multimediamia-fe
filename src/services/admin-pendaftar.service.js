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

  const url = `/registrations?${params.toString()}`;
  console.log("=== API CALL ===");
  console.log("URL:", url);
  console.log("Params:", { page, limit, category, search });
  console.log("================");

  const res = await api.get(url);
  console.log("=== API RESPONSE ===");
  console.log("Status:", res.status);
  console.log("Data count:", res.data.data?.registrations?.length);
  console.log("====================");
  
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