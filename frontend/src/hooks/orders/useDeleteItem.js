import * as orderService from "@/services/orderService";
import { useState } from "react";

export const useDeleteItem = () => {
  const [loading, setLaoding] = useState(false);

  const deleteItem = async (orderId, itemId) => {
    setLaoding(true);
    try {
      const res = await orderService.deleteOrderItem(orderId, itemId);
      return res;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { error: message };
    } finally {
      setLaoding(false);
    }
  };

  const deleteSubOrderItem = async (orderId, itemId, subOrderId) => {
    setLaoding(true);
    try {
      const res = await orderService.deleteSubOrderItem(orderId, itemId, subOrderId);
      return res;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { error: message };
    } finally {
      setLaoding(false);
    }
  };

  return { deleteItem, deleteSubOrderItem, loading };
};
