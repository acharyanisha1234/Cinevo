import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../services/movieService';
import MovieGrid from '../components/movie/MovieGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query.trim()) { setMovies([]); return; }
    const fetchResults = async () => {
      setLoading(true); setError('');
      try {
        const res = await searchMovies(query);
        setMovies(res.data.data.results || []);
      } catch { setError('Failed to fetch search results.'); } finally { setLoading(false); }
    };
    fetchResults();
  }, [query]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-8">{error}</div>;
  if (!query.trim()) return <EmptyState message="Search for your favorite movies" icon={SearchIcon} />;
  if (movies.length === 0) return <EmptyState message={`No results found for "${query}"`} />;
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-4">Results for "{query}"</h2>
      <MovieGrid movies={movies} />
    </div>
  );
};

export default Search;