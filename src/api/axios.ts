import { useAuthStore } from "@/store/authStore";
import axios from "axios";

const baseURL = "http://localhost:8086/api";

const api = axios.create({ baseURL, withCredentials: true });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
