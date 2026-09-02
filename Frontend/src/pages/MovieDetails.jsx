import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Play, Heart, Star, Calendar, Clock, Film, Info, ArrowLeft, Share2, Download } from 'lucide-react';
import api, { normalizeMovie } from '../services/api';
import { useFavorites } from '../context/FavoriteContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ShareModal from '../components/common/ShareModal';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [cast, setCast] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); // New state

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await api.get(`/movies/${id}`);
        console.log('Movie details response:', res.data);
        
        const movieData = res.data?.data || res.data;
        const normalized = normalizeMovie(movieData);
        
        if (normalized) {
          setMovie(normalized);
        } else {
          setError('Could not load movie details');
        }
        
        try {
          const similarRes = await api.get(`/movies/${id}/similar`);
          const similarData = similarRes.data?.data || similarRes.data || [];
          const normalizedSimilar = similarData.map(normalizeMovie).filter(Boolean);
          setSimilarMovies(normalizedSimilar);
        } catch (err) {
          console.log('No similar movies found');
        }
        
        try {
          const castRes = await api.get(`/movies/${id}/cast`);
          const castData = castRes.data?.data || castRes.data || [];
          setCast(castData.slice(0, 10));
        } catch (err) {
          console.log('No cast found');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError(err.response?.data?.message || 'Failed to load movie details');
        setLoading(false);
      }
    };
    
    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  const handlePlay = () => {
    if (movie) {
      navigate(`/watch/${movie.id}`);
    }
  };

  const handleFavorite = () => {
    if (movie) {
      toggleFavorite(movie);
    }
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return date;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <Film size={64} className="text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Movie Not Found</h2>
          <p className="text-neutral-400 mb-6">{error || 'The movie you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isFav = isFavorite(movie.id);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-20 left-4 z-50 bg-black/60 backdrop-blur-sm hover:bg-black/80 p-2 rounded-full transition-colors"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Hero Section */}
      <div className="relative">
        <div 
          className="absolute inset-0 h-[70vh] bg-cover bg-center"
          style={{
            backgroundImage: `url(${movie.backdropPath || movie.posterPath})`,
          }}
        />
        
        <div className="absolute inset-0 h-[70vh] bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
        
        <div className="relative z-10 h-[70vh] flex items-end px-4 md:px-12 pb-12">
          <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto w-full">
            <div className="hidden md:block flex-shrink-0">
              <img
                src={movie.posterPath}
                alt={movie.title}
                className="w-64 rounded-lg shadow-2xl shadow-red-600/10"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster';
                }}
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-300 mb-4">
                {movie.year && (
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    {movie.year}
                  </span>
                )}
                {movie.rating && (
                  <span className="flex items-center gap-1 text-yellow-500">
                    <Star size={16} fill="currentColor" />
                    {movie.rating}/10
                  </span>
                )}
                {movie.runtime && (
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {formatRuntime(movie.runtime)}
                  </span>
                )}
                {movie.genres && movie.genres.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Film size={16} />
                    {movie.genres.slice(0, 3).join(', ')}
                  </span>
                )}
              </div>
              
              <p className="text-neutral-300 text-sm md:text-base max-w-2xl mb-6 line-clamp-3">
                {movie.overview || 'No description available.'}
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handlePlay}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105"
                >
                  <Play size={20} fill="currentColor" />
                  Play Now
                </button>
                
                <button
                  onClick={handleFavorite}
                  className={`
                    font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105
                    ${isFav 
                      ? 'bg-red-600/20 text-red-500 hover:bg-red-600/30' 
                      : 'bg-neutral-800 text-white hover:bg-neutral-700'
                    }
                  `}
                >
                  <Heart size={20} className={isFav ? 'fill-red-500' : ''} />
                  {isFav ? 'Favorited' : 'Add to Favorites'}
                </button>
                
                {/* Share Button - Updated */}
                <button
                  onClick={handleShare}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105"
                >
                  <Share2 size={20} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the component remains same... */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-8">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-neutral-800 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 px-1 transition-colors ${
              activeTab === 'overview' 
                ? 'text-red-500 border-b-2 border-red-500' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('cast')}
            className={`pb-2 px-1 transition-colors ${
              activeTab === 'cast' 
                ? 'text-red-500 border-b-2 border-red-500' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Cast
          </button>
          <button
            onClick={() => setActiveTab('similar')}
            className={`pb-2 px-1 transition-colors ${
              activeTab === 'similar' 
                ? 'text-red-500 border-b-2 border-red-500' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Similar Movies
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[200px]">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <p className="text-neutral-300 leading-relaxed">
                {movie.overview || 'No description available for this movie.'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-neutral-900 p-4 rounded-lg">
                  <p className="text-neutral-400 text-sm">Release Date</p>
                  <p className="font-medium">{formatDate(movie.releaseDate)}</p>
                </div>
                <div className="bg-neutral-900 p-4 rounded-lg">
                  <p className="text-neutral-400 text-sm">Runtime</p>
                  <p className="font-medium">{formatRuntime(movie.runtime)}</p>
                </div>
                {movie.genres && movie.genres.length > 0 && (
                  <div className="bg-neutral-900 p-4 rounded-lg">
                    <p className="text-neutral-400 text-sm">Genres</p>
                    <p className="font-medium">{movie.genres.join(', ')}</p>
                  </div>
                )}
                {movie.rating && (
                  <div className="bg-neutral-900 p-4 rounded-lg">
                    <p className="text-neutral-400 text-sm">Rating</p>
                    <p className="font-medium text-yellow-500">⭐ {movie.rating}/10</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'cast' && (
            <div>
              {cast.length === 0 ? (
                <p className="text-neutral-400">No cast information available.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {cast.map((person, index) => (
                    <div key={index} className="bg-neutral-900 p-4 rounded-lg text-center">
                      <div className="w-20 h-20 rounded-full bg-neutral-800 mx-auto mb-2 flex items-center justify-center">
                        <span className="text-2xl font-bold text-neutral-600">
                          {person.name ? person.name.charAt(0) : '?'}
                        </span>
                      </div>
                      <p className="font-medium text-sm truncate">{person.name || 'Unknown'}</p>
                      <p className="text-xs text-neutral-400 truncate">{person.character || 'N/A'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'similar' && (
            <div>
              {similarMovies.length === 0 ? (
                <p className="text-neutral-400">No similar movies found.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {similarMovies.slice(0, 10).map((similar) => (
                    <Link
                      key={similar.id}
                      to={`/movie/${similar.id}`}
                      className="group cursor-pointer"
                    >
                      <div className="bg-neutral-900 rounded-lg overflow-hidden transition-transform group-hover:scale-105">
                        <img
                          src={similar.posterPath}
                          alt={similar.title}
                          className="w-full aspect-[2/3] object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster';
                          }}
                        />
                        <div className="p-2">
                          <p className="text-sm font-medium truncate group-hover:text-red-500 transition-colors">
                            {similar.title}
                          </p>
                          <p className="text-xs text-neutral-400">{similar.year || 'N/A'}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        movie={movie}
        url={`${window.location.origin}/movie/${movie.id}`}
      />
    </div>
  );
};

export default MovieDetails;