import api from "@/lib/api";

export const getCategories = async () => {
  try {
    const response = await api.get("/categories");
    const result = response.data.data;
    return result.categories;
  } catch (error) {
    console.error("Gagal mengambil kategori:", error);
    return [];
  }
};

export const getMyRegistrations = async (userId) => {
  if (!userId) {
    return [];
  }
  try {
    const response = await api.get(`/registrations?user_id=${userId}`);
    return response.data.data.registrations;
  } catch (error) {
    console.error("Gagal mengambil data registrasi:", error);
    throw error;
  }
};

export const submitCompetitionRegistration = async (registrationData) => {
  try {
    const response = await api.post("/registrations", registrationData);
    return response.data.data;
  } catch (error) {
    console.error("Gagal mendaftar lomba:", error);
    throw error.response?.data || error;
  }
};

/**
 * Mengambil data leaderboard untuk sebuah kategori.
 * @param {string} categoryId - ID dari kategori lomba.
 * @returns {Promise<Array>}
 */
export const getLeaderboard = async (categoryId) => {
  try {
    const response = await api.get(`/leaderboard/${categoryId}`);
    return response.data.data;
  } catch (error) {
    console.error("Gagal mengambil data leaderboard:", error);
    return []; 
  }
};

/**
 * Mengambil jadwal untuk sebuah kompetisi.
 * @param {string} competitionId - ID dari kompetisi.
 * @returns {Promise<Array>}
 */
export const getCompetitionSchedule = async (competitionId) => {
  try {
    const response = await api.get(`/competitions/${competitionId}/schedule`);
    return response.data.data;
  } catch (error) {
    console.error("Gagal mengambil jadwal kompetisi:", error);
    return [];
  }
};
