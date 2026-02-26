import {z} from 'zod'

export const filterOptionsSchema = z.object({
    type: z.enum(["INDIVIDUAL", "GROUP"], {message: "Invalid order type"}).optional(),
    status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"], {message: "Invalid order status"}).optional(),
    delivery: z.enum(['DELIVERED', 'PENDING'], {message: "Invalid delivery status"}).optional()
})