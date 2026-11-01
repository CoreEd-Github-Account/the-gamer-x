"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "./ui/SectionHeader";
import { HARDWARE_ITEMS } from "../data/hardwareData";
import { HardwareItem } from "../types";

interface HardwareProps {
  items?: HardwareItem[];
}

const HardwareImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className = "" }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center p-3 text-center ${className}`}
      >
        <span className="text-2xl mb-1 opacity-50">⚡</span>
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
          TheGamerX Tech
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
      onError={() => setHasError(true)}
      className={`object-cover object-center transition-transform duration-500 group-hover:scale-105 ${className}`}
    />
  );
};

export const Hardware: React.FC<HardwareProps> = ({
  items = HARDWARE_ITEMS,
}) => {
  const activeItems = items && items.length > 0 ? items : HARDWARE_ITEMS;
  const featuredItem = activeItems.find((i) => i.isFeatured) || activeItems[0];
  const sideItems = activeItems.filter((i) => i.id !== featuredItem.id).slice(0, 3);

  const getHardwareHref = (item: HardwareItem): string => {
    if (item.href) return item.href;
    if (item.slug) return `/hardware/${item.slug}`;
    return `/hardware/${item.id}`;
  };

  return (
    <section id="hardware" className="py-8 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 relative">
      <SectionHeader
        title="HARDWARE & GEAR BENCHMARKS"
        actionText="EXPLORE HARDWARE"
        actionHref="#all-hardware"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left Column: Big Featured Hardware Card (7 cols) */}
        {featuredItem && (
          <div className="lg:col-span-7">
            <Link
              href={getHardwareHref(featuredItem)}
              className="group flex flex-col h-full rounded-2xl bg-[#0e1320] border border-white/5 hover:border-blue-500/40 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              {/* Media Container */}
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-slate-900">
                <HardwareImage
                  src={featuredItem.imageUrl}
                  alt={featuredItem.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1320] via-black/30 to-transparent opacity-80" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-md">
                    {featuredItem.category}
                  </span>

                  {featuredItem.rating && (
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                      ★ {featuredItem.rating}
                    </span>
                  )}
                </div>

                {/* Specs Pill Overlay on Bottom of Image */}
                {featuredItem.specsBadge && (
                  <div className="absolute bottom-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#080b11]/90 text-blue-300 border border-blue-500/40 backdrop-blur-md shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      {featuredItem.specsBadge}
                    </span>
                  </div>
                )}
              </div>

              {/* Text Meta Container */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white group-hover:text-blue-400 transition-colors leading-snug mb-2.5">
                    {featuredItem.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-2 mb-4">
                    {featuredItem.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-white/5 font-medium">
                  <span>{featuredItem.date} &bull; {featuredItem.readTime}</span>
                  <span className="text-blue-400 group-hover:translate-x-1 transition-transform font-bold inline-flex items-center gap-1">
                    Read benchmark &rarr;
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Right Column: 3 Stacked Hardware Cards (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
          {sideItems.map((item) => (
            <Link
              key={item.id}
              href={getHardwareHref(item)}
              className="group flex flex-col sm:flex-row items-stretch rounded-xl bg-[#0e1320] border border-white/5 hover:border-blue-500/30 overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/5 p-3 sm:p-3.5 gap-3.5"
            >
              {/* Thumbnail Container */}
              <div className="relative w-full sm:w-36 aspect-[16/10] sm:aspect-square flex-shrink-0 rounded-lg overflow-hidden bg-slate-900">
                <HardwareImage
                  src={item.imageUrl}
                  alt={item.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                      {item.category}
                    </span>
                    {item.specsBadge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-white/5 truncate max-w-[150px]">
                        {item.specsBadge}
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{item.date} &bull; {item.readTime}</span>
                  {item.rating && (
                    <span className="text-amber-400 font-bold text-[10px]">
                      ★ {item.rating.split(" ")[0]}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hardware;

