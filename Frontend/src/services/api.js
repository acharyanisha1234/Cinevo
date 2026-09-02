import axios from 'axios';

// Use environment variables for production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cinevo_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const normalizeMovie = (raw) => {
  if (!raw) return null;
  
  const item = raw.data || raw;
  if (!item) return null;

  const id = item.tmdbId || item.id || item._id || '';
  const idStr = String(id);

  let posterPath = '';
  if (item.posterPath) {
    posterPath = item.posterPath;
  } else if (item.poster_path) {
    posterPath = item.poster_path;
  } else if (item.poster) {
    posterPath = item.poster;
  }

  if (posterPath && !posterPath.startsWith('http')) {
    posterPath = `${TMDB_IMAGE_BASE}${posterPath}`;
  }

  let backdropPath = '';
  if (item.backdropPath) {
    backdropPath = item.backdropPath;
  } else if (item.backdrop_path) {
    backdropPath = item.backdrop_path;
  } else if (item.backdrop) {
    backdropPath = item.backdrop;
  }

  if (backdropPath && !backdropPath.startsWith('http')) {
    backdropPath = `${TMDB_BACKDROP_BASE}${backdropPath}`;
  }

  let year = 'N/A';
  if (item.releaseDate) {
    year = item.releaseDate.split('-')[0];
  } else if (item.release_date) {
    year = item.release_date.split('-')[0];
  } else if (item.year) {
    year = String(item.year);
  }

  let rating = item.rating || item.vote_average || 0;
  if (typeof rating === 'number') {
    rating = rating.toFixed(1);
  }

  return {
    _id: item._id ? String(item._id) : undefined,
    id: idStr,
    tmdbId: idStr,
    title: item.title || item.name || 'Untitled Movie',
    overview: item.overview || item.description || 'No overview available.',
    posterPath: posterPath || 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster',
    backdropPath: backdropPath || posterPath || 'https://via.placeholder.com/1920x1080/1a1a1a/ffffff?text=No+Backdrop',
    rating: rating,
    releaseDate: item.releaseDate || item.release_date || '',
    year: year,
    genres: item.genres || [],
    videoUrl: item.videoUrl || item.streamUrl || item.video || 
      (idStr ? `https://www.2embed.cc/embed/${idStr}` : null),
    playable: Boolean(item.videoUrl || item.streamUrl || item.video),
  };
};

export default api;