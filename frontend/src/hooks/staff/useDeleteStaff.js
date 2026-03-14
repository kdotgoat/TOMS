import { useState } from "react";
import * as staffService from "@/services/staffService";

export const useDeleteStaff = () => {
  const [loading, setLoading] = useState(false);

  const deleteStaff = async (staffId, password) => {
    setLoading(true);
    try {
      const res = await staffService.deleteStaff(staffId, password);
      return res;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { error: message };
    } finally {
      setLoading(false);
    }
  };

  return { deleteStaff, loading };
};
