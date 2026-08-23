import React from 'react';

const Home = () => {
  // Dummy movie data (same as before, but you can change titles)
  const movies = [
    { id: 1, title: 'Stranger Things', overview: 'A group of kids uncover supernatural mysteries.' },
    { id: 2, title: 'The Witcher', overview: 'A monster hunter struggles to find his place.' },
    { id: 3, title: 'Money Heist', overview: 'A mastermind plans the biggest heist.' },
    { id: 4, title: 'The Crown', overview: 'The reign of Queen Elizabeth II.' },
    { id: 5, title: 'Black Mirror', overview: 'A dystopian anthology series.' },
    { id: 6, title: 'Breaking Bad', overview: 'A high school teacher turns to cooking meth.' },
    { id: 7, title: 'Game of Thrones', overview: 'Noble families fight for the Iron Throne.' },
    { id: 8, title: 'The Office', overview: 'A mockumentary on a quirky office staff.' },
    { id: 9, title: 'Friends', overview: 'Six friends navigate life and love.' },
    { id: 10, title: 'The Mandalorian', overview: 'A lone bounty hunter in the Star Wars galaxy.' },
  ];

  const heroMovie = {
    id: 999,
    title: 'Featured Movie',
    overview: 'A breathtaking journey through space and time. Watch the trailer now.',
  };

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Hero Section */}
      <div className="relative w-full h-[85vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://picsum.photos/seed/hero/1920/1080)`,
          }}
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-16 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            {heroMovie.title}
          </h1>
          <p className="text-gray-300 text-base md:text-lg mt-4 max-w-xl">
            {heroMovie.overview}
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <button className="bg-white text-black px-8 py-3 rounded-md font-semibold text-lg hover:bg-gray-200 transition flex items-center gap-2">
              <span>▶</span> Play
            </button>
            <button className="bg-gray-600/70 text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-gray-600 transition">
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Movie Rows */}
      <div className="relative z-10 -mt-20 px-4 md:px-8 pb-10 space-y-8">
        {[
          { title: '🔥 Trending Now', movies: movies.slice(0, 5) },
          { title: '⭐ Popular Movies', movies: movies.slice(3, 8) },
          { title: '🏆 Top Rated', movies: movies.slice(5, 10) },
        ].map((row, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-semibold">{row.title}</h2>
              <button className="text-sm text-gray-400 hover:text-white transition">
                See All →
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4">
              {row.movies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex-shrink-0 w-44 md:w-52 transition transform hover:scale-105 duration-200 cursor-pointer"
                >
                  <img
                    src={`https://picsum.photos/seed/${movie.id + idx * 100}/300/450`}
                    alt={movie.title}
                    className="w-full rounded-lg shadow-lg"
                  />
                  <p className="mt-2 text-sm text-gray-300 text-center truncate">
                    {movie.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;