import express from 'express';
import { getStats, getUsers, deleteUser, updateUserRole, addMovie, getAdminMovies, deleteMovie } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
const router = express.Router();

router.use(protect, admin);
router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);
router.route('/movies').get(getAdminMovies).post(addMovie);
router.delete('/movies/:id', deleteMovie);

export default router;