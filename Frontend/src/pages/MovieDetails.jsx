import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMovieDetails } from '../services/movieService';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import RatingStars from '../components/common/RatingStars';
import { Play, Plus, Heart, X, Calendar, Clock, Star } from 'lucide-react';
import MovieGrid from '../components/movie/MovieGrid';

const MovieDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [inFavorites, setInFavorites] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await getMovieDetails(id);
        const data = res.data.data;
        setMovie(data);
        setUserRating(data.userRating || null);
        setInWatchlist(data.inWatchlist || false);
        setInFavorites(data.inFavorites || false);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchMovie();
  }, [id]);

  const handleAddToWatchlist = async () => {
    try {
      if (inWatchlist) { await api.delete(`/watchlist/${id}`); setInWatchlist(false); }
      else { await api.post(`/watchlist/${id}`); setInWatchlist(true); }
    } catch (error) { console.error(error); }
  };

  const handleFavorite = async () => {
    try {
      if (inFavorites) { await api.delete(`/favorites/${id}`); setInFavorites(false); }
      else { await api.post(`/favorites/${id}`); setInFavorites(true); }
    } catch (error) { console.error(error); }
  };

  const handleRating = async (rating) => {
    try { await api.post(`/ratings/${id}`, { rating }); setUserRating(rating); } catch (error) { console.error(error); }
  };

  if (loading) return <LoadingSpinner />;
  if (!movie) return <div className="text-white p-8">Movie not found</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative h-[70vh] md:h-[80vh]">
        <img src={movie.backdropPath ? `https://image.tmdb.org/t/p/original${movie.backdropPath}` : ''} alt={movie.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-2/3">
          <h1 className="text-4xl md:text-6xl font-bold mb-2">{movie.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
            <span>{new Date(movie.releaseDate).getFullYear()}</span>
            <span className="flex items-center"><Star size={16} className="fill-yellow-400 text-yellow-400 mr-1" />{movie.rating?.toFixed(1)}</span>
            {movie.runtime && <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>}
            <span className="flex items-center"><Clock size={16} className="mr-1" /> {movie.status}</span>
          </div>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl mb-4">{movie.overview}</p>
          <div className="flex flex-wrap gap-4 items-center">
            <button onClick={() => navigate(`/watch/${id}`)} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-full flex items-center gap-2"><Play size={20} /> Play</button>
            <button onClick={handleAddToWatchlist} className={`border rounded-full p-2.5 transition ${inWatchlist ? 'bg-red-600 border-red-600' : 'border-gray-400 hover:border-white'}`}><Plus size={20} /></button>
            <button onClick={handleFavorite} className={`border rounded-full p-2.5 transition ${inFavorites ? 'bg-red-600 border-red-600' : 'border-gray-400 hover:border-white'}`}><Heart size={20} fill={inFavorites ? 'currentColor' : 'none'} /></button>
            {movie.trailer && <button onClick={() => setShowTrailer(true)} className="border border-gray-400 hover:border-white rounded-full p-2.5 transition"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3l12 7-12 7V3z" /></svg></button>}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-2">Genres</h2>
            <div className="flex flex-wrap gap-2 mb-4">{movie.genres.map(g => <span key={g} className="bg-gray-800 px-3 py-1 rounded-full text-sm">{g}</span>)}</div>
            {movie.director && <p className="text-gray-400 text-sm mb-2"><span className="text-white">Director:</span> {movie.director}</p>}
            {movie.cast && movie.cast.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-bold mb-2">Cast</h3>
                <div className="flex flex-wrap gap-4">
                  {movie.cast.slice(0,8).map(actor => (
                    <div key={actor.id} className="text-center w-16">
                      <img src={actor.profilePath ? `https://image.tmdb.org/t/p/w185${actor.profilePath}` : '/placeholder.jpg'} alt={actor.name} className="w-16 h-16 rounded-full object-cover mx-auto" />
                      <p className="text-xs mt-1">{actor.name}</p>
                      <p className="text-xs text-gray-400">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Your Rating</h3>
            <RatingStars rating={userRating || 0} onRate={handleRating} />
            {userRating ? <p className="text-sm text-gray-400 mt-1">You rated {userRating} stars</p> : <p className="text-sm text-gray-400 mt-1">Rate this movie</p>}
          </div>
        </div>
        {movie.recommendations && movie.recommendations.length > 0 && <MovieGrid movies={movie.recommendations} title="Recommendations" />}
        {movie.similar && movie.similar.length > 0 && <MovieGrid movies={movie.similar} title="Similar Movies" />}
      </div>
      {showTrailer && movie.trailer && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black">
            <button className="absolute top-2 right-2 text-white bg-black/70 rounded-full p-1 hover:bg-red-600 transition" onClick={() => setShowTrailer(false)}><X size={28} /></button>
            <iframe src={`https://www.youtube.com/embed/${movie.trailer}?autoplay=1`} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen title="Trailer" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;