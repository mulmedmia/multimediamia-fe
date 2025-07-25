import api from "@/lib/api";

/**
 * Ambil profil user saat ini
 * @returns {Promise<Object>}
 */
export const getUserProfile = async () => {
  const res = await api.get("/users/profile");
  return res.data.data;
};

/**
 * Update profil user
 * @param {Object} payload - Data yang akan diupdate
 * @returns {Promise<Object>}
 */
export const updateUserProfile = async (payload) => {
  const res = await api.patch("/users/profile", payload);
  return res.data.data;
};