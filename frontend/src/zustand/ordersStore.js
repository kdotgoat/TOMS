import { apiGet, apiPost } from "@/api";
import { create } from "zustand";

export const useOrderStore = create((set) => ({
  orders: [],
  pagination: {},
  loading: false,
  page: 1,
  error: "",
  message: "",

  nextPage: () =>
    set((state) => ({
      page: state.page + 1,
    })),

  prevPage: () =>
    set((state) => ({
      page: state.page > 1 ? state.page - 1 : 1, // prevent going below 1
    })),

  setOrders: (data) => {
    set({
      orders: data.map((order) => ({
        id: order.id,
        name: order.name,
        type: order.type,
        status: order.status,
        delivery: order.delivery,
        totalPrice: order.totalPrice,
        totalPayments: order.totalPayments,
      })),
    });
  },

  setPagination: (data) => {
    set({ pagination: data });
  },
  clearOrders: () => {
    set({ orders: [] });
  },
  clearPagination: () => {
    set({ pagination: {} });
  },
  setLoading: (bool) => {
    set({ loading: bool });
  },

  // ===== API: filter orders
  filterOrders: async (page, data) => {
    set({ loading: true, error: "", message: "", page: 1 });

    const [res, error] = await apiPost(`/search/filter?page=${page}`, data);

    if (error) return set({ loading: false, error });

    set({
      loading: false,
      message: res.message || "",
      orders: res.orders?.map((order) => ({
        id: order.id,
        name: order.name,
        type: order.type,
        status: order.status,
        delivery: order.delivery,
        totalPrice: order.totalPrice,
        totalPayments: order.totalPayments,
      })),
      pagination: res.pagination || {},
    });
  },
}));
