import axios from 'axios';

const TMDB_BASE = 'https://api.themoviedb.org/3';

const getAccessToken = () => {
  const token = process.env.TMDB_ACCESS_TOKEN;

  if (!token) {
    throw new Error(
      'TMDB_ACCESS_TOKEN is missing. Please check your Backend/.env file.'
    );
  }

  return token;
};

const tmdb = axios.create({
  baseURL: TMDB_BASE,
  params: {
    language: 'en-US',
  },
});

// Add Authorization token before every request
tmdb.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getAccessToken()}`;
  config.headers['Content-Type'] = 'application/json';

  return config;
});


// GENRES
export const getGenres = async () => {
  const response = await tmdb.get('/genre/movie/list');
  return response.data.genres;
};


// TRENDING
export const getTrending = async (page = 1) => {
  const response = await tmdb.get('/trending/movie/week', {
    params: { page },
  });

  return response.data;
};

// POPULAR
export const getPopular = async (page = 1) => {
  const response = await tmdb.get('/movie/popular', {
    params: { page },
  });

  return response.data;
};
// TOP RATED

export const getTopRated = async (page = 1) => {
  const response = await tmdb.get('/movie/top_rated', {
    params: { page },
  });

  return response.data;
};


// NOW PLAYING

export const getNowPlaying = async (page = 1) => {
  const response = await tmdb.get('/movie/now_playing', {
    params: { page },
  });

  return response.data;
};

// ===============================
// UPCOMING / LATEST
// ===============================

export const getUpcoming = async (page = 1) => {
  const response = await tmdb.get('/movie/upcoming', {
    params: { page },
  });

  return response.data;
};

// ===============================
// MOVIE DETAILS
// ===============================

export const getMovieDetails = async (id) => {
  const response = await tmdb.get(`/movie/${id}`, {
    params: {
      append_to_response:
        'videos,credits,similar,recommendations',
    },
  });

  return response.data;
};

// SEARCH MOVIES


export const searchMovies = async (query, page = 1) => {
  const response = await tmdb.get('/search/movie', {
    params: {
      query,
      page,
    },
  });

  return response.data;
};

// MOVIES BY GENRE

export const getMoviesByGenre = async (genreId, page = 1) => {
  const response = await tmdb.get('/discover/movie', {
    params: {
      with_genres: genreId,
      page,
    },
  });

  return response.data;
};

// TRAILER

export const getTrailer = (videos) => {
  return (
    videos?.results?.find(
      (video) =>
        video.type === 'Trailer' &&
        video.site === 'YouTube'
    )?.key || null
  );
};