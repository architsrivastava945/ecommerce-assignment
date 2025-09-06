import express from 'express';
const router = express.Router();
import { addToCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addToCart);

export default router;