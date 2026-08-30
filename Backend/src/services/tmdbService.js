import axios from 'axios';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

const tmdb = axios.create({
  baseURL: TMDB_BASE,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

export const getGenres = async () => (await tmdb.get('/genre/movie/list')).data.genres;
export const getTrending = (page = 1) => tmdb.get('/trending/movie/week', { params: { page } }).then(r => r.data);
export const getPopular = (page = 1) => tmdb.get('/movie/popular', { params: { page } }).then(r => r.data);
export const getTopRated = (page = 1) => tmdb.get('/movie/top_rated', { params: { page } }).then(r => r.data);
export const getNowPlaying = (page = 1) => tmdb.get('/movie/now_playing', { params: { page } }).then(r => r.data);
export const getUpcoming = (page = 1) => tmdb.get('/movie/upcoming', { params: { page } }).then(r => r.data);
export const getMovieDetails = async (id) => {
  const res = await tmdb.get(`/movie/${id}`, { params: { append_to_response: 'videos,credits,similar,recommendations' } });
  return res.data;
};
export const searchMovies = (query, page = 1) => tmdb.get('/search/movie', { params: { query, page } }).then(r => r.data);
export const getMoviesByGenre = (genreId, page = 1) => tmdb.get('/discover/movie', { params: { with_genres: genreId, page } }).then(r => r.data);
export const getTrailer = (videos) => videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')?.key || null;