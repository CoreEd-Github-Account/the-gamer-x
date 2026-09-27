"use client";

import React, { useState } from "react";
import Image from "next/image";
import SectionHeader from "./ui/SectionHeader";
import Badge from "./ui/Badge";
import { INDUSTRY_ARTICLES } from "../data/landingData";
import { IndustryArticle } from "../types";

const IndustryBannerImage: React.FC<{
  src: string;
  alt: string;
  fallbackText: string;
}> = ({ src, alt, fallbackText }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className="w-full h-full bg-gradient-to-r from-slate-900 to-slate-800 flex items-center justify-center p-4 rounded-xl border border-white/5">
        <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
          {fallbackText}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 400px"
      onError={() => setHasError(true)}
      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
    />
  );
};

export const IndustryAnalysis: React.FC = () => {
  return (
    <section className="py-8 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        title="DEEP INDUSTRY ANALYSIS"
        actionText="VIEW ALL ANALYSIS"
        actionHref="#all-analysis"
      />

      <div className="rounded-2xl bg-[#0b0f1a] border border-white/5 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {INDUSTRY_ARTICLES.map((article: IndustryArticle) => (
          <a
            key={article.id}
            href={article.href || `#${article.id}`}
            className="group grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pb-6 sm:pb-8 last:pb-0 border-b border-white/5 last:border-0 hover:bg-white/[0.01] -mx-2 sm:-mx-4 px-2 sm:px-4 py-2 rounded-xl transition-all duration-200"
          >
            {/* Left Content with Large Cyan Number */}
            <div className="lg:col-span-7 flex items-start gap-4 sm:gap-6">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-cyan-400 tracking-tight font-mono select-none">
                {article.number}
              </span>

              <div className="flex-1 min-w-0">
                <div className="mb-1.5">
                  <Badge variant="cyan">{article.category}</Badge>
                </div>

                <h3 className="text-base sm:text-lg md:text-xl font-black text-white group-hover:text-cyan-400 transition-colors leading-snug mb-2">
                  {article.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2 mb-2 font-normal">
                  {article.description}
                </p>

                <p className="text-[11px] text-slate-400 font-medium">
                  {article.date} &bull; {article.readTime}
                </p>
              </div>
            </div>

            {/* Right Banner Image */}
            <div className="lg:col-span-5 w-full">
              <div className="relative aspect-[16/6] sm:aspect-[16/5] w-full rounded-xl overflow-hidden bg-slate-900 border border-white/10 group-hover:border-cyan-500/40 transition-all duration-300 shadow-lg shadow-black/30">
                <IndustryBannerImage
                  src={article.imageUrl}
                  alt={article.title}
                  fallbackText={article.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default IndustryAnalysis;
