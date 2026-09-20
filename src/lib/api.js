import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 45000, // 45 detik untuk mengantisipasi cold-start Render free tier
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    let token;
    if (typeof window !== "undefined") {
      token = Cookies.get("authToken");
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If request data is FormData, remove Content-Type header so browser/axios sets multipart/form-data with the correct boundary
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes("/auth/");
    const isLoginPage =
      typeof window !== "undefined" && window.location.pathname === "/login";

    if (error.response?.status === 401 && !isAuthEndpoint && !isLoginPage) {
      if (typeof window !== "undefined") {
        Cookies.remove("authToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
