import * as authService from "@/services/authService";
import { useStaffStore } from "@/zustand";
import { useState } from "react";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const {setStaff} = useStaffStore()

  const login = async (data) => {
    setLoading(true);
    try {
      const res = await authService.login(data);
      setStaff(res.staff)
      return {message: res.message}
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { error: message };
    } finally {
      setLoading(false);
    }
  };

  return {login, loading}
};
