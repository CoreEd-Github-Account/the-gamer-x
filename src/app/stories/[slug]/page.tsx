import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Newsletter from "../../../components/Newsletter";
import LiveCommentsSection from "../../../components/LiveCommentsSection";
import { Story } from "../../../types";
import {
  getStoryBySlug as getWpStoryBySlug,
  getAllStorySlugs as getAllWpStorySlugs,
  getGlobalSettings,
} from "../../../lib/wordpress";
import {
  getHeroSlideBySlug,
  getAllHeroSlugs,
  renderMarkdownToHtml,
} from "../../../lib/hero";
import {
  getStoryBySlug,
  getAllStorySlugs,
} from "../../../lib/stories";

export const dynamic = "force-dynamic";

interface StoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const [localSlugs, heroSlugs, wpSlugs] = await Promise.all([
    getAllStorySlugs(),
    getAllHeroSlugs(),
    getAllWpStorySlugs(),
  ]);
  const all = Array.from(new Set([...localSlugs, ...heroSlugs, ...wpSlugs]));
  return all.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Check hero slides first
  const heroSlide = await getHeroSlideBySlug(slug);
  if (heroSlide) {
    return {
      title: `${heroSlide.title} | TheGamerX`,
      description:
        heroSlide.description ||
        `Read the full story: ${heroSlide.title} on TheGamerX.`,
    };
  }

  // Check local stories next
  const localStory = await getStoryBySlug(slug);
  if (localStory) {
    return {
      title: `${localStory.title} | TheGamerX`,
      description:
        localStory.description ||
        `Read the latest story: ${localStory.title} on TheGamerX.`,
    };
  }

  const story = await getWpStoryBySlug(slug);

  if (!story) {
    return {
      title: "Story Not Found | TheGamerX",
    };
  }

  return {
    title: `${story.title} | TheGamerX`,
    description:
      story.description ||
      `Read the latest story: ${story.title} on TheGamerX - your source for breaking gaming news and insights.`,
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;

  // 1. Check if this is a Hero slide story
  const heroSlide = await getHeroSlideBySlug(slug);
  let activeStory: Story | null = null;

  if (heroSlide) {
    const renderedContent = await renderMarkdownToHtml(heroSlide.content || "");
    activeStory = {
      id: heroSlide.id,
      title: heroSlide.title,
      category: heroSlide.badge || "Featured Story",
      date: "October 2026",
      readTime: "5 min read",
      imageUrl: heroSlide.imageUrl,
      slug: heroSlide.slug || heroSlide.id,
      description: heroSlide.description,
      content: renderedContent,
    };
  } else {
    // 2. Check local stories
    const localStory = await getStoryBySlug(slug);
    if (localStory) {
      const renderedContent = await renderMarkdownToHtml(localStory.content || "");
      activeStory = {
        ...localStory,
        content: renderedContent,
      };
    } else {
      // 3. Fallback to WP mock
      activeStory = await getWpStoryBySlug(slug);
    }
  }

  const globalSettings = await getGlobalSettings();

  if (!activeStory) {
    notFound();
  }

  const story = activeStory;

  return (
    <div className="min-h-screen flex flex-col bg-[#090c13] text-[#f8fafc] selection:bg-blue-600/30 selection:text-blue-200">
      <Header />

      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-16">
          {/* Quiet Back Navigation */}
          <div className="mb-6">
            <Link
              href="/#news"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition-colors"
            >
              <span>&larr;</span>
              <span>All stories</span>
            </Link>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            {/* Category & Read Time Meta */}
            <div className="flex items-center gap-2 mb-3 text-xs">
              <span className="font-semibold text-blue-400 tracking-wide">
                {story.category}
              </span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-slate-400">{story.readTime || "5 min read"}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-[44px] font-extrabold text-white tracking-tight leading-[1.14] mb-4">
              {story.title}
            </h1>

            {/* Standfirst / Summary Deck */}
            {story.description && (
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-6">
                {story.description}
              </p>
            )}

            {/* Byline & Share Bar */}
            <div className="flex items-center justify-between gap-4 py-3.5 border-y border-white/5 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[11px] font-bold text-blue-400">
                  GX
                </div>
                <div>
                  <span className="text-slate-200 font-medium">TheGamerX Staff</span>
                  <span className="text-slate-500 ml-2">{story.date || "October 2026"}</span>
                </div>
              </div>

              {/* Share links & Discuss */}
              <div className="flex items-center gap-2">
                <Link
                  href="/forum"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-bold transition-all shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Discuss</span>
                </Link>

                <div className="flex items-center gap-1.5 pl-1 border-l border-white/10">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(story.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on X"
                    className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href={`https://reddit.com/submit?title=${encodeURIComponent(story.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Reddit"
                    className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-orange-400 flex items-center justify-center transition"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.703zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-4.723 4.194a.344.344 0 0 0-.244.1c-.134.134-.134.35 0 .484.81.81 2.215 1.096 3.217 1.096 1.003 0 2.408-.286 3.218-1.096a.343.343 0 0 0 0-.484.343.343 0 0 0-.484 0c-.63.63-1.802.89-2.734.89-.932 0-2.104-.26-2.734-.89a.344.344 0 0 0-.239-.1z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {story.imageUrl && (
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden mb-10 bg-slate-900 border border-white/5">
              <Image
                src={story.imageUrl}
                alt={story.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 768px"
                className="object-cover object-center"
              />
            </div>
          )}

          {/* Article Body Content */}
          <div
            className="story-content"
            dangerouslySetInnerHTML={{ __html: story.content || "" }}
          />

          {/* Discuss on Forum Callout Banner */}
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-blue-950/30 via-[#0e131f] to-[#0e131f] border border-blue-500/30 shadow-lg shadow-blue-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                  Community Discussion
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                What do you think of this story?
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
                Join our gaming community on the forum to debate theories, share reactions, and discuss with other players.
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
            postSlug={story.slug || story.id}
            postTitle={story.title}
            category={story.category}
          />

          {/* Article Footer & Tags */}
          <footer className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 mr-1">Tags</span>
              <span className="px-2.5 py-1 rounded bg-white/5 text-xs text-slate-300">
                #{story.category.replace(/\s+/g, "")}
              </span>
              <span className="px-2.5 py-1 rounded bg-white/5 text-xs text-slate-300">
                #Gaming
              </span>
            </div>

            <Link
              href="/#news"
              className="text-xs text-slate-400 hover:text-blue-400 transition flex items-center gap-1"
            >
              <span>&larr;</span>
              <span>Back to all stories</span>
            </Link>
          </footer>
        </article>

        {/* Global Newsletter */}
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
