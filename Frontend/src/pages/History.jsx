import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, Trash2, Eye, CheckCircle, ArrowLeft } from 'lucide-react';
import api, { normalizeMovie } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('cinevo_token');
      
      if (!token) {
        setError('Please login to view your watch history');
        setLoading(false);
        return;
      }

      const response = await api.get('/history');
      console.log('History API response:', response.data);
      
      // Extract history data
      let historyData = [];
      if (Array.isArray(response.data)) {
        historyData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        historyData = response.data.data;
      } else if (response.data?.history && Array.isArray(response.data.history)) {
        historyData = response.data.history;
      }

      // If no history data, try to get from localStorage
      if (historyData.length === 0) {
        const localHistory = JSON.parse(localStorage.getItem('cinevo_history') || '[]');
        if (localHistory.length > 0) {
          historyData = localHistory;
        }
      }

      // Fetch movie details for each history entry
      const historyWithMovies = await Promise.all(
        historyData
          .filter(entry => entry.movieId || entry.id)
          .map(async (entry) => {
            try {
              const movieId = entry.movieId || entry.id;
              let movieData;
              
              // Check if entry already has movie data
              if (entry.movie && entry.movie.title) {
                movieData = entry.movie;
              } else {
                try {
                  const movieRes = await api.get(`/movies/${movieId}`);
                  movieData = movieRes.data?.data || movieRes.data;
                } catch (err) {
                  // If movie not found in API, try to use stored data
                  if (entry.movieData) {
                    movieData = entry.movieData;
                  } else {
                    return null;
                  }
                }
              }
              
              const normalized = normalizeMovie(movieData);
              
              if (normalized) {
                return {
                  ...entry,
                  movie: normalized,
                  progress: entry.progress || 0,
                  duration: entry.duration || 0,
                  lastWatchedAt: entry.lastWatchedAt || entry.updatedAt || entry.createdAt || new Date().toISOString()
                };
              }
              return null;
            } catch (err) {
              console.error(`Failed to fetch movie ${entry.movieId}:`, err);
              return null;
            }
          })
      );

      // Filter out null entries and sort by last watched (newest first)
      const validHistory = historyWithMovies
        .filter(Boolean)
        .sort((a, b) => {
          const dateA = new Date(a.lastWatchedAt || 0);
          const dateB = new Date(b.lastWatchedAt || 0);
          return dateB - dateA;
        });

      console.log('Processed history:', validHistory);
      setHistory(validHistory);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching history:', err);
      
      // Try to load from localStorage as fallback
      try {
        const localHistory = JSON.parse(localStorage.getItem('cinevo_history') || '[]');
        if (localHistory.length > 0) {
          setHistory(localHistory);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error('Error loading from localStorage:', e);
      }
      
      setError('Failed to load watch history');
      setLoading(false);
    }
  };

  const handleRemoveFromHistory = async (entryId, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/history/${entryId}`);
      setHistory(history.filter(entry => entry._id !== entryId && entry.id !== entryId));
      
      // Also remove from localStorage
      const localHistory = JSON.parse(localStorage.getItem('cinevo_history') || '[]');
      const updatedLocal = localHistory.filter(entry => entry.id !== entryId && entry._id !== entryId);
      localStorage.setItem('cinevo_history', JSON.stringify(updatedLocal));
    } catch (err) {
      console.error('Error removing from history:', err);
      // Remove from local state anyway
      setHistory(history.filter(entry => entry._id !== entryId && entry.id !== entryId));
    }
  };

  const handleClearAllHistory = async () => {
    if (!window.confirm('Are you sure you want to clear all watch history?')) return;
    
    try {
      await api.delete('/history');
      setHistory([]);
      localStorage.removeItem('cinevo_history');
    } catch (err) {
      console.error('Error clearing history:', err);
      setHistory([]);
      localStorage.removeItem('cinevo_history');
    }
  };

  const handleContinueWatching = (movieId) => {
    navigate(`/watch/${movieId}`);
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const formatTime = (seconds) => {
    if (!seconds || seconds === 0) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const getProgressPercentage = (progress, duration) => {
    if (!duration || duration === 0) return 0;
    return Math.min(Math.round((progress / duration) * 100), 100);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      
      if (diff < 60000) return 'Just now';
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
      if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
      if (diff < 2592000000) return `${Math.floor(diff / 604800000)}w ago`;
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'Recently';
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <Clock size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-red-600">Watch History</h1>
              <p className="text-neutral-400 text-sm mt-1">
                {history.length} {history.length === 1 ? 'movie' : 'movies'} watched
              </p>
            </div>
          </div>
          
          {history.length > 0 && (
            <button
              onClick={handleClearAllHistory}
              className="bg-red-600/20 hover:bg-red-600/30 text-red-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye size={32} className="text-neutral-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Watch History</h2>
            <p className="text-neutral-400 mb-6">Movies you watch will appear here</p>
            <button
              onClick={() => navigate('/')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Start Watching
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((entry) => {
              const movie = entry.movie;
              if (!movie) return null;
              
              const progressPercent = getProgressPercentage(entry.progress, entry.duration);
              const isWatched = progressPercent >= 95;
              const movieId = movie.id || movie.tmdbId || movie._id;
              
              return (
                <div
                  key={entry._id || entry.id || movieId}
                  className="group bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 hover:border-red-500/50 transition-all duration-300 cursor-pointer"
                  onClick={() => handleMovieClick(movieId)}
                >
                  <div className="flex flex-col sm:flex-row gap-4 p-4">
                    {/* Movie Poster */}
                    <div 
                      className="relative w-full sm:w-32 md:w-40 flex-shrink-0 aspect-[2/3] rounded-md overflow-hidden"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContinueWatching(movieId);
                      }}
                    >
                      <img
                        src={movie.posterPath || 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster'}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster';
                        }}
                      />
                      
                      {/* Play Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play size={32} className="text-white" />
                      </div>
                      
                      {/* Progress Bar */}
                      {!isWatched && progressPercent > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-neutral-700">
                          <div
                            className="h-full bg-red-600 transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      )}
                      
                      {/* Watched Badge */}
                      {isWatched && (
                        <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                          <CheckCircle size={12} />
                          Watched
                        </div>
                      )}
                    </div>

                    {/* Movie Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h3 className="text-lg font-bold text-white hover:text-red-500 transition-colors truncate">
                          {movie.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-neutral-400">
                          <span>{movie.year || 'N/A'}</span>
                          {movie.rating && (
                            <span className="flex items-center gap-1">
                              ⭐ {movie.rating}
                            </span>
                          )}
                          {entry.duration > 0 && (
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {formatTime(entry.duration)}
                            </span>
                          )}
                        </div>
                        
                        {entry.lastWatchedAt && (
                          <p className="text-xs text-neutral-500 mt-2">
                            Last watched: {formatDate(entry.lastWatchedAt)}
                          </p>
                        )}
                        
                        {!isWatched && progressPercent > 0 && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-neutral-400 mb-1">
                              <span>Progress</span>
                              <span>{progressPercent}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-red-600 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                            <p className="text-xs text-neutral-500 mt-1">
                              {formatTime(entry.progress)} / {formatTime(entry.duration)}
                            </p>
                          </div>
                        )}
                        
                        {isWatched && (
                          <div className="mt-3 flex items-center gap-2 text-green-500 text-sm">
                            <CheckCircle size={16} />
                            <span>Completed</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContinueWatching(movieId);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          <Play size={16} />
                          {isWatched ? 'Watch Again' : 'Continue'}
                        </button>
                        
                        <button
                          onClick={(e) => handleRemoveFromHistory(entry._id || entry.id, e)}
                          className="bg-neutral-800 hover:bg-red-600/20 text-neutral-400 hover:text-red-500 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;