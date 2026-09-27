"use client";

import React, { useState } from "react";
import Image from "next/image";
import SectionHeader from "./ui/SectionHeader";
import { LATEST_STORIES } from "../data/landingData";
import { Story } from "../types";

const StoryImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className = "" }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className={`w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-slate-500 text-xs font-mono ${className}`}>
        <span>gamerX</span>
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
      className={`object-cover object-center ${className}`}
    />
  );
};

export const LatestStories: React.FC = () => {
  const featuredStory = LATEST_STORIES.find((s) => s.isMain) || LATEST_STORIES[0];
  const sideStories = LATEST_STORIES.filter((s) => s.id !== featuredStory?.id);

  if (!featuredStory) return null;

  return (
    <section className="py-8 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        title="LATEST STORIES"
        actionText="VIEW ALL NEWS"
        actionHref="#all-news"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left Column: Big Featured Story Card */}
        <div className="lg:col-span-7">
          <a
            href={featuredStory.href || "#"}
            className="group block h-full rounded-xl bg-[#0e131f] border border-white/5 hover:border-cyan-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5"
          >
            {/* Featured Image */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-slate-900">
              <StoryImage
                src={featuredStory.imageUrl}
                alt={featuredStory.title}
                className="transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e131f] via-transparent to-transparent opacity-80" />
            </div>

            {/* Featured Content */}
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                  {featuredStory.category}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white group-hover:text-cyan-400 transition-colors leading-snug mb-3">
                {featuredStory.title}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {featuredStory.date} &bull; {featuredStory.readTime}
              </p>
            </div>
          </a>
        </div>

        {/* Right Column: 3 Compact Stacked Cards */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3 sm:gap-4">
          {sideStories.map((story: Story) => (
            <a
              key={story.id}
              href={story.href || "#"}
              className="group flex items-center gap-4 p-3 sm:p-3.5 rounded-xl bg-[#0e131f] border border-white/5 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5 flex-1"
            >
              {/* Compact Thumbnail */}
              <div className="relative w-28 sm:w-32 h-20 sm:h-22 rounded-lg overflow-hidden flex-shrink-0 bg-slate-900">
                <StoryImage
                  src={story.imageUrl}
                  alt={story.title}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Compact Meta & Title */}
              <div className="flex flex-col justify-center min-w-0 flex-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-1">
                  {story.category}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug mb-2">
                  {story.title}
                </h4>
                <p className="text-[11px] text-slate-400 font-medium">
                  {story.date} &bull; {story.readTime}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestStories;
