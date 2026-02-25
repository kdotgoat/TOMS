import {Router} from 'express';
import { newClothing,getAllClothingTypes } from '../controllers/clothingController.js';
import { isAuthenticated,adminOnly } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(isAuthenticated);

router.post('/', adminOnly,newClothing);
router.get('/', newClothing,getAllClothingTypes);

export default router;