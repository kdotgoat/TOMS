import { apiGet } from "@/api";
import { create } from "zustand";

export const useClothingTypeStore = create((set) => ({
  types: [],
  loading: false,
  error: null,
  message: false,

  // ===== helper function to get all clothing types
  getClothingTypes: async () => {
    set({ loading: true, error: null, message: null });

    const [res, error] = await apiGet("/clothing");

    if (error) return set({ loading: false, error });

    set({
      loading: false,
      message: res.message,
      types: res.types.map((t) => ({
        value: t.id,
        title: t.name,
        mearsurementConfig: t.measurements,
      })),
    });
  },
}));
