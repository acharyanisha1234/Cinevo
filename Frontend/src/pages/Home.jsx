// pages/Home.jsx
import React, { useState, useEffect } from 'react';
import Hero from '../components/movie/Hero';
import MovieRow from '../components/movie/MovieRow';
import {
  getTrending,
  getPopular,
  getTopRated,
  getNowPlaying,
  getUpcoming,
} from '../services/movieService';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [myList, setMyList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Fetch all movie lists in parallel
        const [
          trendingRes,
          popularRes,
          topRatedRes,
          nowPlayingRes,
          upcomingRes,
          historyRes,
          watchlistRes,
        ] = await Promise.all([
          getTrending(),
          getPopular(),
          getTopRated(),
          getNowPlaying(),
          getUpcoming(),
          api.get('/history'),
          api.get('/watchlist'),
        ]);

        setTrending(trendingRes.data.data.results || []);
        setPopular(popularRes.data.data.results || []);
        setTopRated(topRatedRes.data.data.results || []);
        setNowPlaying(nowPlayingRes.data.data.results || []);
        setUpcoming(upcomingRes.data.data.results || []);

        // Continue Watching – fetch movie details for each history entry
        const historyEntries = historyRes.data.data || [];
        if (historyEntries.length > 0) {
          const historyMovies = await Promise.all(
            historyEntries.map((entry) =>
              api.get(`/movies/${entry.movieId}`).then((res) => res.data.data)
            )
          );
          setContinueWatching(historyMovies);
        }

        // My List (watchlist)
        const watchlistEntries = watchlistRes.data.data || [];
        if (watchlistEntries.length > 0) {
          const listMovies = await Promise.all(
            watchlistEntries.map((item) =>
              api.get(`/movies/${item.movieId}`).then((res) => res.data.data)
            )
          );
          setMyList(listMovies);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero */}
      <Hero movies={trending} />

      {/* Movie Rows */}
      {continueWatching.length > 0 && (
        <MovieRow title="Continue Watching" movies={continueWatching} />
      )}
      {myList.length > 0 && (
        <MovieRow title="My List" movies={myList} />
      )}
      <MovieRow title="Trending Now" movies={trending} />
      <MovieRow title="Popular" movies={popular} />
      <MovieRow title="Top Rated" movies={topRated} />
      <MovieRow title="Now Playing" movies={nowPlaying} />
      <MovieRow title="Upcoming" movies={upcoming} />
    </div>
  );
};

export default Home;