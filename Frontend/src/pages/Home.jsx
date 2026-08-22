import React from 'react';

const Home = () => {
  // Dummy movie data
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

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{
            backgroundImage: `url(https://picsum.photos/seed/hero/1280/720)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 flex flex-col justify-center h-full px-8 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold">Featured Movie</h1>
          <p className="text-gray-300 text-sm md:text-base mt-4">
            This is a placeholder hero banner. Tomorrow you can replace it with real data from TMDB API.
          </p>
          <div className="flex gap-4 mt-6">
            <button className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200">
              ▶ Play
            </button>
            <button className="bg-gray-500/50 text-white px-6 py-2 rounded font-semibold hover:bg-gray-500/70">
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Movie Rows */}
      <div className="relative z-10 -mt-20 pb-10">
        {/* Row 1 */}
        <div className="px-4 py-2">
          <h2 className="text-xl font-semibold mb-2">🔥 Trending Now</h2>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {movies.slice(0, 5).map((movie) => (
              <div key={movie.id} className="flex-shrink-0 w-40">
                <img
                  src={`https://picsum.photos/seed/${movie.id}/300/450`}
                  alt={movie.title}
                  className="rounded-md hover:scale-105 transition duration-200"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 */}
        <div className="px-4 py-2">
          <h2 className="text-xl font-semibold mb-2">Popular Movies</h2>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {movies.slice(3, 8).map((movie) => (
              <div key={movie.id} className="flex-shrink-0 w-40">
                <img
                  src={`https://picsum.photos/seed/${movie.id + 100}/300/450`}
                  alt={movie.title}
                  className="rounded-md hover:scale-105 transition duration-200"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 3 */}
        <div className="px-4 py-2">
          <h2 className="text-xl font-semibold mb-2">Top Rated</h2>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {movies.slice(5, 10).map((movie) => (
              <div key={movie.id} className="flex-shrink-0 w-40">
                <img
                  src={`https://picsum.photos/seed/${movie.id + 200}/300/450`}
                  alt={movie.title}
                  className="rounded-md hover:scale-105 transition duration-200"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;