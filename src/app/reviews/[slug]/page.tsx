import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Newsletter from "../../../components/Newsletter";
import StarRating from "../../../components/ui/StarRating";
import {
  getReviewBySlug,
  getAllReviewSlugs,
  getGlobalSettings,
} from "../../../lib/wordpress";

interface ReviewPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllReviewSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ReviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const review = await getReviewBySlug(slug);

  if (!review) {
    return {
      title: "Review Not Found | gamerX",
    };
  }

  const scoreText = `${review.rating}/${review.maxRating || 5}`;

  return {
    title: `${review.title} Review (${scoreText}) | gamerX`,
    description: `In-depth review and benchmark analysis for ${review.title}. Discover performance metrics, rating scores, and our editorial verdict.`,
  };
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { slug } = await params;
  const [review, globalSettings] = await Promise.all([
    getReviewBySlug(slug),
    getGlobalSettings(),
  ]);

  if (!review) {
    notFound();
  }

  const maxScore = review.maxRating || 5;

  return (
    <div className="min-h-screen flex flex-col bg-[#080b11] text-[#f8fafc] selection:bg-cyan-500/30 selection:text-cyan-200">
      <Header />

      <main className="flex-1 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-3xl pointer-events-none -z-0" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16">
          {/* Breadcrumb & Back Link */}
          <div className="flex items-center justify-between gap-4 mb-8 text-xs font-semibold tracking-wider text-slate-400">
            <nav className="flex items-center gap-2" aria-label="Breadcrumb">
              <Link
                href="/"
                className="hover:text-cyan-400 transition-colors duration-150"
              >
                HOME
              </Link>
              <span className="text-slate-600">/</span>
              <Link
                href="/#all-reviews"
                className="hover:text-cyan-400 transition-colors duration-150"
              >
                REVIEWS
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-cyan-400 uppercase font-bold truncate max-w-[200px]">
                {review.category}
              </span>
            </nav>

            <Link
              href="/#all-reviews"
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-cyan-400 transition-colors group flex-shrink-0"
            >
              <span className="transition-transform group-hover:-translate-x-1">
                &larr;
              </span>
              <span>Back to Reviews</span>
            </Link>
          </div>

          {/* Article Header & Meta */}
          <header className="mb-8 sm:mb-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black tracking-widest uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                {review.category}
              </span>

              {review.date && (
                <>
                  <span className="text-slate-600">&bull;</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <svg
                      className="w-3.5 h-3.5 text-slate-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {review.date}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15] mb-6">
              {review.title}
            </h1>

            {/* Scorecard Quick Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0e131f] via-[#111827] to-[#0e131f] border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)] flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                  <span className="text-2xl sm:text-3xl font-black text-cyan-300">
                    {review.rating}
                  </span>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                    out of {maxScore}
                  </span>
                </div>

                <div>
                  <div className="mb-1">
                    <StarRating rating={review.rating} maxRating={maxScore} />
                  </div>
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {review.rating >= 4.5
                      ? "Outstanding - Editor's Choice"
                      : review.rating >= 3.5
                      ? "Recommended"
                      : "Average Performance"}
                  </div>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Verified Lab Test
                </span>
              </div>
            </div>

            {/* Author / Editorial Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-cyan-500/20">
                  gX
                </div>
                <div>
                  <div className="font-bold text-slate-200">
                    gamerX Hardware &amp; Review Lab
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Independent Benchmarks &amp; Hands-On Testing
                  </div>
                </div>
              </div>

              {/* Share links */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 mr-1">
                  Share:
                </span>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `${review.title} Review (${review.rating}/${maxScore}) via gamerX`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on X / Twitter"
                  className="w-8 h-8 rounded-lg bg-slate-900/80 border border-white/10 hover:border-cyan-500/50 hover:text-cyan-400 text-slate-400 flex items-center justify-center transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={`https://reddit.com/submit?title=${encodeURIComponent(
                    `${review.title} Review (${review.rating}/${maxScore}) via gamerX`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Reddit"
                  className="w-8 h-8 rounded-lg bg-slate-900/80 border border-white/10 hover:border-orange-500/50 hover:text-orange-400 text-slate-400 flex items-center justify-center transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.703zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-4.723 4.194a.344.344 0 0 0-.244.1c-.134.134-.134.35 0 .484.81.81 2.215 1.096 3.217 1.096 1.003 0 2.408-.286 3.218-1.096a.343.343 0 0 0 0-.484.343.343 0 0 0-.484 0c-.63.63-1.802.89-2.734.89-.932 0-2.104-.26-2.734-.89a.344.344 0 0 0-.239-.1z" />
                  </svg>
                </a>
              </div>
            </div>
          </header>

          {/* Hero Featured Product Image */}
          {review.imageUrl && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)] bg-slate-900">
              <Image
                src={review.imageUrl}
                alt={review.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080b11] via-transparent to-transparent opacity-40 pointer-events-none" />
            </div>
          )}

          {/* WordPress Article Content */}
          <article className="relative">
            <div
              className="story-content"
              dangerouslySetInnerHTML={{ __html: review.content || "" }}
            />
          </article>

          {/* Review Summary Score Box */}
          <div className="mt-12 p-6 rounded-2xl bg-[#0e131f] border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-black text-cyan-400">
                {review.rating}
                <span className="text-sm text-slate-500 font-normal">
                  /{maxScore}
                </span>
              </div>
              <div>
                <StarRating rating={review.rating} maxRating={maxScore} />
                <p className="text-xs text-slate-400 mt-1">
                  Overall gamerX Hardware Score
                </p>
              </div>
            </div>

            <Link
              href="/#all-reviews"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-cyan-500/40 text-xs font-bold text-white uppercase tracking-wider transition-all duration-200"
            >
              <span>&larr; More Hardware Reviews</span>
            </Link>
          </div>

          {/* Article Footer & Tags */}
          <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
              Tags:
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-900 border border-white/10 text-slate-300">
              #{review.category}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-900 border border-white/10 text-slate-300">
              #HardwareReviews
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-900 border border-white/10 text-slate-300">
              #gamerX
            </span>
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
