import React from 'react';
import MovieCard from './MovieCard';

const MovieGrid = ({ movies, title, onAddToList, onFavorite, watchlist = [], favorites = [] }) => {
  if (!movies || movies.length === 0) return <div className="text-center py-8 text-gray-400">No movies found.</div>;
  return (
    <div className="my-6">
      {title && <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map(movie => {
          const isInList = watchlist.some(w => w.movieId === movie.id);
          const isFav = favorites.some(f => f.movieId === movie.id);
          return <MovieCard key={movie.id} movie={movie} onAddToList={onAddToList} onFavorite={onFavorite} isInList={isInList} isFavorite={isFav} />;
        })}
      </div>
    </div>
  );
};

export default MovieGrid;