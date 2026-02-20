import express from 'express';
import { registerStaff,login,logout,getCurrentUser,updatePassword } from '../controllers/authController.js';
import { isAuthenticated,adminOnly} from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { loginSchema,newEmployeeSchema } from '../validators/authValidator.js';

const router = express.Router();

router.post ("/login", validateRequest(loginSchema),login);
router.post("/registerStaff", isAuthenticated,adminOnly,validateRequest(newEmployeeSchema),registerStaff);
router.get ("/me",isAuthenticated,getCurrentUser );
router.post("/logout", isAuthenticated,logout);
router.put("/updatePassword", isAuthenticated,updatePassword);



export default router;