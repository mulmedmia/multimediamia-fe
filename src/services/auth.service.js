import api from "@/lib/api";

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Gagal terhubung ke server." };
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Gagal terhubung ke server." };
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await api.post("/auth/verify-otp", { email, otp });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "OTP tidak valid atau sudah kadaluarsa." };
  }
};

export const requestOtp = async (email) => {
  try {
    const response = await api.post("/auth/request-otp", { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Gagal mengirim ulang OTP. Silakan coba lagi." };
  }
};