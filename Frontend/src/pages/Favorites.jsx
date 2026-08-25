import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MovieGrid from '../components/movie/MovieGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { Heart } from 'lucide-react';

const Favorites = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get('/favorites'); // we need to implement this route in backend
        const movieIds = res.data.data.map(item => item.movieId);
        const movieDetails = await Promise.all(movieIds.map(id => api.get(`/movies/${id}`).then(r => r.data.data)));
        setMovies(movieDetails);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchFavorites();
  }, []);

  const handleRemove = async (movieId) => {
    try { await api.delete(`/favorites/${movieId}`); setMovies(movies.filter(m => m.id !== movieId)); } catch (error) { console.error(error); }
  };

  if (loading) return <LoadingSpinner />;
  if (movies.length === 0) return <EmptyState message="No favorites yet" icon={Heart} />;
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-4">Favorites</h2>
      <MovieGrid movies={movies} onFavorite={handleRemove} />
    </div>
  );
};

export default Favorites;