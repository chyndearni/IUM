// lib/axios.ts
import axios from "axios";
import Cookies from "js-cookie";
import { redirect } from "next/navigation"; // hanya untuk redirect jika perlu

const token = Cookies.get("token");
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BISSA_KERJA_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
});

// Request Interceptor: Tambah token sebelum request
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Tangani error global (401, 403, dll)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Token expired or unauthorized");

      // Optional: bersihkan token & redirect ke login
      Cookies.remove("token");
      Cookies.remove("role");
      Cookies.remove("isLogin");

      // Optional: redirect (gunakan Next Router)
      if (typeof window !== "undefined") {
        redirect("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
