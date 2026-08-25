import express from 'express';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../controllers/watchlistController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').get(protect, getWatchlist);
router.route('/:movieId').post(protect, addToWatchlist).delete(protect, removeFromWatchlist);

export default router;