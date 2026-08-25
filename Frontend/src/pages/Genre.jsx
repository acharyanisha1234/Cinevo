import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMoviesByGenre, getGenres } from '../services/movieService';
import MovieGrid from '../components/movie/MovieGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const Genre = () => {
  const { genre } = useParams();
  const [movies, setMovies] = useState([]);
  const [genreName, setGenreName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const genresRes = await getGenres();
        const genres = genresRes.data.data;
        const found = genres.find(g => g.name.toLowerCase() === genre.toLowerCase());
        if (!found) { setLoading(false); return; }
        setGenreName(found.name);
        const moviesRes = await getMoviesByGenre(found.id);
        setMovies(moviesRes.data.data.results || []);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchGenre();
  }, [genre]);

  if (loading) return <LoadingSpinner />;
  if (!genreName) return <EmptyState message={`Genre "${genre}" not found`} />;
  if (movies.length === 0) return <EmptyState message={`No movies in "${genreName}"`} />;
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-4">{genreName} Movies</h2>
      <MovieGrid movies={movies} />
    </div>
  );
};

export default Genre;