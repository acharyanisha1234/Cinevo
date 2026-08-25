import React from 'react';

// Hero component - displays a prominent movie banner with title, overview, and action buttons
const Hero = ({ movie }) => {
  // If no movie is provided, render nothing
  if (!movie) return null;

  return (
    <div className="relative h-[80vh] w-full bg-black">
      {/* Background image - using a placeholder service with movie ID for consistency */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{
          backgroundImage: `url(https://picsum.photos/seed/${movie.id}/1280/720)`,
        }}
      />
      {/* Gradient overlay to make text readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      {/* Content container */}
      <div className="relative z-10 flex flex-col justify-center h-full px-8 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white">{movie.title}</h1>
        <p className="text-gray-300 text-sm md:text-base mt-4 line-clamp-3">
          {movie.overview}
        </p>
        {/* Action buttons */}
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
  );
};

export default Hero;