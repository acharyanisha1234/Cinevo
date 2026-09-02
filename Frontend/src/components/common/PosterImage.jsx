import React, { useState } from 'react';

const PosterImage = ({ src, title, className = '' }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // If no src or error, show placeholder
  if (!src || error) {
    return (
      <div className={`bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center p-4 text-center select-none ${className}`}>
        <div className="w-10 h-10 rounded-full bg-red-600/20 text-red-600 flex items-center justify-center font-black text-xl mb-2">
          
        </div>
        <span className="text-xs font-bold text-neutral-400 tracking-wider uppercase">CINEVO</span>
        <span className="text-[10px] text-neutral-600 mt-1 line-clamp-2">{title || 'Poster Unavailable'}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 bg-neutral-900 animate-pulse" />
      )}
      <img
        src={src}
        alt={title || 'Movie Poster'}
        className={`object-cover w-full h-full ${className}`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        loading="lazy"
      />
    </div>
  );
};

export default PosterImage;