import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import MovieCard from '../components/movie/MovieCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api, { normalizeMovie } from '../services/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/movies/search?q=${encodeURIComponent(query)}`);
        const list = res.data?.data || res.data?.results || res.data || [];
        setResults(list.map(normalizeMovie));
      } catch (err) {
        console.error('Search query error:', err);
        setError('Failed to fetch search results. Please check connection.');
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-12 py-24">
      {/* Search Input Bar */}
      <div className="max-w-3xl mx-auto relative mb-12">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={22} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies by title, genre, or keyword..."
          className="w-full bg-neutral-900 border border-neutral-800 rounded-full py-4 pl-12 pr-12 text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 text-lg transition shadow-xl"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Results Rendering */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center text-red-500 font-medium py-12">{error}</div>
      ) : results.length > 0 ? (
        <div>
          <h2 className="text-xl font-bold mb-6 text-neutral-300">
            Search Results for "<span className="text-white">{query}</span>"
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      ) : query.trim() ? (
        <div className="text-center py-16 text-neutral-400">
          <p className="text-xl font-semibold mb-1">No movies found</p>
          <p className="text-sm">Try searching for alternative keywords or movie titles.</p>
        </div>
      ) : (
        <div className="text-center py-20 text-neutral-500">
          <SearchIcon size={48} className="mx-auto mb-4 opacity-40" />
          <p className="text-lg">Type above to discover movies available on Cinevo.</p>
        </div>
      )}
    </div>
  );
};

export default Search;