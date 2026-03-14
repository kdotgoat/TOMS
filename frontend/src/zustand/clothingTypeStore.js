import { apiGet } from "@/api";
import { create } from "zustand";

const normalizeClothingTypeError = (errorMessage) => {
  if (!errorMessage) return "Failed to load clothing types.";

  return errorMessage;
};

export const useClothingTypeStore = create((set) => ({
  types: [],
  loading: false,
  error: null,
  message: false,

  // ===== helper function to get all clothing types
  getClothingTypes: async () => {
    set({ loading: true, error: null, message: null });

    const [res, error] = await apiGet("/clothingTypes");

    if (error) {
      const normalizedError = normalizeClothingTypeError(error);

      set({ loading: false, error: normalizedError, types: [] });
      return { success: false, error: normalizedError };
    }

    const rawTypes =
      (Array.isArray(res?.types) && res.types) ||
      (Array.isArray(res?.clothingTypes) && res.clothingTypes) ||
      [];

    const types = rawTypes
      .filter((t) => t?.id && t?.name)
      .map((t) => ({
        value: t.id,
        title: t.name,
        mearsurementConfig: Array.isArray(t.measurements) ? t.measurements : [],
      }));

    if (types.length === 0) {
      const noTypesMessage =
        res?.message || "No clothing types were returned by the backend.";

      set({
        loading: false,
        error: noTypesMessage,
        message: noTypesMessage,
        types: [],
      });

      return { success: false, error: noTypesMessage };
    }

    set({
      loading: false,
      message: res.message,
      error: null,
      types,
    });

    return { success: true, types };
  },
}));
