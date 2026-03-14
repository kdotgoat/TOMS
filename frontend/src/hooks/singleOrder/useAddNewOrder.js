import * as singleOrderService from "@/services/singleOrderService";
import { useSingleOrderStore } from "@/zustand";
import { useState } from "react";

export const useAddNewOrder = () => {
  const [loading, setLoading] = useState(false);
  const { order } = useSingleOrderStore();

  const addNewOrder = async () => {
    setLoading(true);
    try {
      const { name, phoneNumber, type, dueDate, items } = order;
      const res = await singleOrderService.addNewOrder({
        name,
        phoneNumber,
        type,
        dueDate,
        orderItems: items,
      });
      return res;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { error: message };
    } finally {
      setLoading(false);
    }
  };

  return { addNewOrder, loading };
};
