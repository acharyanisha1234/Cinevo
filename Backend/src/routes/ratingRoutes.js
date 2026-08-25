import express from 'express';
import { setRating, getRating } from '../controllers/ratingController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/:movieId').get(protect, getRating).post(protect, setRating);

export default router;