import * as singleOrderService from "@/services/singleOrderService";
import { useSingleOrderStore } from "@/zustand";
import { useState } from "react";

export const useGetOrderById = () => {
  const [loading, setLoading] = useState(false);
  const {setOrder} = useSingleOrderStore()

  const getOrderById = async (orderId) => {
    setLoading(true);
    try {
      const res = await singleOrderService.getOrderById(orderId);
      if(res.orderData) setOrder(res.orderData)
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { error: message };
    } finally {
      setLoading(false);
    }
  };

  return { getOrderById, loading };
};
