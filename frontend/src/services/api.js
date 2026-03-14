import axios from "axios"
import { useStaffStore } from "@/zustand";

const clearStaff = useStaffStore.getState().clearStaff;

const rawApiUrl = import.meta.env.VITE_API_URL?.trim();

const normalizeApiBaseUrl = (url) => {
  if (!url) return "/api";

  const withoutTrailingSlash = url.replace(/\/+$/, "");
  return withoutTrailingSlash.endsWith("/api")
    ? withoutTrailingSlash
    : `${withoutTrailingSlash}/api`;
};

const api = axios.create({
  baseURL: normalizeApiBaseUrl(rawApiUrl),
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response, (error) => {
    if (error.response?.status === 401) {
      clearStaff()
    }
    return Promise.reject(error);
  }
);


export default api
