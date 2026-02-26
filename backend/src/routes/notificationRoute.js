import {Router} from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { getNotifications } from "../controllers/notificationController.js";

const router = Router();

router.use(isAuthenticated);

router.get("/", getNotifications);

export default router;