import * as staffService from "@/services/staffService";
import { useState } from "react";

export const useUpdateStaff = () => {
  const [loading, setLoading] = useState(false);

  const updateStaff = async (staffId, staffData) => {
    setLoading(true);
    try {
      const res = await staffService.updateStaff(staffId, staffData);
      return res;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { error: message };
    } finally {
      setLoading(false);
    }
  };

  return { updateStaff, loading };
};
