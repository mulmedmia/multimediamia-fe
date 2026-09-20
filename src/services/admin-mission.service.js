import api from "@/lib/api";

/**
 * Mengambil daftar seluruh misi harian untuk Admin.
 * @param {object} params - query params { status, search, page, limit }
 */
export const getAdminMissions = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);
  if (params.search) query.append("search", params.search);
  if (params.category_id) query.append("category_id", params.category_id);
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);

  const res = await api.get(`/admin/missions?${query.toString()}`);
  return res.data.data;
};

/**
 * Mengambil detail satu misi harian berdasarkan ID.
 * @param {string} id - Mission ID
 */
export const getAdminMission = async (id) => {
  const res = await api.get(`/admin/missions/${id}`);
  return res.data.data;
};

/**
 * Membuat misi harian baru.
 * @param {object} payload
 */
export const createAdminMission = async (payload) => {
  const res = await api.post("/admin/missions", payload);
  return res.data.data;
};

/**
 * Mengedit data misi harian.
 * @param {{ id: string, data: object }} param
 */
export const updateAdminMission = async ({ id, data }) => {
  const res = await api.put(`/admin/missions/${id}`, data);
  return res.data.data;
};

/**
 * Menghapus data misi harian.
 * @param {string} id
 */
export const deleteAdminMission = async (id) => {
  const res = await api.delete(`/admin/missions/${id}`);
  return res.data.data;
};

/**
 * Mengambil daftar pengumpulan peserta pada misi tertentu.
 * @param {string} missionId
 * @param {object} params - query params { status, search, category_id, page, limit }
 */
export const getAdminMissionSubmissions = async (missionId, params = {}) => {
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);
  if (params.search) query.append("search", params.search);
  if (params.category_id) query.append("category_id", params.category_id);
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);

  const targetId = missionId || "all";
  const res = await api.get(`/admin/missions/${targetId}/submissions?${query.toString()}`);
  return res.data.data;
};

/**
 * Review pengumpulan peserta (ACC / Reject) + pemberian XP & Diamond secara atomik.
 * @param {{ submissionId: string, data: { status: "APPROVED" | "REJECTED", awarded_xp?: number, awarded_diamond?: number, admin_feedback?: string } }} param
 */
export const reviewAdminSubmission = async ({ submissionId, data }) => {
  const res = await api.post(`/admin/submissions/${submissionId}/review`, data);
  return res.data.data;
};
