"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import SectionHeader from "./ui/SectionHeader";
import Badge from "./ui/Badge";
import StarRating from "./ui/StarRating";
import { LATEST_REVIEWS } from "../data/landingData";
import { ReviewItem } from "../types";

const ReviewProductImage: React.FC<{
  src: string;
  alt: string;
  fallbackTitle: string;
}> = ({ src, alt, fallbackTitle }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center p-3 text-center rounded-lg">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider line-clamp-2">
          {fallbackTitle}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      onError={() => setHasError(true)}
      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
    />
  );
};

export const LatestReviews: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: "smooth" });
    }
  };

  return (
    <section className="py-8 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <SectionHeader
        title="LATEST REVIEWS"
        actionText="VIEW ALL REVIEWS"
        actionHref="#all-reviews"
      />

      <div className="relative group/reviews">
        {/* Responsive Grid / Horizontal Scroll for smaller viewports */}
        <div
          ref={scrollRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {LATEST_REVIEWS.map((review: ReviewItem) => (
            <a
              key={review.id}
              href={review.href || `#${review.id}`}
              className="group flex flex-col justify-between p-4 rounded-xl bg-[#0e131f] border border-white/5 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 snap-start min-w-[240px] sm:min-w-0"
            >
              {/* Product Preview Image */}
              <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full rounded-lg overflow-hidden bg-slate-900 mb-4 border border-white/5">
                <ReviewProductImage
                  src={review.imageUrl}
                  alt={review.title}
                  fallbackTitle={review.title}
                />
              </div>

              {/* Review Content */}
              <div className="flex flex-col flex-1 justify-between">
                <div>
                  <Badge variant="cyan" className="mb-2">
                    {review.category}
                  </Badge>

                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug mb-3">
                    {review.title}
                  </h3>
                </div>

                <div className="pt-2 border-t border-white/5 flex flex-col gap-1.5">
                  <StarRating rating={review.rating} maxRating={review.maxRating || 5} />
                  <p className="text-[11px] text-slate-400 font-medium">
                    {review.date}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Circular Next Arrow Indicator Matching Mockup */}
        <button
          onClick={scrollRight}
          aria-label="Next reviews"
          className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#0e131f]/90 hover:bg-cyan-500 text-white hover:text-black border border-white/20 hover:border-cyan-400 items-center justify-center shadow-xl backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <svg
            className="w-4 h-4 ml-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default LatestReviews;
