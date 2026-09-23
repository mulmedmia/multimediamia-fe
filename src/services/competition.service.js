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

export const getRegistrationById = async (registrationId) => {
  try {
    const response = await api.get(`/registrations/${registrationId}`);
    return response.data.data;
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

// Update registration (team name & members)
export const updateRegistration = async (registrationId, data) => {
  const res = await api.patch(`/registrations/${registrationId}`, data);
  return res.data;
};

// Check if team name is available in a category
export const checkTeamNameAvailability = async (categoryId, teamName, excludeId = null) => {
  if (!categoryId || !teamName || !teamName.trim()) {
    return { available: true };
  }
  const params = new URLSearchParams({
    category_id: categoryId,
    team_name: teamName.trim(),
  });
  if (excludeId) {
    params.append("exclude_id", excludeId);
  }
  const res = await api.get(`/registrations/check-team-name?${params.toString()}`);
  return res.data.data;
};

export const deleteRegistration = async (registrationId) => {
  try {
    const response = await api.delete(`/registrations/${registrationId}`);
    return response.data;
  } catch (error) {
    console.error("Gagal menghapus pendaftaran:", error);
    throw error;
  }
};

/**
 * Mengambil data leaderboard untuk sebuah kategori.
 * @param {string} categoryId - ID dari kategori lomba.
 * @returns {Promise<Array>}
 */
export const getLeaderboard = async (categoryId) => {
  try {
    const response = await api.get(`/gamification/${categoryId}`);
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
  return [];
};
