import React, { useRef } from 'react';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MovieRow = ({ title, movies = [], isLoading = false, category = '' }) => {
  const rowRef = useRef(null);
  const navigate = useNavigate();

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75;
      rowRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleTitleClick = () => {
    if (category) {
      navigate(`/genre/${category}`);
    }
  };

  const validMovies = movies.filter(movie => movie && movie.id);

  if (validMovies.length === 0 && !isLoading) return null;

  return (
    <div className="my-6 px-4 md:px-12 relative group">
      <h2 
        className="text-xl md:text-2xl font-bold text-white mb-3 tracking-wide hover:text-red-500 transition-colors cursor-pointer"
        onClick={handleTitleClick}
      >
        {title}
      </h2>
      
      <button 
        aria-label="Scroll Left"
        onClick={() => handleScroll('left')}
        className="absolute left-2 top-1/2 mt-2 -translate-y-1/2 z-40 bg-black/70 hover:bg-black p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button 
        aria-label="Scroll Right"
        onClick={() => handleScroll('right')}
        className="absolute right-2 top-1/2 mt-2 -translate-y-1/2 z-40 bg-black/70 hover:bg-black p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center"
      >
        <ChevronRight size={24} />
      </button>

      <div 
        ref={rowRef}
        className="flex space-x-4 overflow-x-auto scrollbar-none py-4 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {isLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="min-w-[140px] w-[140px] md:min-w-[200px] md:w-[200px] h-[210px] md:h-[300px] bg-neutral-800 animate-pulse rounded-md flex-shrink-0" />
            ))
          : validMovies.map((movie) => (
              <MovieCard key={movie.id || movie.tmdbId || movie._id} movie={movie} category={category} />
            ))}
      </div>
    </div>
  );
};

export default MovieRow;