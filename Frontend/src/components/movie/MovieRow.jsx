import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { IMAGE_BASE } from '../../utils/constants';

const MovieRow = ({ title, movies, seeAllLink = '#', loading = false }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Fallback image if poster_path is missing
  const fallbackImage = 'https://via.placeholder.com/300x450/1a1a1a/808080?text=No+Image';

  // Scroll handlers
  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { current } = scrollRef;
    const scrollAmount = current.clientWidth * 0.8;
    const target = direction === 'left' 
      ? current.scrollLeft - scrollAmount 
      : current.scrollLeft + scrollAmount;
    
    current.scrollTo({
      left: target,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { current } = scrollRef;
    setShowLeftArrow(current.scrollLeft > 20);
    setShowRightArrow(
      current.scrollLeft < current.scrollWidth - current.clientWidth - 20
    );
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="px-4 py-2">
        <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48 animate-pulse">
              <div className="w-full h-72 bg-gray-800 rounded-lg" />
              <div className="mt-2 h-4 bg-gray-800 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative group px-4 py-2">
      {/* Header with See All */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl md:text-2xl font-semibold text-white hover:text-gray-300 transition">
          {title}
        </h2>
        <Link 
          to={seeAllLink} 
          className="text-sm text-gray-400 hover:text-white transition flex items-center gap-1"
        >
          See All <span className="text-lg">→</span>
        </Link>
      </div>

      {/* Scroll Container */}
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 -ml-3 w-10 h-10 flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 -mr-3 w-10 h-10 flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Gradient Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black to-transparent pointer-events-none z-5" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black to-transparent pointer-events-none z-5" />

        {/* Movie Cards */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 pt-1"
        >
          {movies.map((movie) => {
            const posterPath = movie.poster_path 
              ? `${IMAGE_BASE}${movie.poster_path}` 
              : fallbackImage;

            // Safely convert vote_average to number
            const rating = Number(movie.vote_average);
            const isValidRating = !isNaN(rating) && rating > 0;

            return (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="flex-shrink-0 w-44 md:w-52 transition transform hover:scale-105 duration-200 group/movie"
              >
                <div className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <img
                    src={posterPath}
                    alt={movie.title || movie.name}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      e.target.src = fallbackImage;
                    }}
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover/movie:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <h3 className="text-white font-semibold text-sm truncate">
                      {movie.title || movie.name}
                    </h3>
                    
                    {isValidRating && (
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-yellow-400">★</span>
                        <span className="text-white">
                          {rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                    
                    <button className="mt-1 bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full hover:bg-white/30 transition w-fit">
                      Play
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MovieRow;