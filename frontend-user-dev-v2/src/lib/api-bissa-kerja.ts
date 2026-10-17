import axios from "axios";
import Cookies from "js-cookie";

const apiBissaKerja = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BISSA_KERJA_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor: Inject token sebelum setiap request
apiBissaKerja.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fungsi untuk memeriksa status login
export const checkLoginStatus = async (): Promise<boolean> => {
  const token = Cookies.get("token");
  if (!token) {
    return false;
  }

  try {
    // Coba akses endpoint yang memerlukan autentikasi, misalnya /auth/me
    await apiBissaKerja.get("/auth/me");
    return true;
  } catch (error) {
    console.error("Error checking login status:", error);
    // Jika token tidak valid, hapus dari cookies
    Cookies.remove("token");
    return false;
  }
};

export default apiBissaKerja;