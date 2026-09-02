import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTrending, getPopular, getTopRated, getNowPlaying, getUpcoming } from '../services/movieService';
import { normalizeMovie } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MovieCard from '../components/movie/MovieCard';

const Genre = () => {
  const { genre } = useParams();
  const navigate = useNavigate();
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
    const fetchGenreMovies = async () => {
      try {
        setLoading(true);
        let response;
        let genreTitle = '';

        // Map genre to API call based on the genre name
        switch(genre?.toLowerCase()) {
          case 'trending':
            response = await getTrending();
            genreTitle = 'Trending Now';
            break;
          case 'popular':
            response = await getPopular();
            genreTitle = 'Popular';
            break;
          case 'top-rated':
            response = await getTopRated();
            genreTitle = 'Top Rated';
            break;
          case 'now-playing':
            response = await getNowPlaying();
            genreTitle = 'Now Playing';
            break;
          case 'upcoming':
            response = await getUpcoming();
            genreTitle = 'Upcoming';
            break;
          default:
            // If it's a specific genre like "Action", "Comedy", etc.
            response = await getPopular(); // Fallback
            genreTitle = genre || 'Movies';
        }

        const moviesData = extractMovies(response);
        const normalizedMovies = moviesData.map(normalizeMovie).filter(Boolean);
        
        console.log(`Genre ${genreTitle} movies:`, normalizedMovies);
        setMovies(normalizedMovies);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching genre movies:', err);
        setError('Failed to fetch movies');
        setLoading(false);
      }
    };

    fetchGenreMovies();
  }, [genre]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 bg-red-600 hover:bg-red-700 px-6 py-2 rounded"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-red-600 mb-8 capitalize">
          {genre?.replace('-', ' ')} Movies
        </h1>
        
        {movies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No movies found in this category</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 bg-red-600 hover:bg-red-700 px-6 py-2 rounded"
            >
              Go Back Home
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard 
                key={movie.id || movie.tmdbId || movie._id} 
                movie={movie}
                category={genre}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Genre;