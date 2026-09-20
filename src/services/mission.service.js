import api from "@/lib/api";

/**
 * Mengambil seluruh daftar misi harian aktif beserta status pengumpulan milik user.
 * @param {object} filters
 */
export const getMissions = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category_id) {
    params.append("category_id", filters.category_id);
  }
  const queryString = params.toString() ? `?${params.toString()}` : "";
  const res = await api.get(`/missions${queryString}`);
  return res.data.data;
};

/**
 * Mengambil detail satu misi harian beserta status pengumpulan user.
 * @param {string} id - Mission ID
 */
export const getMissionDetail = async (id) => {
  const res = await api.get(`/missions/${id}`);
  return res.data.data;
};

/**
 * Mengirimkan link pengumpulan tugas misi harian.
 * @param {string} id - Mission ID
 * @param {{ submission_url: string, notes?: string }} payload
 */
export const submitMission = async ({ id, submission_url, notes }) => {
  const res = await api.post(`/missions/${id}/submit`, {
    submission_url,
    notes,
  });
  return res.data.data;
};
