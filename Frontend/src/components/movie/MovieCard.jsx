import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Heart } from 'lucide-react';
import { useFavorites } from '../../context/FavoriteContext';

const MovieCard = ({ movie, category }) => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();

  if (!movie) return null;

  const movieId = movie.id || movie.tmdbId || movie._id;
  const isFav = isFavorite(movieId);
  
  const getPosterUrl = () => {
    if (movie.posterPath) {
      if (movie.posterPath.startsWith('http')) {
        return movie.posterPath;
      }
      return `https://image.tmdb.org/t/p/w500${movie.posterPath}`;
    }
    return 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster';
  };

  const posterUrl = getPosterUrl();

  const handleClick = () => {
    navigate(`/movie/${movieId}`, { state: { category } });
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    navigate(`/watch/${movieId}`);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(movie);
  };

  return (
    <div 
      className="group relative min-w-[140px] w-[140px] md:min-w-[200px] md:w-[200px] cursor-pointer flex-shrink-0"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden rounded-md">
        <img
          src={posterUrl}
          alt={movie.title || 'Movie poster'}
          className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster';
          }}
          loading="lazy"
        />
        
        {/* Favorite Button - Always visible */}
        <button
          onClick={handleFavorite}
          className="absolute top-2 right-2 p-2 bg-black/60 backdrop-blur-md rounded-full hover:scale-110 transition-transform z-10"
        >
          <Heart 
            size={20} 
            className={isFav ? 'text-red-500 fill-red-500' : 'text-white'}
          />
        </button>
        
        {/* Play Button - On Hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handlePlay}
            className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-transform transform hover:scale-110"
          >
            <Play size={24} fill="currentColor" />
          </button>
        </div>
      </div>
      
      <h3 className="mt-2 text-sm font-medium text-white truncate">
        {movie.title || 'Untitled'}
      </h3>
      <p className="text-xs text-gray-400">
        {movie.year || 'N/A'} {movie.rating ? `• ⭐ ${movie.rating}` : ''}
      </p>
    </div>
  );
};

export default MovieCard;