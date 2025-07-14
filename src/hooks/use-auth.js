import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "@/services/auth.service";

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
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err) {
      setMessageType("error");
      setMessage(err.message || "Email atau password salah.");
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

// Exporting the useAuth hook for use in other components
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