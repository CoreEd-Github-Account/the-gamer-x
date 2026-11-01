import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Newsletter from "../../../components/Newsletter";
import LiveCommentsSection from "../../../components/LiveCommentsSection";
import { getHardwareBySlug, getHardwareItems } from "../../../lib/hardware";
import { getGlobalSettings } from "../../../lib/wordpress";
import { renderMarkdownToHtml } from "../../../lib/hero";

export const dynamic = "force-dynamic";

interface HardwarePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const items = await getHardwareItems();
  return items.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: HardwarePageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getHardwareBySlug(slug);

  if (!item) {
    return { title: "Hardware Review Not Found | TheGamerX" };
  }

  return {
    title: `${item.title} | TheGamerX Hardware`,
    description: item.description,
  };
}

export default async function HardwareDetailPage({ params }: HardwarePageProps) {
  const { slug } = await params;
  const item = await getHardwareBySlug(slug);

  if (!item) {
    notFound();
  }

  const globalSettings = await getGlobalSettings();
  const renderedContent = await renderMarkdownToHtml(item.content || "");

  return (
    <div className="min-h-screen flex flex-col bg-[#080b11] text-[#f8fafc] selection:bg-blue-600/30 selection:text-blue-200">
      <Header />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-16">
          {/* Breadcrumb Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/#hardware"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors"
            >
              <span>&larr;</span>
              <span>Back to Hardware & Gear</span>
            </Link>

            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-600/20 text-blue-400 border border-blue-500/30">
              {item.category}
            </span>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.14] mb-4">
              {item.title}
            </h1>

            {/* Standfirst / Summary Deck */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal mb-6">
              {item.description}
            </p>

            {/* Meta Row: Specs, Rating, Date, Read Time */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 px-4 rounded-xl bg-[#0e1320] border border-white/5 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                {item.specsBadge && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono font-bold bg-[#080b11] text-blue-400 border border-blue-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    {item.specsBadge}
                  </span>
                )}
                <span className="text-slate-400">
                  {item.date} &bull; {item.readTime}
                </span>
              </div>

              {item.rating && (
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <span>★</span>
                  <span>{item.rating}</span>
                </div>
              )}
            </div>
          </header>

          {/* Featured Hardware Image */}
          {item.imageUrl && (
            <div className="relative w-full aspect-video sm:aspect-[21/9] rounded-2xl overflow-hidden mb-10 border border-white/10 shadow-2xl bg-slate-900">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080b11] via-transparent to-transparent opacity-40 pointer-events-none" />
            </div>
          )}

          {/* Rendered Hardware Content */}
          <article className="relative">
            <div
              className="story-content prose prose-invert prose-blue max-w-none text-slate-300 leading-relaxed text-sm sm:text-base space-y-5"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />
          </article>

          {/* Discuss on Forum Callout Banner */}
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-blue-950/30 via-[#0e131f] to-[#0e131f] border border-blue-500/30 shadow-lg shadow-blue-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                  Hardware & Benchmarks Debate
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Share your benchmarks or rig build
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
                Have you tested this hardware or are you planning to upgrade? Join fellow builders on the forum.
              </p>
            </div>
            <Link
              href="/forum"
              className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide shadow-md shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              <span>Discuss on Forum &rarr;</span>
            </Link>
          </div>

          {/* Live Comments Section */}
          <LiveCommentsSection
            postSlug={item.slug}
            postTitle={item.title}
            category={item.category}
          />

          {/* Footer & Tags */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
                Tags:
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-900 border border-white/10 text-slate-300">
                #{item.category.replace(/\s+/g, "")}
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-900 border border-white/10 text-slate-300">
                #TechReviews
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-900 border border-white/10 text-slate-300">
                #TheGamerX
              </span>
            </div>

            <Link
              href="/#hardware"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-blue-500/40 text-xs font-bold text-white uppercase tracking-wider transition-all duration-200"
            >
              <span>&larr; More Hardware & Benchmarks</span>
            </Link>
          </div>
        </div>

        {/* Global Newsletter integration */}
        <Newsletter
          heading={globalSettings.newsletterHeading}
          subtitle={globalSettings.newsletterSubtitle}
          settings={globalSettings}
        />
      </main>

      <Footer
        aboutText={globalSettings.footerAboutText}
        copyrightText={globalSettings.copyrightText}
        twitterLink={globalSettings.twitterLink}
        discordLink={globalSettings.discordLink}
        youtubeLink={globalSettings.youtubeLink}
        settings={globalSettings}
      />
    </div>
  );
}

