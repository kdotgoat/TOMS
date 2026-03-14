import * as orderService from "@/services/orderService";
import { useState } from "react";

export const useUpdateItem = () => {
  const [loading, setLoading] = useState(false);

  const updateOrderItem = async (orderId, itemId, itemData) => {
    setLoading(true);
    try {
      const res = await orderService.updateOrderItem(orderId, itemId, itemData);
      return res;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { error: message };
    } finally {
      setLoading(false);
    }
  };

  const updateSubOrderItem = async (orderId, itemId, subOrderId, itemData) => {
    setLoading(true)
    try{
        const res = await orderService.updateSubOrderItem(orderId, itemId, subOrderId, itemData);
        return res
    } catch(error) {
        const message = error.response?.data?.message || error.message;
        return { error: message };
    }finally {
        setLoading(false);
    }
  }

  return { updateOrderItem, updateSubOrderItem, loading }
};
