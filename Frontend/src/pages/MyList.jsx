import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MovieGrid from '../components/movie/MovieGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { List } from 'lucide-react';

const MyList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await api.get('/watchlist');
        const movieIds = res.data.data.map(item => item.movieId);
        const movieDetails = await Promise.all(movieIds.map(id => api.get(`/movies/${id}`).then(r => r.data.data)));
        setMovies(movieDetails);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchWatchlist();
  }, []);

  const handleRemove = async (movieId) => {
    try { await api.delete(`/watchlist/${movieId}`); setMovies(movies.filter(m => m.id !== movieId)); } catch (error) { console.error(error); }
  };

  if (loading) return <LoadingSpinner />;
  if (movies.length === 0) return <EmptyState message="Your watchlist is empty" icon={List} />;
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-4">My List</h2>
      <MovieGrid movies={movies} onAddToList={handleRemove} />
    </div>
  );
};

export default MyList;