import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Clock, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/history');
        const entries = res.data.data;
        const historyWithMovies = await Promise.all(entries.map(async entry => {
          const movieRes = await api.get(`/movies/${entry.movieId}`);
          return { ...entry, movie: movieRes.data.data };
        }));
        setHistory(historyWithMovies);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchHistory();
  }, []);

  const removeEntry = async (movieId) => {
    try { await api.delete(`/history/${movieId}`); setHistory(history.filter(h => h.movieId !== movieId)); } catch (error) { console.error(error); }
  };

  if (loading) return <LoadingSpinner />;
  if (history.length === 0) return <EmptyState message="No watch history" icon={Clock} />;
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-4">Watch History</h2>
      <div className="space-y-4">
        {history.map(entry => (
          <div key={entry.movieId} className="flex items-center bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition">
            <Link to={`/movie/${entry.movieId}`} className="flex-1 flex items-center space-x-4">
              <img src={entry.movie.posterPath ? `https://image.tmdb.org/t/p/w92${entry.movie.posterPath}` : ''} alt={entry.movie.title} className="w-12 h-16 object-cover rounded" />
              <div>
                <p className="font-semibold">{entry.movie.title}</p>
                <p className="text-sm text-gray-400">Progress: {Math.floor(entry.progress / 60)}m / {Math.floor(entry.duration / 60)}m</p>
                <p className="text-xs text-gray-500">Last watched: {new Date(entry.lastWatchedAt).toLocaleDateString()}</p>
              </div>
            </Link>
            <button onClick={() => removeEntry(entry.movieId)} className="text-gray-400 hover:text-red-500 p-2"><X size={20} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;