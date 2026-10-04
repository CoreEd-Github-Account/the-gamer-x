"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "./ui/SectionHeader";
import { TRENDING_GAMES } from "../data/landingData";
import { TrendingGame } from "../types";

interface TrendingGamesProps {
  games?: TrendingGame[];
}

const GamePosterImage: React.FC<{
  src: string;
  alt: string;
  gameName: string;
}> = ({ src, alt, gameName }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-slate-800 to-slate-950 flex flex-col items-center justify-center p-2 text-center">
        <span className="text-xl mb-1 opacity-40">&#127918;</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider line-clamp-2">
          {gameName}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 140px, (max-width: 1024px) 160px, 180px"
      onError={() => setHasError(true)}
      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
    />
  );
};

export const TrendingGames: React.FC<TrendingGamesProps> = ({
  games = TRENDING_GAMES,
}) => {
  const activeGames = games && games.length > 0 ? games : TRENDING_GAMES;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 240, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -240, behavior: "smooth" });
    }
  };

  return (
    <section className="py-8 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <SectionHeader
        title="TRENDING GAMES"
        actionText="EXPLORE ALL GAMES"
        actionHref="#all-games"
      />

      <div className="relative group/carousel">
        {/* Horizontal Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-start gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {activeGames.map((game: TrendingGame) => {
            const isFeatured = game.isFeatured;
            const gameHref = game.slug
              ? `/games/${game.slug}`
              : game.href && (game.href.startsWith("http://") || game.href.startsWith("https://"))
              ? game.href
              : game.id && !game.id.startsWith("#")
              ? `/games/${game.id}`
              : game.href || "#";

            const isExternal =
              gameHref.startsWith("http://") || gameHref.startsWith("https://");

            const cardClasses =
              "group flex-shrink-0 w-32 sm:w-36 md:w-40 snap-start flex flex-col focus:outline-none";

            const cardContent = (
              <>
                {/* Poster Card Container */}
                <div
                  className={`relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#0e131f] transition-all duration-300 ${
                    isFeatured
                      ? "ring-2 ring-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.35)]"
                      : "border border-white/10 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
                  }`}
                >
                  <GamePosterImage
                    src={game.imageUrl}
                    alt={game.title}
                    gameName={game.title}
                  />

                  {/* Highlight Star on First / Featured Card */}
                  {isFeatured && (
                    <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-[#080b11]/80 backdrop-blur-sm flex items-center justify-center text-cyan-400 text-xs shadow-md">
                      &#9733;
                    </div>
                  )}

                  {/* Gradient shadow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                </div>

                {/* Game Title Caption */}
                <span className="mt-2.5 text-xs font-bold text-center text-slate-300 group-hover:text-white transition-colors truncate px-1">
                  {game.title}
                </span>
              </>
            );

            return isExternal ? (
              <a
                key={game.id}
                href={gameHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClasses}
              >
                {cardContent}
              </a>
            ) : (
              <Link key={game.id} href={gameHref} className={cardClasses}>
                {cardContent}
              </Link>
            );
          })}
        </div>

        {/* Circular Next Navigation Arrow Button */}
        <button
          onClick={scrollRight}
          aria-label="Scroll trending games right"
          className="absolute -right-2 top-[40%] -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#0e131f]/90 hover:bg-cyan-500 text-white hover:text-black border border-white/20 hover:border-cyan-400 flex items-center justify-center shadow-xl backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
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

        {/* Circular Prev Navigation Arrow Button (Subtle/desktop) */}
        <button
          onClick={scrollLeft}
          aria-label="Scroll trending games left"
          className="hidden md:flex absolute -left-2 top-[40%] -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#0e131f]/90 hover:bg-cyan-500 text-white hover:text-black border border-white/20 hover:border-cyan-400 items-center justify-center shadow-xl backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer opacity-0 group-hover/carousel:opacity-100"
        >
          <svg
            className="w-4 h-4 mr-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default TrendingGames;
