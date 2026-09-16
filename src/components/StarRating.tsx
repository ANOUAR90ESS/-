import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  count?: number;
  userRating?: number | null;
  onRate?: (score: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  interactive?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  count,
  userRating,
  onRate,
  size = 'sm',
  showCount = true,
  interactive = true,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [justRated, setJustRated] = useState<boolean>(false);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const handleStarClick = (score: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!interactive || !onRate) return;
    onRate(score);
    setJustRated(true);
    setTimeout(() => setJustRated(false), 2000);
  };

  const activeScore = hoverRating !== null ? hoverRating : (userRating || rating);

  return (
    <div className="flex items-center gap-1.5 select-none" title={`تقييم: ${rating} من 5 (${count || 0} تقييم)`}>
      <div 
        className="flex items-center gap-0.5"
        onMouseLeave={() => setHoverRating(null)}
      >
        {[1, 2, 3, 4, 5].map((starValue) => {
          const isFilled = activeScore >= starValue;
          const isHalf = !isFilled && activeScore >= starValue - 0.5;

          return (
            <button
              key={starValue}
              type="button"
              disabled={!interactive || !onRate}
              onClick={(e) => handleStarClick(starValue, e)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              className={`p-0.5 transition-transform ${
                interactive ? 'cursor-pointer hover:scale-125 focus:outline-hidden' : 'cursor-default'
              }`}
              aria-label={`تقييم ${starValue} من 5 نجوم`}
            >
              <Star
                className={`${starSizes[size]} transition-colors ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : isHalf
                    ? 'fill-amber-200 text-amber-400'
                    : 'fill-stone-100 text-stone-300 hover:text-amber-300'
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className={`flex items-center gap-1 ${textSizes[size]} font-semibold text-stone-800`}>
        <span>{rating.toFixed(1)}</span>
        {showCount && typeof count === 'number' && (
          <span className="text-stone-400 font-normal text-[11px]">
            ({count})
          </span>
        )}
      </div>

      {userRating && (
        <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200/80 px-1.5 py-0.5 rounded-md font-medium">
          تقييمك: {userRating}★
        </span>
      )}

      {justRated && (
        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded animate-pulse font-medium">
          تم الحفظ!
        </span>
      )}
    </div>
  );
};
