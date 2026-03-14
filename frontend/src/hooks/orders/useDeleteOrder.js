import * as orderService from "@/services/orderService";
import { useState } from "react";

export const useDeleteOrder = () => {
  const [loading, setLoading] = useState(false);

  const deleteOrder = async (orderId, password) => {
    setLoading(true);
    try {
      const res = await orderService.deleteOrder(orderId, password);
      return res;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { error: message };
    } finally {
      setLoading(false);
    }
  };

  return { deleteOrder, loading }
};
