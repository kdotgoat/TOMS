import * as orderService from "@/services/orderService";
import { useSingleOrderStore } from "@/zustand";
import { useState } from "react";

export const useUpdateOrder = () => {
  const [loading, setLoading] = useState(false);
  const { order } = useSingleOrderStore();
  const { id, name, phoneNumber, type, status, delivery, dueDate } = order

  const updateOrder = async() => {
    setLoading(true)
    try{
        const res = await orderService.updateOrder(order.id, {
            id, name, phoneNumber, type, status, delivery, dueDate
        })
        return res
    } catch(error) {
        const message = error.response?.data?.message || error.message;
        return { error: message };
    } finally {
        setLoading(false)
    }
  }

  return { updateOrder, loading }
};
