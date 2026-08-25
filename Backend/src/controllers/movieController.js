import * as tmdb from '../services/tmdbService.js';
import Movie from '../models/Movie.js';
import Rating from '../models/Rating.js';

let genresCache = null;
const getGenres = async () => {
  if (!genresCache) genresCache = await tmdb.getGenres();
  return genresCache;
};

const formatMovie = async (movie) => {
  const genres = await getGenres();
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    releaseDate: movie.release_date,
    genreNames: movie.genre_ids?.map(id => genres.find(g => g.id === id)?.name).filter(Boolean) || movie.genres?.map(g => g.name) || [],
    rating: movie.vote_average,
    voteCount: movie.vote_count,
  };
};

const fetchAndFormat = async (fetchFn, page) => {
  const data = await fetchFn(page);
  return {
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
    results: await Promise.all(data.results.map(formatMovie)),
  };
};

export const getTrending = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  res.json({ success: true, data: await fetchAndFormat(tmdb.getTrending, page) });
};
export const getPopular = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  res.json({ success: true, data: await fetchAndFormat(tmdb.getPopular, page) });
};
export const getTopRated = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  res.json({ success: true, data: await fetchAndFormat(tmdb.getTopRated, page) });
};
export const getNowPlaying = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  res.json({ success: true, data: await fetchAndFormat(tmdb.getNowPlaying, page) });
};
export const getUpcoming = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  res.json({ success: true, data: await fetchAndFormat(tmdb.getUpcoming, page) });
};

export const getMovieDetails = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const movie = await tmdb.getMovieDetails(id);
    const genres = await getGenres();
    const details = {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      releaseDate: movie.release_date,
      genres: movie.genres?.map(g => g.name) || [],
      runtime: movie.runtime,
      rating: movie.vote_average,
      voteCount: movie.vote_count,
      tagline: movie.tagline,
      status: movie.status,
      trailer: tmdb.getTrailer(movie.videos),
      cast: movie.credits?.cast?.slice(0, 10).map(c => ({ id: c.id, name: c.name, character: c.character, profilePath: c.profile_path })) || [],
      director: movie.credits?.crew?.find(c => c.job === 'Director')?.name || null,
      similar: movie.similar?.results?.slice(0, 12).map(s => ({ id: s.id, title: s.title, posterPath: s.poster_path, rating: s.vote_average, releaseDate: s.release_date })) || [],
      recommendations: movie.recommendations?.results?.slice(0, 12).map(r => ({ id: r.id, title: r.title, posterPath: r.poster_path, rating: r.vote_average, releaseDate: r.release_date })) || [],
    };
    if (req.user) {
      const userRating = await Rating.findOne({ user: req.user._id, movieId: id });
      details.userRating = userRating ? userRating.rating : null;
      details.inWatchlist = req.user.watchlist.some(w => w.movieId === id);
      details.inFavorites = req.user.favorites.some(f => f.movieId === id);
    }
    res.json({ success: true, data: details });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Movie not found' });
  }
};

export const searchMovies = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ success: false, message: 'Search query is required' });
  const page = parseInt(req.query.page) || 1;
  const data = await fetchAndFormat((q, p) => tmdb.searchMovies(query, p), page);
  res.json({ success: true, data });
};

export const getMoviesByGenre = async (req, res) => {
  const genreId = parseInt(req.params.genreId);
  const page = parseInt(req.query.page) || 1;
  const data = await fetchAndFormat((p) => tmdb.getMoviesByGenre(genreId, p), page);
  res.json({ success: true, data });
};

export const getAllGenres = async (req, res) => {
  res.json({ success: true, data: await getGenres() });
};