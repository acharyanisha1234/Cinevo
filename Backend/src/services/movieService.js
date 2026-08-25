import api from './api';

export const getTrending = (page = 1) => api.get('/movies/trending', { params: { page } });
export const getPopular = (page = 1) => api.get('/movies/popular', { params: { page } });
export const getTopRated = (page = 1) => api.get('/movies/top-rated', { params: { page } });
export const getNowPlaying = (page = 1) => api.get('/movies/now-playing', { params: { page } });
export const getUpcoming = (page = 1) => api.get('/movies/upcoming', { params: { page } });
export const getMovieDetails = (id) => api.get(`/movies/${id}`);
export const searchMovies = (query, page = 1) => api.get('/movies/search', { params: { q: query, page } });
export const getGenres = () => api.get('/movies/genres');
export const getMoviesByGenre = (genreId, page = 1) => api.get(`/movies/genre/${genreId}`, { params: { page } });