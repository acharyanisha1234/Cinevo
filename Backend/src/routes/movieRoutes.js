import express from 'express';
import {
  getAllMovies,
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getAllGenres,
  searchMovies,
  getMovieById,
} from '../controllers/movieController.js';

const router = express.Router();

router.get('/', getAllMovies);
router.get('/trending', getTrendingMovies);
router.get('/popular', getPopularMovies);
router.get('/top-rated', getTopRatedMovies);
router.get('/now-playing', getNowPlayingMovies);
router.get('/upcoming', getUpcomingMovies);
router.get('/genres', getAllGenres);
router.get('/search', searchMovies);
router.get('/:id', getMovieById);

export default router;