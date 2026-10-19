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
  if (filters.registration_id) {
    params.append("registration_id", filters.registration_id);
  }
  const queryString = params.toString() ? `?${params.toString()}` : "";
  const res = await api.get(`/missions${queryString}`);
  return res.data.data;
};

/**
 * Mengambil detail satu misi harian beserta status pengumpulan user.
 * @param {string} id - Mission ID
 * @param {object} params - Optional { registration_id, category_id }
 */
export const getMissionDetail = async (id, filters = {}) => {
  const params = new URLSearchParams();
  if (filters.registration_id) {
    params.append("registration_id", filters.registration_id);
  }
  if (filters.category_id) {
    params.append("category_id", filters.category_id);
  }
  const queryString = params.toString() ? `?${params.toString()}` : "";
  const res = await api.get(`/missions/${id}${queryString}`);
  return res.data.data;
};

/**
 * Mengirimkan link pengumpulan tugas misi harian.
 * @param {string} id - Mission ID
 * @param {{ submission_url: string, notes?: string, registration_id?: string, category_id?: string }} payload
 */
export const submitMission = async ({
  id,
  submission_url,
  notes,
  registration_id,
  category_id,
}) => {
  const res = await api.post(`/missions/${id}/submit`, {
    submission_url,
    notes,
    registration_id,
    category_id,
  });
  return res.data.data;
};
