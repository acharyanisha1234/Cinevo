import React, { useState, useEffect } from 'react';
import { getPopular } from '../services/movieService';
import { normalizeMovie } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MovieCard from '../components/movie/MovieCard';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const extractMovies = (res) => {
    if (!res) return [];
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray(res.data.results)) return res.data.results;
    if (res.data?.data && Array.isArray(res.data.data.results)) return res.data.data.results;
    if (res.data?.data && Array.isArray(res.data.data)) return res.data.data;
    return [];
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await getPopular();
        const moviesData = extractMovies(response);
        const normalizedMovies = moviesData.map(normalizeMovie).filter(Boolean);
        setMovies(normalizedMovies);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to fetch movies');
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-red-600 mb-8">All Movies</h1>
        
        {movies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No movies found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard 
                key={movie.id || movie.tmdbId || movie._id} 
                movie={movie}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;