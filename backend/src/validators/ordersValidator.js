import { z } from "zod";

// Schema for a sub-order item
export const subOrderItemSchema = z.object({
  clothingTypeId: z
    .string()
    .trim()
    .nonempty({ message: "Clothing type id is required" }),
  price: z
    .number()
    .int()
    .nonnegative({ message: "Price must be a positive number" }),
  measurements: z.record(z.any()), // JSON object for measurements
});

// Schema for a main order item
export const orderItemSchema = z.object({
  clothingTypeId: z
    .string()
    .trim()
    .nonempty({ message: "Clothing type id is required" }),
  price: z
    .number()
    .int()
    .nonnegative({ message: "Price must be a positive number" }),
  measurements: z.record(z.any()), // JSON object for measurements
  subOrder: z.array(subOrderItemSchema).optional(), // optional array of sub-orders
});

// Main order schema
export const newOrderSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty({ message: "Name is required" })
    .transform((val) =>
      val
        .split(/\s+/) // split by spaces (handles multiple spaces too)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")
    ),
  phoneNumber: z
    .string()
    .trim()
    .nonempty({ message: "Phone number is required" }),
  type: z.enum(["INDIVIDUAL", "GROUP"], {
    required_error: "Order type is required",
  }),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  orderItems: z
    .array(orderItemSchema)
    .nonempty({ message: "At least one order item is required" }),
});

// 
export const updateOrderSchema = newOrderSchema.partial().extend({
  type: z.enum(["INDIVIDUAL", "GROUP"]).optional(),
  status: z
    .enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
    .optional(),
  delivery: z.enum(["PENDING", "DELIVERED"]).optional(),
});
export const searchOrderSchema = z.object({
  phoneNumber: z.string().trim().optional(),
  name: z.string().trim().optional(),
  type: z.enum(["INDIVIDUAL", "GROUP"]).optional(),
  status: z
    .enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
    .optional(),
  delivery: z.enum(["PENDING", "DELIVERED"]).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Schema for adding a new order item.
export const addOrderItemSchema = z.object({
  clothingTypeId: z
    .string()
    .trim()
    .nonempty({ message: "Clothing type id is required" }),
  price: z
    .number()
    .int()
    .nonnegative({ message: "Price must be a positive number" }),
  measurements: z.record(z.any()), // JSON object for measurements
  subOrder: z.array(subOrderItemSchema).optional(), // optional array of sub-orders
});

// Schema for adding a new sub-order item 
export const addSubOrderItemSchema = z.object({
  clothingTypeId: z
    .string()
    .trim()
    .nonempty({ message: "Clothing type id is required" }),
  price: z
    .number()
    .int()
    .nonnegative({ message: "Price must be a positive number" }),
  measurements: z.record(z.any()), // JSON object for measurements
});
export const updateOrderItemSchema = orderItemSchema.partial()
export const updateSubOrderItemSchema = subOrderItemSchema.partial()