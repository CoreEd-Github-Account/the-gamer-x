import React from "react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
}) => {
  return (
    <div className="flex items-center gap-2" aria-label={`Rating: ${rating} out of ${maxRating}`}>
      <div className="flex items-center gap-0.5 text-cyan-400">
        {Array.from({ length: maxRating }).map((_, index) => {
          const filled = index < Math.floor(rating);
          const half = !filled && index < rating;
          return (
            <svg
              key={index}
              className={`w-3.5 h-3.5 ${
                filled
                  ? "text-cyan-400 fill-cyan-400"
                  : half
                  ? "text-cyan-400 fill-cyan-400/50"
                  : "text-slate-600 fill-transparent stroke-slate-600"
              }`}
              viewBox="0 0 20 20"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        })}
      </div>
      <span className="text-xs font-bold text-white tracking-tight">
        {rating.toFixed(1)}/{maxRating}
      </span>
    </div>
  );
};

export default StarRating;
