import api from "@/lib/api";

/**
 * Request OTP untuk reset password
 * @param {string} email - Email pengguna
 * @returns {Promise} Response dari API
 */
export const requestOtpForgotPassword = async (email) => {
  try {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Reset password dengan OTP
 * @param {string} email - Email pengguna
 * @param {string} otp - Kode OTP
 * @param {string} newPassword - Password baru
 * @returns {Promise} Response dari API
 */
export const resetPasswordWithOtp = async (email, otp, newPassword) => {
  try {
    const response = await api.post("/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
