import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStaffStore = create(
  persist(
    (set) => ({
      staff: null,
      setStaff: (staff) => {
        set({
          staff: {
            id: staff.id,
            firstName: staff.first_name,
            lastName: staff.last_name,
            phoneNumber: staff.phone_number,
            role: staff.role
          }
        })
      },
      clearStaff: () => {
        set({ staff: null })
      }
    }),
    {
      name: "staff-storage", // The name of the key in localStorage
    }
  )
);