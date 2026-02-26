import {Router} from "express";
import { filterOptionsSchema } from "../validators/searchValidator.js";
import { searchedOrders,filterOrders } from "../controllers/searchController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = Router();
router.use(isAuthenticated);
router.get("/", searchedOrders);
router.post("/filter", validateRequest(filterOptionsSchema), filterOrders);

export default router;