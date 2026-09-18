import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  requestOtpForgotPassword,
  resetPasswordWithOtp,
} from "@/services/user-forgot-password.service";

/**
 * Hook untuk request OTP forgot password
 */
export const useRequestOtp = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const router = useRouter();

  const handleRequestOtp = async (email) => {
    if (!email) {
      setMessage("Email harus diisi!");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await requestOtpForgotPassword(email);

      setMessage(response.message || "OTP berhasil dikirim ke email Anda!");
      setMessageType("success");

      // Simpan email untuk digunakan di halaman OTP
      Cookies.set("pendingEmail", email, { expires: 1 / 24 }); // 1 jam

      // Redirect ke halaman OTP setelah 1.5 detik
      setTimeout(() => {
        router.push("/forgot-password/otp");
      }, 1500);
    } catch (error) {
      setMessage(error.message || "Gagal mengirim OTP. Silakan coba lagi.");
      setMessageType("error");
      setLoading(false);
    }
  };

  return {
    loading,
    message,
    messageType,
    handleRequestOtp,
  };
};

/**
 * Hook untuk verify OTP dan reset password
 */
export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const router = useRouter();

  const handleResetPassword = async (email, otp, newPassword) => {
    if (!email || !otp || !newPassword) {
      setMessage("Semua field harus diisi!");
      setMessageType("error");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password minimal 6 karakter!");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await resetPasswordWithOtp(email, otp, newPassword);

      setMessage(response.message || "Password berhasil direset!");
      setMessageType("success");

      // Hapus email yang tersimpan
      Cookies.remove("pendingEmail");

      // Redirect ke halaman login setelah 2 detik
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setMessage(
        error.message || "Gagal reset password. Silakan periksa OTP Anda."
      );
      setMessageType("error");
      setLoading(false);
    }
  };

  const handleResendOtp = async (email) => {
    if (!email) {
      setMessage("Email tidak ditemukan!");
      setMessageType("error");
      return;
    }

    setResendLoading(true);
    setMessage("");

    try {
      const response = await requestOtpForgotPassword(email);

      setMessage(response.message || "OTP berhasil dikirim ulang!");
      setMessageType("success");
    } catch (error) {
      setMessage(error.message || "Gagal mengirim ulang OTP.");
      setMessageType("error");
    } finally {
      setResendLoading(false);
    }
  };

  return {
    loading,
    resendLoading,
    message,
    messageType,
    handleResetPassword,
    handleResendOtp,
  };
};
