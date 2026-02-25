import { Router } from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  newOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  updateOrderItem,
  deleteOrderItem,
  deleteSubOrderItem,
  updateSubOrderItems,
  orderStats,
  getPaymentsByOrderId,
  addOrderItem,
  addSubOrderItem,
} from "../controllers/ordersController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  newOrderSchema,
  updateOrderItemSchema,
  updateOrderSchema,
  updateSubOrderItemSchema,
  addOrderItemSchema,
  addSubOrderItemSchema,
} from "../validators/ordersValidator.js";

const router = Router();

router.use(isAuthenticated);

router.get("/", getAllOrders);
router.post("/", validateRequest(newOrderSchema), newOrder);

//  Stats
router.get("/stats", orderStats);

//  Orders
router.post("/:id", validateRequest(), addOrderItem)
router.get("/:id", getOrderById);
router.patch("/:id", validateRequest(updateOrderSchema), updateOrder);
router.delete("/:id", deleteOrder);

// Order Items
router.patch(
  "/:id/items/:itemId",
  validateRequest(updateOrderItemSchema),
  updateOrderItem
);
router.delete("/:id/items/:itemId", deleteOrderItem);

//  Add Order Items
router.post("/:id/items", validateRequest(addOrderItemSchema), addOrderItem);

// Add Sub-Order Items
router.post(
  "/:id/items/:itemId/suborders",
  validateRequest(addSubOrderItemSchema),
  addSubOrderItem
);

// Sub Order Items
router.patch(
  "/:id/items/:itemId/suborders/:subOrderId",
  validateRequest(updateSubOrderItemSchema),
  updateSubOrderItems
);
router.delete("/:id/items/:itemId/suborders/:subOrderId", deleteSubOrderItem);

//  Payments
router.get("/:id/payments/", getPaymentsByOrderId);

export default router;
