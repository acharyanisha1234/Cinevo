import express from 'express';
import { getTrending, getPopular, getTopRated, getNowPlaying, getUpcoming, getMovieDetails, searchMovies, getMoviesByGenre, getAllGenres } from '../controllers/movieController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/trending', getTrending);
router.get('/popular', getPopular);
router.get('/top-rated', getTopRated);
router.get('/now-playing', getNowPlaying);
router.get('/upcoming', getUpcoming);
router.get('/genres', getAllGenres);
router.get('/genre/:genreId', getMoviesByGenre);
router.get('/search', searchMovies);
router.get('/:id', protect, getMovieDetails);

export default router;