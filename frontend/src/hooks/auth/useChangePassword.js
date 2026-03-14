import * as authService from "@/services/authService";
import { useState } from "react";

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);

  const changePassword = async (data) => {
    setLoading(true);
    try {
      const res = await authService.changePassword(data);
      return res;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { error: message };
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading };
};
