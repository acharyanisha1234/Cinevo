import User from '../models/User.js';
import Movie from '../models/Movie.js';
import Rating from '../models/Rating.js';
import * as tmdb from '../services/tmdbService.js';

export const getStats = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalMoviesInDb = await Movie.countDocuments();
  const totalWatchlistItems = (await User.aggregate([{ $project: { watchlistSize: { $size: '$watchlist' } } }, { $group: { _id: null, total: { $sum: '$watchlistSize' } } }]))[0]?.total || 0;
  const totalRatings = await Rating.countDocuments();
  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt');
  res.json({ success: true, data: { totalUsers, totalMoviesInDb, totalWatchlistItems, totalRatings, recentUsers } });
};

export const getUsers = async (req, res) => {
  res.json({ success: true, data: await User.find().select('-password') });
};

export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  await user.deleteOne();
  res.json({ success: true, message: 'User deleted' });
};

export const updateUserRole = async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) return res.status(400).json({ success: false, message: 'Invalid role' });
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  user.role = role;
  await user.save();
  res.json({ success: true, message: 'Role updated' });
};

export const addMovie = async (req, res) => {
  const { tmdbId, videoUrl, trailerUrl, featured, published } = req.body;
  if (!tmdbId) return res.status(400).json({ success: false, message: 'tmdbId is required' });
  
  try {
    const movieData = await tmdb.getMovieDetails(tmdbId);
    if (!movieData) return res.status(404).json({ success: false, message: 'TMDB movie not found' });
    
    const genres = movieData.genres.map(g => g.name);
    let movie = await Movie.findOne({ tmdbId });
    
    if (movie) {
      movie.videoUrl = videoUrl || movie.videoUrl;
      movie.trailerUrl = trailerUrl || movie.trailerUrl;
      movie.featured = featured !== undefined ? featured : movie.featured;
      movie.published = published !== undefined ? published : movie.published;
      await movie.save();
    } else {
      movie = await Movie.create({
        tmdbId,
        title: movieData.title,
        overview: movieData.overview,
        posterPath: movieData.poster_path,
        backdropPath: movieData.backdrop_path,
        releaseDate: movieData.release_date,
        genres,
        runtime: movieData.runtime,
        rating: movieData.vote_average,
        voteCount: movieData.vote_count,
        trailerUrl: trailerUrl || tmdb.getTrailer(movieData.videos),
        videoUrl: videoUrl || '',
        featured: featured || false,
        published: published !== false,
        tagline: movieData.tagline,
        status: movieData.status,
      });
    }
    res.json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json({ success: true, data: movies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const { videoUrl, videoType, published, featured, subtitles } = req.body;
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    
    if (videoUrl !== undefined) movie.videoUrl = videoUrl;
    if (videoType !== undefined) movie.videoType = videoType;
    if (published !== undefined) movie.published = published;
    if (featured !== undefined) movie.featured = featured;
    if (subtitles !== undefined) movie.subtitles = subtitles;
    
    await movie.save();
    res.json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMovie = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
  await movie.deleteOne();
  res.json({ success: true, message: 'Movie deleted' });
};