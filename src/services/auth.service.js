import api from "@/lib/api";

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Gagal terhubung ke server." };
  }
};

export const register = async (fullname, email, password) => {
  try {
    const response = await api.post("/auth/register", {
      name: fullname,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Gagal terhubung ke server." };
  }
};