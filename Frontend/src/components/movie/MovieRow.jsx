import React from 'react';
import { Link } from 'react-router-dom';
import { IMAGE_BASE } from '../../utils/constants';

const MovieRow = ({ title, movies }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="px-4 py-2">
      <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            to={`/movie/${movie.id}`}
            className="flex-shrink-0 w-40 transition transform hover:scale-105 duration-200"
          >
            <img
              src={`${IMAGE_BASE}${movie.poster_path}`}
              alt={movie.title || movie.name}
              className="rounded-md"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieRow;