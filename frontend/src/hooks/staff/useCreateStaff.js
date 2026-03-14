import { useState } from "react";
import * as staffService from "@/services/staffService";

export const useCreateStaff = () => {
  const [loading, setLoading] = useState(false);

  const createStaff = async (staffData) => {
    setLoading(true);

    try {
      const res = await staffService.createStaff(staffData);
      return res;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { error: message };
    } finally {
      setLoading(false);
    }
  };

  return { createStaff, loading };
};
