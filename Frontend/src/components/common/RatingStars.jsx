import React, { useState } from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating, onRate, readonly = false, size = 24 }) => {
  const [hover, setHover] = useState(0);
  const handleClick = (value) => { if (!readonly && onRate) onRate(value); };
  return (
    <div className="flex items-center space-x-1">
      {[1,2,3,4,5].map(star => (
        <Star key={star} size={size} className={`cursor-pointer transition-colors ${(hover || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'}`} onMouseEnter={() => !readonly && setHover(star)} onMouseLeave={() => !readonly && setHover(0)} onClick={() => handleClick(star)} />
      ))}
    </div>
  );
};

export default RatingStars;