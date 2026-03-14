import * as orderService from "@/services/orderService";
import { useState } from "react";

export const useGetOrder = () => {
  const [loading, setLoading] = useState(false);

  const getOrder = async (orderId) => {
    setLoading(true);
    try {
      const res = await orderService(orderId);
      return res;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { error: message };
    } finally {
      setLoading(false);
    }
  };

  return { getOrder, loading };
};
