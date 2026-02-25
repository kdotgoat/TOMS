import { z } from "zod";

export const addPaymentSchema = z.object({
  amount: z
    .number()
    .int()
    .nonnegative({ message: "Amount must be a valid number" }),
  mode: z.enum(["CASH", "MPESA", "BANK_TRANSFER"]),
  reference: z
    .string()
    .trim()
    .transform((val) => val.toUpperCase())
    .optional(),
  orderId: z.string().trim(),
});

export const updatePaymentSchema = addPaymentSchema.partial();