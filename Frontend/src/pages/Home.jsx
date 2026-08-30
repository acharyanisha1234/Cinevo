import React, { useState, useEffect } from 'react';
import { getTrending, getPopular, getTopRated, getNowPlaying, getUpcoming } from '../services/movieService';
import Hero from '../components/movie/Hero';
import MovieRow from '../components/movie/MovieRow';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Home = () => {
  console.log('🏠 Home component rendering');
  
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('🔄 useEffect is running!');
    
    const fetchMovies = async () => {
      console.log('📡 Starting movie fetches...');
      try {
        console.log('📡 Fetching trending...');
        const trendingRes = await getTrending();
        console.log('✅ Trending response:', trendingRes.data.data.results?.length || 0, 'movies');
        
        console.log('📡 Fetching popular...');
        const popularRes = await getPopular();
        console.log('✅ Popular response:', popularRes.data.data.results?.length || 0, 'movies');
        
        console.log('📡 Fetching top rated...');
        const topRatedRes = await getTopRated();
        console.log('✅ Top rated response:', topRatedRes.data.data.results?.length || 0, 'movies');
        
        console.log('📡 Fetching now playing...');
        const nowPlayingRes = await getNowPlaying();
        console.log('✅ Now playing response:', nowPlayingRes.data.data.results?.length || 0, 'movies');
        
        console.log('📡 Fetching upcoming...');
        const upcomingRes = await getUpcoming();
        console.log('✅ Upcoming response:', upcomingRes.data.data.results?.length || 0, 'movies');

        setTrending(trendingRes.data.data.results || []);
        setPopular(popularRes.data.data.results || []);
        setTopRated(topRatedRes.data.data.results || []);
        setNowPlaying(nowPlayingRes.data.data.results || []);
        setUpcoming(upcomingRes.data.data.results || []);
        
        console.log('✅ All movies fetched successfully!');
        setLoading(false);
      } catch (err) {
        console.error('❌ Error fetching movies:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, []);

  if (loading) {
    console.log('⏳ Showing loading spinner');
    return <LoadingSpinner />;
  }

  if (error) {
    console.log('❌ Showing error:', error);
    return <div className="text-red-500 text-center py-20">Error: {error}</div>;
  }

  console.log('✅ Rendering movies - trending:', trending.length, 'popular:', popular.length);

  return (
    <div className="bg-black text-white min-h-screen">
      <Hero movies={trending} />
      <MovieRow title="Trending Now" movies={trending} />
      <MovieRow title="Popular" movies={popular} />
      <MovieRow title="Top Rated" movies={topRated} />
      <MovieRow title="Now Playing" movies={nowPlaying} />
      <MovieRow title="Upcoming" movies={upcoming} />
    </div>
  );
};

export default Home;