import { z } from "zod";

export const newEmployeeSchema = z.object({
    firstName: z
    .string()
    .trim()
    .nonempty({ message: "First name is required" })
    .transform((val) => val.toLowerCase()),
    lastName: z
    .string()
    .trim()
    .nonempty({ message: "Last name is required" })
    .transform((val) => val.toLowerCase()),
    phoneNumber: z
    .string()
    .trim()
    .nonempty({ message: "Phone number is required" })
    .regex(/^(?:07|01)\d{8}$/, {
    message: "Invalid phone number",
    }),
    role: z.enum(["ADMIN", "STAFF"]).optional(),
});

export const loginSchema = newEmployeeSchema.partial().extend({
    password: z.string().nonempty()
})