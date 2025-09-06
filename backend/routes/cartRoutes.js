import express from 'express';
const router = express.Router();
import { addToCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';
import { getCart, removeFromCart } from '../controllers/cartController.js';

router
  .route('/')
  .post(protect, addToCart)
  .get(protect, getCart);

router.route('/:productId').delete(protect, removeFromCart);

export default router;