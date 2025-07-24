import api from "@/lib/api";

// Ambil semua pendaftar
export const getAllRegistrations = async () => {
  const res = await api.get("/registrations");
  return res.data.data.registrations;
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