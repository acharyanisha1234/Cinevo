import React, { useState, useEffect } from 'react';
import Hero from '../components/movie/Hero';
import MovieRow from '../components/movie/MovieRow';
import { getTrending, getMovies } from '../services/api';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trending, setTrending] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [trendingRes, nowPlayingRes, popularRes, topRatedRes, upcomingRes] =
          await Promise.all([
            getTrending('movie', 'week'),
            getMovies('now_playing'),
            getMovies('popular'),
            getMovies('top_rated'),
            getMovies('upcoming'),
          ]);

        setTrending(trendingRes.results || []);
        setNowPlaying(nowPlayingRes.results || []);
        setPopular(popularRes.results || []);
        setTopRated(topRatedRes.results || []);
        setUpcoming(upcomingRes.results || []);

        // Pick first trending with backdrop as featured
        const hero = (trendingRes.results || []).find(m => m.backdrop_path) || 
                     (trendingRes.results || [])[0];
        setFeatured(hero);
      } catch (err) {
        setError('Failed to load movies. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="bg-black min-h-screen animate-pulse">
        <div className="h-[80vh] w-full bg-gray-900" />
        <div className="relative z-10 -mt-20 px-4 space-y-8 pb-10">
          {[...Array(5)].map((_, i) => (
            <div key={i}>
              <div className="h-6 w-48 bg-gray-800 rounded mb-3" />
              <div className="flex gap-3 overflow-x-auto">
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="flex-shrink-0 w-44">
                    <div className="w-full h-64 bg-gray-800 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-600 px-6 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      {/* Hero */}
      {featured && <Hero movie={featured} />}

      {/* Movie Rows */}
      <div className="relative z-10 -mt-20 px-4 md:px-8 pb-10 space-y-8">
        <MovieRow title="🔥 Trending Now" movies={trending} seeAllLink="/trending" />
        <MovieRow title="🎬 Now Playing" movies={nowPlaying} seeAllLink="/now-playing" />
        <MovieRow title="⭐ Popular" movies={popular} seeAllLink="/popular" />
        <MovieRow title="🏆 Top Rated" movies={topRated} seeAllLink="/top-rated" />
        <MovieRow title="📅 Upcoming" movies={upcoming} seeAllLink="/upcoming" />
      </div>
    </div>
  );
};

export default Home;