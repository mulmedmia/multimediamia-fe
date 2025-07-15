import api from "@/lib/api";

export const getCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data.data.categories;
  } catch (error) {
    console.error("Gagal mengambil kategori:", error);
    throw error;
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