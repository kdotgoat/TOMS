import * as authService from "@/services/authService";
import { useStaffStore } from "@/zustand";
import { useState } from "react";

export const useGetCurrentUser = () => {
  const [loading, setLoading] = useState(false);
  const { setStaff } = useStaffStore();

  const getCurrentUser = async () => {
    setLoading(true);
    try {
      const res = await authService.getCurrentUser();
      setStaff(res.staff);
      return { message: res.message };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { error: message };
    } finally {
      setLoading(false);
    }
  };

  return { getCurrentUser, loading };
};
