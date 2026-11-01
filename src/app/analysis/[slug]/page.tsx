import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Newsletter from "../../../components/Newsletter";
import LiveCommentsSection from "../../../components/LiveCommentsSection";
import { getGlobalSettings } from "../../../lib/wordpress";
import {
  getAnalysisBySlug as getLocalAnalysisBySlug,
  getAllAnalysisSlugs as getAllLocalAnalysisSlugs,
  renderMarkdownToHtml,
} from "../../../lib/industry";

export const dynamic = "force-dynamic";

interface AnalysisPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllLocalAnalysisSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: AnalysisPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getLocalAnalysisBySlug(slug);

  if (!article) {
    return {
      title: "Analysis Not Found | TheGamerX",
    };
  }

  return {
    title: `${article.title} - Industry Analysis | TheGamerX`,
    description:
      article.description ||
      `Read our in-depth gaming industry analysis on ${article.title}. Uncover market shifts, tech breakthroughs, and economic trends.`,
  };
}

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { slug } = await params;
  const [article, globalSettings] = await Promise.all([
    getLocalAnalysisBySlug(slug),
    getGlobalSettings(),
  ]);

  if (!article) {
    notFound();
  }

  const renderedContent = article.content ? await renderMarkdownToHtml(article.content) : "";

  return (
    <div className="min-h-screen flex flex-col bg-[#080b11] text-[#f8fafc] selection:bg-blue-600/30 selection:text-blue-200">
      <Header />

      <main className="flex-1 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-blue-600/10 via-blue-700/5 to-transparent blur-3xl pointer-events-none -z-0" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16">
          {/* Breadcrumb & Back Link */}
          <div className="flex items-center justify-between gap-4 mb-8 text-xs font-semibold tracking-wider text-slate-400">
            <nav className="flex items-center gap-2" aria-label="Breadcrumb">
              <Link
                href="/"
                className="hover:text-blue-400 transition-colors duration-150"
              >
                HOME
              </Link>
              <span className="text-slate-600">/</span>
              <Link
                href="/#analysis"
                className="hover:text-blue-400 transition-colors duration-150"
              >
                INDUSTRY ANALYSIS
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-blue-400 uppercase font-bold truncate max-w-[200px]">
                {article.category}
              </span>
            </nav>

            <Link
              href="/#analysis"
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-blue-400 transition-colors group flex-shrink-0"
            >
              <span className="transition-transform group-hover:-translate-x-1">
                &larr;
              </span>
              <span>Back to Analysis</span>
            </Link>
          </div>

          {/* Article Header & Meta */}
          <header className="mb-8 sm:mb-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black tracking-widest uppercase bg-blue-950/60 text-blue-300 border border-blue-500/30 shadow-[0_0_12px_rgba(37,99,235,0.25)]">
                {article.category}
              </span>

              <span className="text-xs text-slate-400 font-mono">
                Report #{article.number}
              </span>

              <span className="text-slate-600">&bull;</span>

              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                {article.date}
              </span>

              <span className="text-slate-600">&bull;</span>

              <span className="text-xs text-slate-400">
                {article.readTime}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15] mb-6">
              {article.title}
            </h1>

            {article.description && (
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mb-6 font-normal">
                {article.description}
              </p>
            )}

            {/* Author / Desk Details Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20">
                  GX
                </div>
                <div>
                  <div className="font-bold text-slate-200">
                    TheGamerX Intelligence Desk
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Strategic Market Analysis &amp; Industry Metrics
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
                    `${article.title} via TheGamerX`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on X / Twitter"
                  className="w-8 h-8 rounded-lg bg-slate-900/80 border border-white/10 hover:border-blue-500/50 hover:text-blue-400 text-slate-400 flex items-center justify-center transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={`https://reddit.com/submit?title=${encodeURIComponent(
                    `${article.title} via TheGamerX`
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

          {/* Hero Featured Widescreen Banner Image */}
          {article.imageUrl && (
            <div className="relative w-full aspect-video sm:aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-blue-500/20 shadow-[0_0_40px_rgba(37,99,235,0.1)] bg-slate-900">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080b11] via-transparent to-transparent opacity-50 pointer-events-none" />
            </div>
          )}

          {/* Rendered Markdown Article Content */}
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
                  Industry Debate
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Join the debate on this market analysis
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
                What does this mean for developers and players? Share your perspective with the community on our forums.
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
            postSlug={article.slug || article.id}
            postTitle={article.title}
            category={article.category}
          />

          {/* Article Footer & Tags */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
                Tags:
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-900 border border-white/10 text-slate-300">
                #{article.category}
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-900 border border-white/10 text-slate-300">
                #IndustryAnalysis
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-900 border border-white/10 text-slate-300">
                #TheGamerX
              </span>
            </div>

            <Link
              href="/#analysis"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-blue-500/40 text-xs font-bold text-white uppercase tracking-wider transition-all duration-200"
            >
              <span>&larr; More Analysis Reports</span>
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
