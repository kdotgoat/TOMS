import express from 'express';
import { registerStaff,login,logout,getCurrentUser,updatePassword } from '../controllers/authController.js';
import { isAuthenticated,adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post ("/login", login);
router.post("/registerStaff", isAuthenticated,adminOnly,registerStaff);
router.get ("/me",isAuthenticated,getCurrentUser );
router.post("/logout", isAuthenticated,logout);
router.put("/updatePassword", isAuthenticated,updatePassword);



export default router;