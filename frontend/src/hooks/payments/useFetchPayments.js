import * as paymentService from "@/services/paymentService";
import { useState } from "react";

export const useFetchPayments = () => {
  const [loading, setLoading] = useState(false);

  const fetchPayments = async (page) => {
    setLoading(true);
    try {
      const res = await paymentService.fetchPayments(page);
      return res
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { error: message };
    } finally {
      setLoading(false);
    }
  };
  return { fetchPayments, loading };
};
