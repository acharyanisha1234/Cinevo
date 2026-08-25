import express from 'express';
import { getHistory, updateHistory, deleteHistory } from '../controllers/historyController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').get(protect, getHistory).post(protect, updateHistory);
router.delete('/:movieId', protect, deleteHistory);

export default router;