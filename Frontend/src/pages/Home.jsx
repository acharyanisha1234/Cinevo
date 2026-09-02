import React, { useState, useEffect } from 'react';
import { getTrending, getPopular, getTopRated, getNowPlaying, getUpcoming } from '../services/movieService';
import Hero from '../components/movie/Hero';
import MovieRow from '../components/movie/MovieRow';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api, { normalizeMovie } from '../services/api';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const extractMovies = (res) => {
    if (!res) return [];
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray(res.data.results)) return res.data.results;
    if (res.data?.data && Array.isArray(res.data.data.results)) return res.data.data.results;
    if (res.data?.data && Array.isArray(res.data.data)) return res.data.data;
    return [];
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [trendingRes, popularRes, topRatedRes, nowPlayingRes, upcomingRes] = await Promise.all([
          getTrending().catch(() => ({ data: [] })),
          getPopular().catch(() => ({ data: [] })),
          getTopRated().catch(() => ({ data: [] })),
          getNowPlaying().catch(() => ({ data: [] })),
          getUpcoming().catch(() => ({ data: [] })),
        ]);

        const trendingData = extractMovies(trendingRes).map(normalizeMovie).filter(Boolean);
        const popularData = extractMovies(popularRes).map(normalizeMovie).filter(Boolean);
        const topRatedData = extractMovies(topRatedRes).map(normalizeMovie).filter(Boolean);
        const nowPlayingData = extractMovies(nowPlayingRes).map(normalizeMovie).filter(Boolean);
        const upcomingData = extractMovies(upcomingRes).map(normalizeMovie).filter(Boolean);

        setTrending(trendingData);
        setPopular(popularData);
        setTopRated(topRatedData);
        setNowPlaying(nowPlayingData);
        setUpcoming(upcomingData);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to fetch movies');
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return <div className="text-red-500 text-center py-20 font-semibold">Error: {error}</div>;
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Hero movies={trending} />
      
      <MovieRow 
        title="Trending Now" 
        movies={trending} 
        category="trending"
      />
      <MovieRow 
        title="Popular" 
        movies={popular} 
        category="popular"
      />
      <MovieRow 
        title="Top Rated" 
        movies={topRated} 
        category="top-rated"
      />
      <MovieRow 
        title="Now Playing" 
        movies={nowPlaying} 
        category="now-playing"
      />
      <MovieRow 
        title="Upcoming" 
        movies={upcoming} 
        category="upcoming"
      />
    </div>
  );
};

export default Home;