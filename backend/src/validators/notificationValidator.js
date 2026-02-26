import {z} from "zod";

// Schema for a single notification
export const NotificationSchema = z.object({
  id: z.string().uuid(),
  message: z.string(),
  order_id: z.string().uuid(),
  created_at: z.string().datetime(),
});

// Array schema
export const NotificationsArraySchema = z.array(NotificationSchema);

