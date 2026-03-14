import * as orderService from "@/services/orderService";
import { useState } from "react";

export const useAddItem = () => {
  const [loading, setLaoding] = useState(false);

  const addItem = async (orderId, itemData) => {
    setLaoding(true);
    try {
      const res = await orderService.addOrderItem(orderId, itemData);
      return res;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { error: message };
    } finally {
      setLaoding(false);
    }
  };

  const addSubOrderItem = async (orderId, itemId, subOrderData) => {
    setLaoding(true);
    try {
        const res = await orderService.addSubOrderItem(orderId, itemId, subOrderData)
        return res
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { error: message };
    } finally {
      setLaoding(false);
    }
  };

  return { addItem, addSubOrderItem, loading };
};
