import axios from 'axios';
import { API_BASE, API_KEY } from '../utils/constants';

export const api = axios.create({
  baseURL: API_BASE,
  params: { api_key: API_KEY, language: 'en-US' },
});

export const getTrending = (mediaType = 'all', timeWindow = 'week') =>
  api.get(`/trending/${mediaType}/${timeWindow}`).then(res => res.data);

export const getMovies = (category = 'popular') =>
  api.get(`/movie/${category}`).then(res => res.data);