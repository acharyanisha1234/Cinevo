import React, { useState, useEffect } from 'react';
import Hero from '../components/movie/Hero';
import MovieRow from '../components/movie/MovieRow';

// ---------- Dummy Data (more realistic) ----------
const generateMovies = (count, offset = 0) =>
  Array.from({ length: count }, (_, i) => ({
    id: offset + i + 1,
    title: `Movie ${offset + i + 1}`,
    name: `Movie ${offset + i + 1}`,
    overview: `This is the overview for movie ${offset + i + 1}. A fascinating story that will keep you on the edge of your seat.`,
    poster_path: `https://picsum.photos/seed/${offset + i + 1}/300/450`,
    backdrop_path: `https://picsum.photos/seed/${offset + i + 1}/1280/720`,
    vote_average: (3 + Math.random() * 2).toFixed(1),
    release_date: `202${Math.floor(Math.random() * 4)}-01-01`,
  }));

// Pre‑defined sets
const trending = generateMovies(12, 100);
const popular = generateMovies(12, 200);
const topRated = generateMovies(12, 300);
const continueWatching = generateMovies(6, 400);
const myList = generateMovies(8, 500);
const newReleases = generateMovies(10, 600);

// Hero carousel slides (3 featured movies)
const heroSlides = [
  {
    id: 999,
    title: 'Dune: Part Two',
    overview: 'Paul Atreides continues his journey to avenge his family and fulfill his destiny.',
    backdrop_path: 'https://picsum.photos/seed/dune/1920/1080',
  },
  {
    id: 998,
    title: 'The Batman',
    overview: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city\'s hidden corruption.',
    backdrop_path: 'https://picsum.photos/seed/batman/1920/1080',
  },
  {
    id: 997,
    title: 'Interstellar',
    overview: 'A team of explorers travels through a wormhole in space in an attempt to ensure humanity\'s survival.',
    backdrop_path: 'https://picsum.photos/seed/interstellar/1920/1080',
  },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Auto‑play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Simulate loading (remove this when you fetch real data)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // If still loading, show skeleton
  if (loading) {
    return (
      <div className="bg-black min-h-screen animate-pulse">
        <div className="h-[80vh] w-full bg-gray-900" />
        <div className="relative z-10 -mt-20 px-4 space-y-8 pb-10">
          {[...Array(4)].map((_, i) => (
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

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Carousel */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        {heroSlides.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Hero movie={movie} />
          </div>
        ))}
        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Movie Rows */}
      <div className="relative z-10 -mt-20 px-4 md:px-8 pb-10 space-y-8">
        <MovieRow title="🔥 Trending Now" movies={trending} seeAllLink="/trending" />
        <MovieRow title="⭐ Popular Movies" movies={popular} seeAllLink="/movies" />
        <MovieRow title="🏆 Top Rated" movies={topRated} seeAllLink="/top-rated" />
        <MovieRow title="⏳ Continue Watching" movies={continueWatching} seeAllLink="/continue" />
        <MovieRow title="📋 My List" movies={myList} seeAllLink="/my-list" />
        <MovieRow title="🆕 New Releases" movies={newReleases} seeAllLink="/new" />
      </div>
    </div>
  );
};

export default Home;