import {createNewStaff,updateStaff,deleteStaff,getAllStaff,getStaffById} from '../controllers/staffController.js';
import {isAuthenticated,adminOnly} from "../middlewares/authMiddleware.js";
import {updateStaffSchema,createNewStaffSchema} from "../validators/staffValidator.js"
import { validateRequest } from '../middlewares/validateRequest.js';
import express from 'express';
const router = express.Router();

router.use(isAuthenticated);

router.post("/", adminOnly,validateRequest(createNewStaffSchema),createNewStaff);
router.get("/getAllStaff", adminOnly,getAllStaff);
router.get("/:id",adminOnly,getStaffById);
router.patch("/:id", adminOnly,validateRequest(updateStaffSchema),updateStaff);
router.delete ("/:id", adminOnly,deleteStaff);

export default router;