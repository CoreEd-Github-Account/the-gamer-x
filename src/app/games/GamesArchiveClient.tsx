"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Newsletter from "../../components/Newsletter";
import { TrendingGame } from "../../types";

interface GamesArchiveClientProps {
  initialGames: TrendingGame[];
}

export default function GamesArchiveClient({
  initialGames,
}: GamesArchiveClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    initialGames.forEach((g) => {
      if (g.category) set.add(g.category);
    });
    return ["all", ...Array.from(set)];
  }, [initialGames]);

  const filteredGames = useMemo(() => {
    return initialGames.filter((game) => {
      if (
        selectedCategory !== "all" &&
        game.category?.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = game.title?.toLowerCase().includes(q);
        const matchDesc = game.description?.toLowerCase().includes(q);
        const matchCat = game.category?.toLowerCase().includes(q);
        const matchSlug = game.slug?.toLowerCase().includes(q);
        return matchTitle || matchDesc || matchCat || matchSlug;
      }

      return true;
    });
  }, [initialGames, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Header />

      <main className="flex-1">
        {/* HERO / SEARCH HEADER */}
        <section className="relative overflow-hidden border-b border-white/10 bg-[#080b11] py-14 sm:py-20">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Breadcrumb */}
            <div className="inline-flex items-center gap-2 text-xs text-slate-400 mb-4">
              <Link href="/" className="hover:text-blue-400 transition">
                Home
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-white font-medium">Trending Games</span>
            </div>

            {/* Title with Accented Highlight */}
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
              Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Games</span>
            </h1>

            <p className="mt-4 text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
              Explore the hottest gaming titles, player engagement surges, metacritic standouts, and upcoming blockbusters.
            </p>

            {/* Pill Search Bar */}
            <div className="mt-8 max-w-xl mx-auto">
              <div className="relative flex items-center rounded-full bg-[#0d121f] border border-white/10 p-1.5 shadow-2xl shadow-black/50 focus-within:border-blue-500/60 transition-all">
                <div className="pl-3.5 pr-2 text-slate-400 flex items-center pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search games by title, genre, or keyword..."
                  className="w-full py-2 bg-transparent text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1.5 mr-1 text-slate-400 hover:text-white transition cursor-pointer text-xs"
                    title="Clear search"
                  >
                    &times;
                  </button>
                )}

                <button
                  type="button"
                  className="px-5 sm:px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-blue-950/40 flex-shrink-0 cursor-pointer"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/30"
                      : "bg-[#0d121f] text-slate-400 hover:text-white hover:bg-slate-800/80 border border-white/5"
                  }`}
                >
                  {cat === "all" ? `All Games (${initialGames.length})` : cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* GAMES GRID SECTION */}
        <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <div className="text-xs text-slate-400">
              Showing <strong className="text-white font-semibold">{filteredGames.length}</strong> of {initialGames.length} games
              {searchQuery && (
                <span>
                  {" "}
                  matching &ldquo;<span className="text-blue-400">{searchQuery}</span>&rdquo;
                </span>
              )}
            </div>

            {(searchQuery || selectedCategory !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="text-xs text-blue-400 hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>

          {filteredGames.length === 0 ? (
            <div className="p-16 text-center rounded-2xl bg-[#0c101b] border border-white/10 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-500">
                <span className="text-xl">🎮</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">No games found</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                We couldn&apos;t find any games matching your current search query.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition cursor-pointer"
              >
                Clear search & filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredGames.map((game) => {
                const gameHref = game.slug ? `/games/${game.slug}` : `/games/${game.id}`;

                return (
                  <Link
                    key={game.id}
                    href={gameHref}
                    className="group flex flex-col rounded-2xl bg-[#0e1320] border border-white/5 hover:border-blue-500/40 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                      {game.imageUrl ? (
                        <Image
                          src={game.imageUrl}
                          alt={game.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-mono text-slate-600">
                          TheGamerX
                        </div>
                      )}

                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-black/75 backdrop-blur-sm text-blue-400 border border-white/10 shadow-sm">
                          {game.category || "Game Hub"}
                        </span>
                        {game.isFeatured && (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-amber-500/80 text-black shadow-sm">
                            Trending
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {game.rating && (
                          <div className="text-[11px] font-semibold text-emerald-400 mb-1.5 flex items-center gap-1">
                            <span>★</span>
                            <span>{game.rating} Score</span>
                          </div>
                        )}

                        <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">
                          {game.title}
                        </h2>

                        {game.description && (
                          <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed font-normal">
                            {game.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-blue-400 font-semibold group-hover:text-blue-300">
                        <span>Explore game hub</span>
                        <span className="transform transition-transform duration-200 group-hover:translate-x-1">
                          &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}

