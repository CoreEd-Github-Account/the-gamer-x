"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FORUM_CATEGORIES, FORUM_THREADS } from "../../data/forumData";
import { ForumThread } from "../../types";
import { useGamerAuth } from "../../context/GamerAuthContext";

export default function ForumPage() {
  const { currentGamer, openAuthModal } = useGamerAuth();
  const [threads, setThreads] = useState<ForumThread[]>(FORUM_THREADS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeSort, setActiveSort] = useState<"hot" | "latest" | "top">("hot");
  const [upvotedThreadIds, setUpvotedThreadIds] = useState<Set<string>>(new Set());

  // Load latest threads from API on mount
  useEffect(() => {
    fetch("/api/forum/threads")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.threads) && data.threads.length > 0) {
          setThreads(data.threads);
        }
      })
      .catch(() => {});
  }, []);

  // New Topic Modal State
  const [isNewTopicModalOpen, setIsNewTopicModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<ForumThread["category"]>("Game Hubs");
  const [newGameTag, setNewGameTag] = useState("");
  const [newAuthorName, setNewAuthorName] = useState("");
  const [newContent, setNewContent] = useState("");
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Filter & Search Logic
  const filteredThreads = useMemo(() => {
    let list = threads;

    if (selectedCategory !== "all") {
      list = list.filter((t) => {
        const catObj = FORUM_CATEGORIES.find((c) => c.slug === selectedCategory);
        return catObj ? t.category === catObj.name : true;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.content.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.gameTag && t.gameTag.toLowerCase().includes(q)) ||
          t.author.name.toLowerCase().includes(q)
      );
    }

    // Sorting
    return [...list].sort((a, b) => {
      // Pinned always on top
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (activeSort === "hot") {
        return b.upvotes * 2 + b.repliesCount * 3 - (a.upvotes * 2 + a.repliesCount * 3);
      }
      if (activeSort === "top") {
        return b.upvotes - a.upvotes;
      }
      // "latest"
      return b.id.localeCompare(a.id);
    });
  }, [threads, selectedCategory, searchQuery, activeSort]);

  // Handle Upvote
  const handleToggleUpvote = async (threadId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isUpvoted = upvotedThreadIds.has(threadId);
    const targetThread = threads.find((t) => t.id === threadId);
    if (!targetThread) return;

    setUpvotedThreadIds((prev) => {
      const next = new Set(prev);
      if (isUpvoted) next.delete(threadId);
      else next.add(threadId);
      return next;
    });

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            upvotes: isUpvoted ? Math.max(0, t.upvotes - 1) : t.upvotes + 1,
          };
        }
        return t;
      })
    );

    try {
      await fetch(`/api/forum/threads/${targetThread.slug}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upvote",
          increment: !isUpvoted,
        }),
      });
    } catch {
      // Retain optimistic UI state
    }
  };

  // Handle Create Topic
  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const authorDisplayName = currentGamer
      ? currentGamer.displayName || currentGamer.username
      : newAuthorName.trim() || "GamerPlayer";

    const newThread: ForumThread = {
      id: `thread-${Date.now()}`,
      slug: slug || `discussion-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      gameTag: newGameTag.trim() || undefined,
      isPinned: false,
      upvotes: 1,
      views: 1,
      repliesCount: 0,
      createdAt: "Just now",
      lastActivity: "Just now",
      author: currentGamer
        ? {
            name: authorDisplayName,
            badge: currentGamer.badge,
            badgeColor: currentGamer.badgeColor,
            steamId: currentGamer.steamId,
            psnId: currentGamer.psnId,
            postCount: 1,
          }
        : {
            name: authorDisplayName,
            badge: "Community Member",
            badgeColor: "#2563eb",
            postCount: 1,
          },
      content: newContent.trim(),
      reactions: { hype: 1, playedIt: 0, rip: 0, insightful: 0 },
      replies: [],
    };

    setThreads((prev) => [newThread, ...prev]);
    setUpvotedThreadIds((prev) => new Set(prev).add(newThread.id));
    setPublishSuccess(true);

    try {
      await fetch("/api/forum/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          category: newCategory,
          gameTag: newGameTag.trim(),
          content: newContent.trim(),
          authorName: authorDisplayName,
        }),
      });
    } catch {
      // Retain optimistic UI state
    }

    setTimeout(() => {
      setPublishSuccess(false);
      setIsNewTopicModalOpen(false);
      setNewTitle("");
      setNewContent("");
      setNewGameTag("");
      setNewAuthorName("");
    }, 900);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080b11] text-[#f8fafc]">
      <Header />

      <main className="flex-1 pb-20">
        {/* Forum Top Hero Banner */}
        <section className="relative border-b border-white/10 bg-gradient-to-b from-[#0e1322] via-[#0b0f19] to-[#080b11] pt-10 pb-12 sm:pb-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    TheGamerX Community
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                  Official Gaming Forums
                </h1>
                <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
                  Join real-time debates on breaking news, share boss combat builds, discuss PC hardware optimizations, and connect with fellow players.
                </p>

                {/* Community Stats Pills */}
                <div className="mt-5 flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold text-slate-400">
                  <div className="flex items-center gap-1.5 bg-[#0e131f] border border-white/5 px-3 py-1.5 rounded-lg">
                    <span className="text-blue-400 font-bold">{threads.length}</span>
                    <span>Discussions</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#0e131f] border border-white/5 px-3 py-1.5 rounded-lg">
                    <span className="text-emerald-400 font-bold">18.4k</span>
                    <span>Replies</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#0e131f] border border-white/5 px-3 py-1.5 rounded-lg">
                    <span className="text-purple-400 font-bold">4,890</span>
                    <span>Gamers Registered</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#0e131f] border border-white/5 px-3 py-1.5 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                    <span className="text-white font-bold">342 Online</span>
                  </div>
                </div>
              </div>

              {/* Start Discussion CTA Button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsNewTopicModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Start Discussion</span>
                </button>
              </div>
            </div>

            {/* Live Search Bar */}
            <div className="mt-8 max-w-3xl">
              <div className="relative flex items-center">
                <div className="absolute left-4 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search discussions by topic, game title, or keyword..."
                  className="w-full pl-11 pr-10 py-3.5 bg-[#0e131f]/90 border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 text-slate-400 hover:text-white text-sm p-1 cursor-pointer"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Categories Bar */}
        <section className="border-b border-white/5 bg-[#0b0f18]/60 sticky top-16 md:top-18 z-40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "bg-[#0e131f] text-slate-300 hover:text-white border border-white/5 hover:border-white/15"
                }`}
              >
                🔥 All Topics ({threads.length})
              </button>

              {FORUM_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat.slug
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "bg-[#0e131f] text-slate-300 hover:text-white border border-white/5 hover:border-white/15"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Main Forum Body: Thread Feed + Community Sidebar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 8 Columns: Feed & Controls */}
            <div className="lg:col-span-8 space-y-4">
              {/* Filter Sort Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">Sort by:</span>
                  <div className="inline-flex rounded-lg bg-[#0e131f] p-0.5 border border-white/10">
                    <button
                      onClick={() => setActiveSort("hot")}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        activeSort === "hot"
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      🔥 Hot
                    </button>
                    <button
                      onClick={() => setActiveSort("latest")}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        activeSort === "latest"
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      ⚡ Latest
                    </button>
                    <button
                      onClick={() => setActiveSort("top")}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        activeSort === "top"
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      ⭐ Top
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-400 font-medium">
                  Showing <span className="text-white font-bold">{filteredThreads.length}</span> threads
                </div>
              </div>

              {/* Thread Cards List */}
              {filteredThreads.length === 0 ? (
                <div className="rounded-2xl bg-[#0e131f] border border-white/10 p-12 text-center">
                  <span className="text-4xl">🎮</span>
                  <h3 className="mt-3 text-lg font-bold text-white">No discussions found</h3>
                  <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                    No threads matched your current filter or search criteria. Be the first player to start a discussion!
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchQuery("");
                    }}
                    className="mt-4 px-4 py-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-xs font-bold border border-blue-500/30 transition-all cursor-pointer"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredThreads.map((thread) => {
                    const isUpvoted = upvotedThreadIds.has(thread.id);

                    return (
                      <article
                        key={thread.id}
                        className={`group relative rounded-xl bg-[#0e131f] border transition-all duration-200 p-4 sm:p-5 hover:bg-[#121929] ${
                          thread.isPinned
                            ? "border-blue-500/40 shadow-sm shadow-blue-500/10 bg-gradient-to-r from-blue-950/20 via-[#0e131f] to-[#0e131f]"
                            : "border-white/5 hover:border-blue-500/30"
                        }`}
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          {/* Upvote Pill Button */}
                          <button
                            onClick={(e) => handleToggleUpvote(thread.id, e)}
                            className={`flex flex-col items-center justify-center min-w-[42px] sm:min-w-[46px] py-2 px-1.5 rounded-xl border transition-all cursor-pointer ${
                              isUpvoted
                                ? "bg-blue-600/20 border-blue-500 text-blue-400 shadow-sm shadow-blue-500/20"
                                : "bg-[#090d16] border-white/10 text-slate-400 hover:text-white hover:border-blue-500/40"
                            }`}
                            aria-label="Upvote this thread"
                          >
                            <svg
                              className={`w-4 h-4 transition-transform group-hover:-translate-y-0.5 ${
                                isUpvoted ? "text-blue-400 stroke-[3]" : "text-slate-400"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                            </svg>
                            <span className="text-xs font-black tracking-tight mt-1">
                              {thread.upvotes}
                            </span>
                          </button>

                          {/* Thread Body */}
                          <div className="flex-1 min-w-0">
                            {/* Badges Row */}
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              {thread.isPinned && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40">
                                  📌 Pinned
                                </span>
                              )}

                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-white/5">
                                {thread.category}
                              </span>

                              {thread.gameTag && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-900/40 text-blue-300 border border-blue-500/20">
                                  #{thread.gameTag}
                                </span>
                              )}
                            </div>

                            {/* Thread Headline */}
                            <h2 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">
                              <Link href={`/forum/${thread.slug}`} className="focus:outline-none">
                                {thread.title}
                              </Link>
                            </h2>

                            {/* Short Excerpt */}
                            <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {thread.content.replace(/[#*`_>]/g, "").slice(0, 160)}...
                            </p>

                            {/* Author & Stats Row */}
                            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2.5 border-t border-white/5">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-[10px] text-white">
                                  {thread.author.name.charAt(0)}
                                </div>
                                <span className="font-semibold text-slate-300">
                                  {thread.author.name}
                                </span>

                                {thread.author.badge && (
                                  <span
                                    className="px-1.5 py-0.2 rounded text-[9px] font-bold text-white"
                                    style={{
                                      backgroundColor: thread.author.badgeColor || "#2563eb",
                                    }}
                                  >
                                    {thread.author.badge}
                                  </span>
                                )}

                                <span className="text-slate-500">&bull;</span>
                                <span className="text-slate-500">{thread.createdAt}</span>
                              </div>

                              <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
                                <span className="flex items-center gap-1.5">
                                  <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                  </svg>
                                  <span className="font-bold text-slate-300">{thread.repliesCount}</span> replies
                                </span>

                                <span className="flex items-center gap-1">
                                  <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  <span>{thread.views.toLocaleString()}</span>
                                </span>

                                <span className="hidden sm:inline text-slate-500">
                                  Active {thread.lastActivity}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right 4 Columns: Widgets */}
            <div className="lg:col-span-4 space-y-6">
              {/* Trending Game Hubs Widget */}
              <div className="rounded-xl bg-[#0e131f] border border-white/10 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <span>🎮</span> Trending Game Hubs
                  </h3>
                  <Link href="/#trending" className="text-[11px] font-bold text-blue-400 hover:text-blue-300">
                    View all &rarr;
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {[
                    { name: "GTA VI", count: "142 discussions", color: "from-pink-600 to-rose-700" },
                    { name: "Elden Ring", count: "98 discussions", color: "from-amber-600 to-yellow-700" },
                    { name: "Black Myth Wukong", count: "74 discussions", color: "from-red-600 to-amber-700" },
                    { name: "Cyberpunk 2077", count: "61 discussions", color: "from-cyan-600 to-blue-700" },
                    { name: "Call of Duty", count: "55 discussions", color: "from-emerald-600 to-teal-700" },
                  ].map((hub) => (
                    <button
                      key={hub.name}
                      onClick={() => setSearchQuery(hub.name)}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#090d16] hover:bg-slate-800/60 border border-white/5 transition-all text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-md bg-gradient-to-br ${hub.color} flex items-center justify-center text-xs font-black text-white shadow-sm`}>
                          {hub.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                            {hub.name}
                          </p>
                          <p className="text-[10px] text-slate-500">{hub.count}</p>
                        </div>
                      </div>
                      <span className="text-slate-500 group-hover:text-blue-400 text-xs transition-colors">
                        &rarr;
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Top Contributors Leaderboard */}
              <div className="rounded-xl bg-[#0e131f] border border-white/10 p-5">
                <h3 className="text-xs font-black uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                  <span>👑</span> Top Contributors
                </h3>

                <div className="space-y-3">
                  {[
                    { name: "CircuitBreaker", badge: "Hardware Guru", karma: 3420, rank: 1 },
                    { name: "ViceCityWatcher", badge: "Dev Insider", karma: 2890, rank: 2 },
                    { name: "TarnishedLore", badge: "Pro Reviewer", karma: 2150, rank: 3 },
                    { name: "ValkyrieRunner", badge: "Day 1 Gamer", karma: 1820, rank: 4 },
                  ].map((user) => (
                    <div key={user.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          user.rank === 1 ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" :
                          user.rank === 2 ? "bg-slate-400/20 text-slate-300 border border-slate-400/40" :
                          "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                        }`}>
                          {user.rank}
                        </span>
                        <div>
                          <p className="font-bold text-slate-200">{user.name}</p>
                          <p className="text-[10px] text-blue-400">{user.badge}</p>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-slate-400">
                        {user.karma} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Forum Guidelines */}
              <div className="rounded-xl bg-gradient-to-br from-[#0e131f] to-[#12182b] border border-blue-500/20 p-5">
                <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-1.5">
                  <span>🛡️</span> Community Guidelines
                </h3>
                <ul className="space-y-2 text-xs text-slate-400 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">&bull;</span>
                    <span>Wrap campaign spoilers in spoiler tags.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">&bull;</span>
                    <span>No flame wars or platform elitism.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">&bull;</span>
                    <span>Verify hardware leak sources before posting.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Start Discussion Modal */}
      {isNewTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#0b0f1a] border border-blue-500/40 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-lg">💬</span>
                <h3 className="text-base font-bold text-white">Start a New Discussion</h3>
              </div>
              <button
                onClick={() => setIsNewTopicModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {publishSuccess ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 text-2xl flex items-center justify-center mx-auto mb-3">
                  ✓
                </div>
                <h4 className="text-lg font-bold text-white">Discussion Published!</h4>
                <p className="text-xs text-slate-400 mt-1">Your topic has been posted to the community feed.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateTopic} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Discussion Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. GTA VI PC release timing: What to realistically expect"
                    className="w-full px-3.5 py-2.5 bg-[#080b11] border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Category *
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as ForumThread["category"])}
                      className="w-full px-3 py-2.5 bg-[#080b11] border border-white/10 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Game Hubs">🎮 Game Hubs</option>
                      <option value="Hardware & Tech">⚡ Hardware & Tech</option>
                      <option value="News & Leaks">🔥 News & Leaks</option>
                      <option value="Industry Debates">📊 Industry Debates</option>
                      <option value="Community Lounge">☕ Community Lounge</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Game Tag (Optional)
                    </label>
                    <input
                      type="text"
                      value={newGameTag}
                      onChange={(e) => setNewGameTag(e.target.value)}
                      placeholder="e.g. GTA VI, Elden Ring, RTX 5090"
                      className="w-full px-3.5 py-2.5 bg-[#080b11] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Gamer Profile Context Banner in Modal */}
                <div className="p-3 rounded-xl bg-[#080b11] border border-white/5 flex items-center justify-between">
                  {currentGamer ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                        {currentGamer.displayName?.charAt(0) || currentGamer.username.charAt(0)}
                      </div>
                      <span className="text-xs text-slate-300">
                        Posting as <strong className="text-white">@{currentGamer.username}</strong>
                      </span>
                      <span
                        className="px-1.5 py-0.2 rounded text-[9px] font-bold text-white"
                        style={{ backgroundColor: currentGamer.badgeColor || "#2563eb" }}
                      >
                        {currentGamer.badge}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs text-slate-400">
                        Posting as Guest. Want gamer badges?
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsNewTopicModalOpen(false);
                          openAuthModal();
                        }}
                        className="text-xs font-bold text-blue-400 hover:text-blue-300 underline cursor-pointer"
                      >
                        Sign in or 1-Click Demo &rarr;
                      </button>
                    </div>
                  )}
                </div>

                {!currentGamer && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Your Gamer Handle / Username
                    </label>
                    <input
                      type="text"
                      value={newAuthorName}
                      onChange={(e) => setNewAuthorName(e.target.value)}
                      placeholder="e.g. GhostOperator"
                      className="w-full px-3.5 py-2.5 bg-[#080b11] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Content / Opening Post (Markdown supported) *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Write your thoughts, benchmarks, questions, or analysis..."
                    className="w-full p-3 bg-[#080b11] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsNewTopicModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md shadow-blue-600/30 cursor-pointer"
                  >
                    Publish Discussion
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

