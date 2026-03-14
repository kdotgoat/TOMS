import * as authService from "@/services/authService";
import { useStaffStore } from "@/zustand";
import { useState } from "react";

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { clearStaff } = useStaffStore();

  const logout = async () => {
    setLoading(true);
    try {
      const res = await authService.logout();
      clearStaff();
      return { message: res.message };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { error: message };
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading };
};
