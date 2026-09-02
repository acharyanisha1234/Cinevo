import Movie from '../models/Movie.js';
import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper: Format movie schema safely for frontend consumption
export const formatMovieData = (movie, dbMatch = null) => {
  const tmdbIdStr = String(movie.id || movie.tmdbId || '');
  const mongoIdStr = movie._id || dbMatch?._id;

  const rawPoster = movie.poster_path || movie.posterPath || movie.poster || dbMatch?.posterPath || '';
  const rawBackdrop = movie.backdrop_path || movie.backdropPath || movie.backdrop || dbMatch?.backdropPath || '';

  const posterUrl = rawPoster
    ? rawPoster.startsWith('http')
      ? rawPoster
      : `https://image.tmdb.org/t/p/w500${rawPoster}`
    : '';

  const backdropUrl = rawBackdrop
    ? rawBackdrop.startsWith('http')
      ? rawBackdrop
      : `https://image.tmdb.org/t/p/w1280${rawBackdrop}`
    : posterUrl;

  const videoUrl =
    dbMatch?.videoUrl ||
    dbMatch?.streamUrl ||
    dbMatch?.video ||
    movie.videoUrl ||
    movie.streamUrl ||
    movie.video ||
    (tmdbIdStr ? `https://www.2embed.cc/embed/${tmdbIdStr}` : null);

  return {
    _id: mongoIdStr ? String(mongoIdStr) : undefined,
    id: tmdbIdStr || String(mongoIdStr),
    tmdbId: tmdbIdStr,
    title: movie.title || movie.name || 'Untitled Movie',
    overview: movie.overview || movie.description || 'No overview available.',
    posterPath: posterUrl,
    backdropPath: backdropUrl,
    rating: Number(movie.vote_average || movie.rating || 0).toFixed(1),
    releaseDate: movie.release_date || movie.releaseDate || '',
    year: (movie.release_date || movie.releaseDate || '').split('-')[0] || 'N/A',
    genres: movie.genres || movie.genre_ids || [],
    videoUrl: videoUrl,
    playable: Boolean(videoUrl),
  };
};

// @desc    Get all movies
// @route   GET /api/movies
export const getAllMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const dbMovies = await Movie.find().skip(skip).limit(limit).lean();
    const total = await Movie.countDocuments();
    const normalized = dbMovies.map((m) => formatMovieData(m, m));

    res.status(200).json({
      success: true,
      count: normalized.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: normalized,
    });
  } catch (error) {
    console.error('Error in getAllMovies:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve movies.' });
  }
};

// @desc    Get ONLY actual trending movies (TMDB Trending API)
// @route   GET /api/movies/trending
export const getTrendingMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    let movies = [];

    if (process.env.TMDB_API_KEY) {
      try {
        const tmdbRes = await axios.get(
          `${TMDB_BASE_URL}/trending/movie/week?api_key=${process.env.TMDB_API_KEY}&page=${page}`
        );
        movies = (tmdbRes.data?.results || []).map((m) => formatMovieData(m));
      } catch (err) {
        console.warn('TMDB Trending fetch failed:', err.message);
      }
    }

    if (movies.length === 0) {
      const dbMovies = await Movie.find().sort({ rating: -1, createdAt: -1 }).limit(20).lean();
      movies = dbMovies.map((m) => formatMovieData(m, m));
    }

    res.status(200).json({ success: true, count: movies.length, page, data: movies });
  } catch (error) {
    console.error('Error in getTrendingMovies:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve trending movies.' });
  }
};

// @desc    Get popular movies
// @route   GET /api/movies/popular
export const getPopularMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    let movies = [];

    if (process.env.TMDB_API_KEY) {
      try {
        const tmdbRes = await axios.get(
          `${TMDB_BASE_URL}/movie/popular?api_key=${process.env.TMDB_API_KEY}&page=${page}`
        );
        movies = (tmdbRes.data?.results || []).map((m) => formatMovieData(m));
      } catch (err) {
        console.warn('TMDB Popular fetch failed:', err.message);
      }
    }

    if (movies.length === 0) {
      const dbMovies = await Movie.find().sort({ rating: -1 }).limit(20).lean();
      movies = dbMovies.map((m) => formatMovieData(m, m));
    }

    res.status(200).json({ success: true, count: movies.length, page, data: movies });
  } catch (error) {
    console.error('Error in getPopularMovies:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve popular movies.' });
  }
};

// @desc    Get top rated movies
// @route   GET /api/movies/top-rated
export const getTopRatedMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    let movies = [];

    if (process.env.TMDB_API_KEY) {
      try {
        const tmdbRes = await axios.get(
          `${TMDB_BASE_URL}/movie/top_rated?api_key=${process.env.TMDB_API_KEY}&page=${page}`
        );
        movies = (tmdbRes.data?.results || []).map((m) => formatMovieData(m));
      } catch (err) {
        console.warn('TMDB Top-Rated fetch failed:', err.message);
      }
    }

    if (movies.length === 0) {
      const dbMovies = await Movie.find().sort({ rating: -1 }).limit(20).lean();
      movies = dbMovies.map((m) => formatMovieData(m, m));
    }

    res.status(200).json({ success: true, count: movies.length, page, data: movies });
  } catch (error) {
    console.error('Error in getTopRatedMovies:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve top rated movies.' });
  }
};

// @desc    Get now playing movies
// @route   GET /api/movies/now-playing
export const getNowPlayingMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    let movies = [];

    if (process.env.TMDB_API_KEY) {
      try {
        const tmdbRes = await axios.get(
          `${TMDB_BASE_URL}/movie/now_playing?api_key=${process.env.TMDB_API_KEY}&page=${page}`
        );
        movies = (tmdbRes.data?.results || []).map((m) => formatMovieData(m));
      } catch (err) {
        console.warn('TMDB Now Playing fetch failed:', err.message);
      }
    }

    if (movies.length === 0) {
      const dbMovies = await Movie.find().sort({ createdAt: -1 }).limit(20).lean();
      movies = dbMovies.map((m) => formatMovieData(m, m));
    }

    res.status(200).json({ success: true, count: movies.length, page, data: movies });
  } catch (error) {
    console.error('Error in getNowPlayingMovies:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve now playing movies.' });
  }
};

// @desc    Get upcoming movies
// @route   GET /api/movies/upcoming
export const getUpcomingMovies = async (req, res) => {
  try {
    let upcoming = [];
    if (process.env.TMDB_API_KEY) {
      try {
        const tmdbRes = await axios.get(`${TMDB_BASE_URL}/movie/upcoming?api_key=${process.env.TMDB_API_KEY}`);
        upcoming = (tmdbRes.data?.results || []).map((m) => formatMovieData(m));
      } catch (err) {
        console.warn('TMDB Upcoming fetch failed:', err.message);
      }
    }

    if (upcoming.length === 0) {
      const dbMovies = await Movie.find().sort({ releaseDate: -1 }).limit(20).lean();
      upcoming = dbMovies.map((m) => formatMovieData(m, m));
    }

    res.status(200).json({ success: true, count: upcoming.length, data: upcoming });
  } catch (error) {
    console.error('Error in getUpcomingMovies:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve upcoming movies.' });
  }
};

// @desc    Get all movie genres (This was missing named export!)
// @route   GET /api/movies/genres
export const getAllGenres = async (req, res) => {
  try {
    const fallbackGenres = [
      { id: 28, name: 'Action' },
      { id: 12, name: 'Adventure' },
      { id: 16, name: 'Animation' },
      { id: 35, name: 'Comedy' },
      { id: 80, name: 'Crime' },
      { id: 99, name: 'Documentary' },
      { id: 18, name: 'Drama' },
      { id: 10751, name: 'Family' },
      { id: 14, name: 'Fantasy' },
      { id: 36, name: 'History' },
      { id: 27, name: 'Horror' },
      { id: 10402, name: 'Music' },
      { id: 9648, name: 'Mystery' },
      { id: 10749, name: 'Romance' },
      { id: 878, name: 'Science Fiction' },
      { id: 53, name: 'Thriller' },
      { id: 10752, name: 'War' },
      { id: 37, name: 'Western' },
    ];

    if (process.env.TMDB_API_KEY) {
      try {
        const tmdbRes = await axios.get(`${TMDB_BASE_URL}/genre/movie/list?api_key=${process.env.TMDB_API_KEY}`);
        if (tmdbRes.data?.genres) {
          return res.status(200).json({ success: true, data: tmdbRes.data.genres });
        }
      } catch (err) {
        console.warn('TMDB Genre fetch error:', err.message);
      }
    }

    res.status(200).json({ success: true, data: fallbackGenres });
  } catch (error) {
    console.error('Error in getAllGenres:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve genres.' });
  }
};

// @desc    Search movies
// @route   GET /api/movies/search
export const searchMovies = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(200).json({ success: true, data: [] });
    }

    const regex = new RegExp(q.trim(), 'i');
    const localMatches = await Movie.find({ title: regex }).lean();

    let remoteMatches = [];
    if (process.env.TMDB_API_KEY) {
      try {
        const tmdbRes = await axios.get(
          `${TMDB_BASE_URL}/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(q.trim())}`
        );
        remoteMatches = tmdbRes.data?.results || [];
      } catch (err) {
        console.warn('TMDB Search error:', err.message);
      }
    }

    const combined = [...localMatches.map((m) => formatMovieData(m, m))];
    remoteMatches.forEach((rm) => {
      const exists = combined.some((c) => String(c.id) === String(rm.id));
      if (!exists) {
        combined.push(formatMovieData(rm));
      }
    });

    res.status(200).json({ success: true, data: combined });
  } catch (error) {
    console.error('Error in searchMovies:', error);
    res.status(500).json({ success: false, message: 'Failed to search movies.' });
  }
};

// @desc    Get single movie by ID (MongoDB _id or TMDB ID)
// @route   GET /api/movies/:id
export const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    let dbMovie = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      dbMovie = await Movie.findById(id).lean();
    } else if (!isNaN(id)) {
      dbMovie = await Movie.findOne({ tmdbId: Number(id) }).lean();
    }

    let tmdbData = null;
    if (!dbMovie && !isNaN(id)) {
      const apiKey = process.env.TMDB_API_KEY;
      if (apiKey) {
        try {
          const tmdbRes = await axios.get(`${TMDB_BASE_URL}/movie/${id}?api_key=${apiKey}`);
          tmdbData = tmdbRes.data;
        } catch (err) {
          console.warn(`TMDB lookup failed for ID ${id}: ${err.message}`);
        }
      }
    }

    if (!dbMovie && !tmdbData) {
      return res.status(404).json({ success: false, message: `Movie with ID ${id} not found.` });
    }

    const mergedData = formatMovieData(tmdbData || dbMovie, dbMovie);
    return res.status(200).json({ success: true, data: mergedData });
  } catch (error) {
    console.error('Error in getMovieById:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve movie details.' });
  }
};