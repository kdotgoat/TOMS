import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest.js";
import { isAuthenticated,adminOnly } from "../middlewares/authMiddleware.js";
import {addPayment,deletePayment,getAllPayments,getPaymentById,paymentStats,updatePayment,} from "../controllers/paymentController.js";
import {addPaymentSchema,updatePaymentSchema,} from "../validators/paymentValidator.js"

const router = Router();
router.use(isAuthenticated);

router.post("/", validateRequest(addPaymentSchema), addPayment);
router.get("/", adminOnly, getAllPayments);

router.get("/stats", adminOnly, paymentStats);

router.get("/:id", getPaymentById);
router.patch("/:id", validateRequest(updatePaymentSchema), updatePayment);
router.delete("/:id", deletePayment);

export default router;