import * as orderService from "@/services/orderService";
import { useOrderStore } from "@/zustand/ordersStore";

export const useGetAllOrders = () => {
  const { setOrders, setPagination, clearOrders, clearPagination, setLoading } = useOrderStore();

  const getAllOrders = async (page) => {
    setLoading(true);
    clearOrders()
    clearPagination()
    try {
      const res = await orderService.getAllOrders(page);
      if (res.orders) setOrders(res.orders);
      if (res.pagination) setPagination(res.pagination);
      return { message: res.message };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { error: message };
    } finally {
      setLoading(false);
    }
  };

  return { getAllOrders }
};
