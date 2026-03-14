import * as paymentService from "@/services/paymentService";
import { useState } from "react";

export const useFetchPaymentStats = () => {
  const [loading, setLoading] = useState(false);

  const fetchPaymentStats = async (month) => {
    setLoading(true);
    try {
      const res = await paymentService.fetchPaymentStats(month);
      return res;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { error: message };
    } finally {
      setLoading(false);
    }
  };

  return { fetchPaymentStats, loading }
};
