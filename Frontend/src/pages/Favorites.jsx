import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoriteContext';
import { Play, Heart, Trash2, ArrowLeft } from 'lucide-react';

const Favorites = () => {
  const { favorites, loading, toggleFavorite, refreshFavorites } = useFavorites();
  const navigate = useNavigate();
  const [hoveredMovie, setHoveredMovie] = useState(null);

  useEffect(() => {
    refreshFavorites();
  }, []);

  const handleRemoveFavorite = (e, movie) => {
    e.stopPropagation();
    toggleFavorite(movie);
  };

  const handlePlay = (e, movieId) => {
    e.stopPropagation();
    navigate(`/watch/${movieId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">My Favorites</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse bg-neutral-800 rounded-lg aspect-[2/3]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-8 text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="text-center">
          <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-neutral-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">No Favorites Yet</h1>
          <p className="text-neutral-400 mb-6 max-w-md">
            Start adding movies you love by tapping the ❤️ button on any movie.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg transition-all transform hover:scale-105"
          >
            Browse Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">My Favorites</h1>
              <p className="text-neutral-400 text-sm mt-1">
                {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} in your collection
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-400 hidden sm:inline">
              ❤️ {favorites.length}
            </span>
          </div>
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {favorites.map((movie) => {
            const movieId = movie.id || movie._id;
            const isHovered = hoveredMovie === movieId;
            
            return (
              <div
                key={movieId}
                className="group relative bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 hover:border-red-500/50 transition-all duration-300"
                onMouseEnter={() => setHoveredMovie(movieId)}
                onMouseLeave={() => setHoveredMovie(null)}
              >
                {/* Poster */}
                <div
                  className="relative aspect-[2/3] cursor-pointer"
                  onClick={() => navigate(`/movie/${movieId}`)}
                >
                  <img
                    src={movie.posterPath || 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster'}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster';
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
               
                  <button
                    onClick={(e) => handleRemoveFavorite(e, movie)}
                    className="absolute top-3 right-3 p-2 bg-red-600 rounded-full 
                             transition-all duration-300 hover:scale-110 active:scale-95
                             shadow-lg shadow-red-600/20 z-10"
                    aria-label="Remove from favorites"
                  >
                    <Heart size={18} className="fill-white text-white" />
                  </button>

                  {/* Play Button - Shows on Hover */}
                  <div className={`
                    absolute inset-0 flex items-center justify-center
                    opacity-0 group-hover:opacity-100 transition-all duration-300
                  `}>
                    <button
                      onClick={(e) => handlePlay(e, movieId)}
                      className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full 
                               transition-transform transform hover:scale-110 active:scale-95
                               shadow-2xl shadow-red-600/20"
                    >
                      <Play size={28} fill="currentColor" className="ml-1" />
                    </button>
                  </div>
                </div>

                {/* Movie Info */}
                <div className="p-3">
                  <h3 className="font-bold text-sm truncate text-white group-hover:text-red-500 transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-neutral-400">
                      {movie.year || 'N/A'}
                    </p>
                    {movie.rating && (
                      <p className="text-xs text-yellow-500 flex items-center gap-0.5">
                        <span>⭐</span> {movie.rating}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Favorites;