import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Heart, Plus, Star } from 'lucide-react';

const MovieCard = ({ movie, showRating = true, onAddToList, onFavorite, isInList = false, isFavorite = false }) => {
  const { id, title, posterPath, rating, releaseDate } = movie;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  return (
    <div className="relative group rounded-lg overflow-hidden bg-gray-900 transition-transform duration-300 hover:scale-105 hover:z-10">
      <Link to={`/movie/${id}`}>
        <img src={posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : '/placeholder.jpg'} alt={title} className="w-full h-auto object-cover aspect-[2/3]" loading="lazy" />
      </Link>
      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        <h3 className="text-white font-semibold text-sm line-clamp-1">{title}</h3>
        <div className="flex items-center justify-between mt-1">
          {showRating && rating !== undefined && <span className="text-yellow-400 text-xs flex items-center"><Star size={12} className="fill-yellow-400 mr-1" />{rating.toFixed(1)}</span>}
          <span className="text-gray-300 text-xs">{year}</span>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <Link to={`/movie/${id}`} className="bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5"><Play size={16} /></Link>
          <button onClick={(e) => { e.preventDefault(); onAddToList && onAddToList(id); }} className={`rounded-full p-1.5 ${isInList ? 'bg-red-600' : 'bg-gray-700 hover:bg-red-600'} text-white transition`}><Plus size={16} /></button>
          <button onClick={(e) => { e.preventDefault(); onFavorite && onFavorite(id); }} className={`rounded-full p-1.5 ${isFavorite ? 'bg-red-600' : 'bg-gray-700 hover:bg-red-600'} text-white transition`}><Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} /></button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;