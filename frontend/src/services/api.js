import axios from "axios"
import { useStaffStore } from "@/zustand";

const clearStaff = useStaffStore.getState().clearStaff;

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
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