import * as staffService from "@/services/staffService";
import { useState } from "react";

export const useFetchStaff = () => {
  const [loading, setLoading] = useState(false);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await staffService.fetchStaff();
      return res;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { error: message };
    } finally {
      setLoading(false);
    }
  };

  return { fetchStaff, loading };
};
