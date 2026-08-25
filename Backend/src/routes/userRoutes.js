import express from 'express';
import { updateProfile, changePassword } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';
const router = express.Router();

router.put('/profile', protect, updateProfile);
router.put('/password', protect, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
], changePassword);

export default router;