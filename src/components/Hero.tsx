"use client";

import React, { useState } from "react";
import Image from "next/image";
import { HERO_SLIDES } from "../data/landingData";

export const Hero: React.FC = () => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  const currentSlide = HERO_SLIDES[activeSlideIndex] || HERO_SLIDES[0];

  return (
    <section className="relative w-full min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] flex items-end overflow-hidden bg-[#080b11]">
      {/* Background Graphic & Image with Fallback */}
      <div className="absolute inset-0 z-0">
        {!imgError ? (
          <Image
            src={currentSlide.imageUrl}
            alt={currentSlide.imageAlt}
            fill
            priority
            onError={() => setImgError(true)}
            className="object-cover object-center scale-100 transition-transform duration-700 ease-out"
          />
        ) : (
          /* Rich CSS Gradient Fallback matching Vice City / Cyberpunk Sunset */
          <div className="w-full h-full bg-gradient-to-br from-[#121829] via-[#1c142b] to-[#080b11]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(236,72,153,0.18),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(6,182,212,0.15),transparent_40%)]" />
          </div>
        )}

        {/* Cinematic Multi-layered Vignette & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b11] via-[#080b11]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080b11]/90 via-[#080b11]/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#080b11] to-transparent" />
      </div>

      {/* Hero Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 pb-12 sm:pb-16">
        <div className="max-w-2xl">
          {/* Label Badge */}
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-cyan-400">
              {currentSlide.badge}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-black text-white tracking-tight leading-[1.08] drop-shadow-md mb-4">
            {currentSlide.title}
          </h1>

          {/* Subtext description */}
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mb-7 font-normal">
            {currentSlide.description}
          </p>

          {/* CTA Action & Slide Number Nav */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <a
              href={currentSlide.ctaLink}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-md bg-transparent border border-white/20 text-white hover:bg-white hover:text-black hover:border-white font-bold text-xs uppercase tracking-widest transition-all duration-200 group shadow-lg shadow-black/40 w-fit"
            >
              <span>{currentSlide.ctaText}</span>
              <span className="transform transition-transform duration-200 group-hover:translate-x-1">
                &rarr;
              </span>
            </a>

            {/* Slide Pagination Indicator */}
            <div
              className="flex items-center gap-3 pt-2 sm:pt-0"
              role="tablist"
              aria-label="Hero Slides"
            >
              {HERO_SLIDES.map((slide, idx) => {
                const isActive = idx === activeSlideIndex;
                return (
                  <button
                    key={slide.id}
                    onClick={() => setActiveSlideIndex(idx)}
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Go to slide ${slide.number}: ${slide.title}`}
                    className="flex items-center gap-2 group cursor-pointer focus:outline-none"
                  >
                    <span
                      className={`text-xs font-mono font-bold transition-colors ${
                        isActive
                          ? "text-cyan-400"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {slide.number}
                    </span>
                    {isActive && (
                      <span className="w-8 sm:w-10 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
