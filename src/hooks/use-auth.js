import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, register, verifyOtp, requestOtp } from "@/services/auth.service";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const handleLogin = async (email, password) => {
    setLoading(true);
    setMessage("");
    try {
      const data = await login(email, password);
      setMessageType("success");
      setMessage("Login berhasil! Anda akan diarahkan...");
      localStorage.setItem("authToken", data.data.token);

      return data; 

    } catch (err) {
      setMessageType("error");
      setMessage(err.message || "Email atau password salah.");
      
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
      localStorage.setItem("pendingEmail", email);
      router.push("/register/otp");
    } catch (err) {
      setMessageType("error");
      setMessage(err.message || "Registrasi gagal. Email sudah terdaftar.");
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
      localStorage.removeItem("pendingEmail");
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