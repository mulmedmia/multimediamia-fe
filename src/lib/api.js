import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
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
