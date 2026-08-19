import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  login,
  register,
  verifyOtp,
  requestOtp,
} from "@/services/auth.service";
import Cookies from "js-cookie";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      const data = await login(email, password);
      setMessageType("success");
      setMessage("Login berhasil! Anda akan diarahkan...");
      Cookies.set("authToken", data.data.token);
      return data;
    } catch (err) {
      setMessageType("error");

      const errorMessage = err.message || "Email atau password salah.";

      if (
        errorMessage.toLowerCase().includes("verify") ||
        errorMessage.toLowerCase().includes("verification") ||
        errorMessage.toLowerCase().includes("not verified") ||
        errorMessage.toLowerCase().includes("belum terverifikasi")
      ) {
        setMessage(
          "Please re-register with the same email to get verified by clicking Daftar di Sini"
        );
        setMessageType("warning");
      } else {
        setMessage(errorMessage);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    message,
    messageType,
    handleLogin,
    setMessage,
    setMessageType,
  };
}

export function useRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const handleRegister = async (fullname, email, password) => {
    setLoading(true);
    setMessage("");
    try {
      const data = await register(fullname, email, password);
      setMessage("Registrasi berhasil. OTP telah dikirim ke email Anda.");
      setMessageType("success");
      Cookies.set("pendingEmail", email);
      router.push("/register/otp");
    } catch (err) {
      setMessageType("error");

      // Check jika error adalah email sudah terdaftar
      const errorMessage = err.message || "Registrasi gagal.";
      const isEmailAlreadyRegistered =
        errorMessage.toLowerCase().includes("email") &&
        (errorMessage.toLowerCase().includes("already") ||
          errorMessage.toLowerCase().includes("sudah") ||
          errorMessage.toLowerCase().includes("terdaftar"));

      if (isEmailAlreadyRegistered) {
        try {
          // Kirim OTP ke email yang sudah terdaftar
          await requestOtp(email);
          setMessage(
            "Email sudah terdaftar. OTP baru telah dikirim untuk verifikasi."
          );
          setMessageType("success");
          Cookies.set("pendingEmail", email);
          // Redirect ke halaman OTP
          setTimeout(() => {
            router.push("/register/otp");
          }, 1500);
        } catch (otpError) {
          setMessage(
            "Email sudah terdaftar. Silakan coba login atau hubungi admin."
          );
        }
      } else {
        setMessage(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    message,
    messageType,
    handleRegister,
    setMessage,
    setMessageType,
  };
}

export function useOtp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const handleVerifyOtp = async (email, otp) => {
    setLoading(true);
    setMessage("");
    if (!/^\d{6}$/.test(otp)) {
      setMessage("OTP harus terdiri dari 6 digit angka.");
      setMessageType("error");
      setLoading(false);
      return false;
    }
    try {
      await verifyOtp(email, otp);
      setMessage("Verifikasi berhasil! Anda bisa login sekarang.");
      setMessageType("success");
      Cookies.remove("pendingEmail");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
      return true;
    } catch (err) {
      setMessageType("error");
      setMessage(err.message || "OTP tidak valid atau sudah kadaluarsa.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (email) => {
    if (!email) {
      setMessage("Email tidak ditemukan. Silakan daftar terlebih dahulu.");
      setMessageType("error");
      return;
    }
    setResendLoading(true);
    setMessage("");
    try {
      await requestOtp(email);
      setMessage("Kode OTP baru telah dikirim ke email Anda.");
      setMessageType("success");
    } catch (err) {
      setMessage(err.message || "Gagal mengirim ulang OTP. Silakan coba lagi.");
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
    handleVerifyOtp,
    handleResendOtp,
    setMessage,
    setMessageType,
  };
}
