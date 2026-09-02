import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { normalizeMovie } from '../services/api';

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Check local storage for favorited state
    const localFavs = JSON.parse(localStorage.getItem('cinevo_favorites') || '[]');
    setIsFavorited(localFavs.includes(String(id)));

    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get(`/movies/${id}`);
        const normalized = normalizeMovie(res.data);

        if (isMounted) {
          if (normalized) {
            setMovie(normalized);
          } else {
            setError('Could not format movie details.');
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Watch fetch error:', err);
          setError(
            err.response?.data?.message ||
              'Could not fetch movie details from server.'
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) fetchMovieData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const toggleLocalFavorite = () => {
    const localFavs = JSON.parse(localStorage.getItem('cinevo_favorites') || '[]');
    const idStr = String(id);
    let updated = [];

    if (localFavs.includes(idStr)) {
      updated = localFavs.filter((favId) => favId !== idStr);
      setIsFavorited(false);
    } else {
      updated = [...localFavs, idStr];
      setIsFavorited(true);
    }

    localStorage.setItem('cinevo_favorites', JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Streaming Error Detected</h2>
        <p className="text-neutral-400 mb-6 max-w-md">{error || 'Movie not found.'}</p>
        <div className="flex gap-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded"
          >
            Retry Playback
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold px-4 py-2 rounded"
          >
            Browse Catalog
          </button>
        </div>
      </div>
    );
  }

  const isEmbed = movie.videoUrl && movie.videoUrl.includes('http');

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header Bar */}
      <div className="p-4 flex items-center justify-between bg-neutral-900 border-b border-neutral-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-neutral-400 hover:text-white font-bold text-sm"
          >
            ← Back
          </button>
          <h1 className="text-lg font-bold truncate max-w-md">{movie.title}</h1>
        </div>
        <button
          onClick={toggleLocalFavorite}
          className={`px-4 py-2 rounded text-sm font-bold flex items-center gap-2 ${
            isFavorited
              ? 'bg-red-600 text-white'
              : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          {isFavorited ? '❤️ Favorited' : '🤍 Add to Favorites'}
        </button>
      </div>

      {/* Video Player */}
      <div className="flex-1 flex items-center justify-center bg-black p-4">
        {movie.videoUrl ? (
          <div className="w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl relative">
            {isEmbed && movie.videoUrl.includes('2embed') ? (
              <iframe
                src={movie.videoUrl}
                title={movie.title}
                className="w-full h-full border-0"
                allowFullScreen
              ></iframe>
            ) : (
              <video className="w-full h-full" controls autoPlay src={movie.videoUrl}>
                Your browser does not support video playback.
              </video>
            )}
          </div>
        ) : (
          <div className="text-center p-8 bg-neutral-900 rounded-lg max-w-lg border border-neutral-800">
            <h3 className="text-xl font-bold text-yellow-500 mb-2">No Video Stream Found</h3>
            <p className="text-neutral-400 text-sm mb-4">
              This movie record lacks an active stream link in the database.
            </p>
            <Link
              to="/"
              className="inline-block bg-neutral-800 hover:bg-neutral-700 text-white font-bold px-4 py-2 rounded text-sm"
            >
              Browse Catalog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watch;