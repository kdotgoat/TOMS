import { z } from "zod";

export const createNewStaffSchema = z.object({
  firstName: z
    .string()
    .trim()
    .nonempty({ message: "First name is required" })
    .transform((val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()),
  lastName: z
    .string()
    .trim()
    .nonempty({ message: "Last name is required" })
    .transform((val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()),
  phoneNumber: z
    .string()
    .trim()
    .nonempty({ message: "Phone number is required" })
    .regex(/^(?:07|01)\d{8}$/, {
      message: "Invalid phone number",
    }),
    role: z.enum(["ADMIN", "STAFF"])
});

export const updateStaffSchema = createNewStaffSchema
  .partial()
  .extend({
    password: z
      .string()
      .trim()
      .min(8, { message: "Password must be at least 8 characters long" }).optional(),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });