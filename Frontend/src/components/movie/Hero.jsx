import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info } from 'lucide-react';

const Hero = ({ movies }) => {
  const navigate = useNavigate();
  
  if (!movies || movies.length === 0) return null;

  // Get a random featured movie or use the first one
  const movie = movies[0];

  const handleWatch = () => {
    const movieId = movie.id || movie.tmdbId || movie._id;
    navigate(`/watch/${movieId}`, { state: { movie } });
  };

  const handleMoreInfo = () => {
    const movieId = movie.id || movie.tmdbId || movie._id;
    navigate(`/movie/${movieId}`);
  };

  // Safely resolve image source - FIXED
  const getBackgroundImage = () => {
    // Check for backdrop first
    if (movie.backdropPath) {
      if (movie.backdropPath.startsWith('http')) {
        return movie.backdropPath;
      }
      return `https://image.tmdb.org/t/p/original${movie.backdropPath}`;
    }
    if (movie.backdrop) {
      if (movie.backdrop.startsWith('http')) {
        return movie.backdrop;
      }
      return `https://image.tmdb.org/t/p/original${movie.backdrop}`;
    }
    // Fallback to poster
    if (movie.posterPath) {
      if (movie.posterPath.startsWith('http')) {
        return movie.posterPath;
      }
      return `https://image.tmdb.org/t/p/original${movie.posterPath}`;
    }
    if (movie.poster) {
      if (movie.poster.startsWith('http')) {
        return movie.poster;
      }
      return `https://image.tmdb.org/t/p/original${movie.poster}`;
    }
    return 'https://via.placeholder.com/1920x1080/1a1a1a/ffffff?text=No+Image';
  };

  // Safely format rating
  const formattedRating = typeof movie.rating === 'number'
    ? movie.rating.toFixed(1)
    : Number(movie.rating || 0).toFixed(1);

  // Safely parse release year
  const releaseYear = movie.year || (movie.releaseDate || movie.release_date 
    ? new Date(movie.releaseDate || movie.release_date).getFullYear() 
    : 'N/A');

  const backgroundImage = getBackgroundImage();

  return (
    <div className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
      {/* Background Image with TMDB backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: 'center top',
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 max-w-2xl">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 line-clamp-2">
          {movie.title || movie.name || 'Untitled'}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm md:text-base mb-6">
          <span className="font-semibold">{releaseYear}</span>
          {movie.rating && (
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              ⭐ {formattedRating}
            </span>
          )}
          {movie.runtime && (
            <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
          )}
        </div>
        
        <p className="text-gray-300 text-sm md:text-base lg:text-lg mb-8 line-clamp-3 max-w-xl">
          {movie.overview || 'No description available for this movie.'}
        </p>
        
        {/* Action Buttons */}
        <div className="flex gap-4 items-center">
          <button
            onClick={handleWatch}
            className="bg-red-600 hover:bg-red-700 text-white px-6 md:px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition transform hover:scale-105 cursor-pointer"
          >
            <Play size={20} fill="currentColor" /> Play
          </button>
          <button
            onClick={handleMoreInfo}
            className="bg-gray-700/70 hover:bg-gray-600/90 text-white px-6 md:px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition border border-gray-600 cursor-pointer"
          >
            <Info size={20} /> More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;