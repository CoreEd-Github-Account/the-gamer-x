"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { FORUM_THREADS } from "../../../data/forumData";
import { ForumThread, ForumReply } from "../../../types";
import { useGamerAuth } from "../../../context/GamerAuthContext";

interface ThreadDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ThreadDetailPage({ params }: ThreadDetailPageProps) {
  const resolvedParams = use(params);
  const initialThread = FORUM_THREADS.find((t) => t.slug === resolvedParams.slug) || FORUM_THREADS[0];

  const { currentGamer, openAuthModal } = useGamerAuth();
  const [thread] = useState<ForumThread>(initialThread);
  const [replies, setReplies] = useState<ForumReply[]>(thread.replies || []);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(thread.upvotes);

  // Gamer reactions state
  const [reactions, setReactions] = useState(
    thread.reactions || { hype: 12, playedIt: 8, rip: 2, insightful: 15 }
  );
  const [userReactions, setUserReactions] = useState<Record<string, boolean>>({});

  // New reply state
  const [replyAuthor, setReplyAuthor] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyTab, setReplyTab] = useState<"write" | "preview">("write");
  const [replySuccess, setReplySuccess] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Render markdown text to simple HTML elements
  const renderFormattedContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Heading 3
      if (line.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-lg font-black text-white mt-5 mb-2 tracking-tight">
            {line.replace("### ", "")}
          </h3>
        );
      }
      // Heading 4
      if (line.startsWith("#### ")) {
        return (
          <h4 key={idx} className="text-sm font-bold text-blue-400 mt-4 mb-1.5 uppercase tracking-wider">
            {line.replace("#### ", "")}
          </h4>
        );
      }
      // Blockquote
      if (line.startsWith("> ")) {
        return (
          <blockquote
            key={idx}
            className="my-3 pl-4 border-l-2 border-blue-500 bg-blue-500/5 py-2 px-3 text-xs text-slate-300 italic rounded-r-lg"
          >
            {line.replace("> ", "")}
          </blockquote>
        );
      }
      // List items
      if (line.startsWith("- ")) {
        return (
          <li key={idx} className="text-xs text-slate-300 ml-4 list-disc mb-1 leading-relaxed">
            {line.replace("- ", "")}
          </li>
        );
      }
      // Spoilers: >!spoiler!<
      if (line.includes(">!") && line.includes("!<")) {
        const parts = line.split(/(>!.*?!<)/g);
        return (
          <p key={idx} className="text-xs sm:text-sm text-slate-300 mb-3 leading-relaxed">
            {parts.map((p, pIdx) => {
              if (p.startsWith(">!") && p.endsWith("!<")) {
                const secret = p.slice(2, -2);
                return (
                  <span
                    key={pIdx}
                    className="inline-block bg-slate-800 text-slate-800 hover:text-white px-2 py-0.5 rounded cursor-pointer transition-colors border border-white/10 select-none group/spoiler"
                    title="Click to reveal spoiler"
                  >
                    <span className="group-hover/spoiler:opacity-100 opacity-0 transition-opacity">
                      {secret}
                    </span>
                  </span>
                );
              }
              return p;
            })}
          </p>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }
      // Standard paragraph with bold formatting
      const boldFormatted = line.split(/(\*\*.*?\*\*)/g).map((chunk, cIdx) => {
        if (chunk.startsWith("**") && chunk.endsWith("**")) {
          return (
            <strong key={cIdx} className="text-white font-bold">
              {chunk.slice(2, -2)}
            </strong>
          );
        }
        return chunk;
      });

      return (
        <p key={idx} className="text-xs sm:text-sm text-slate-300 mb-2 leading-relaxed">
          {boldFormatted}
        </p>
      );
    });
  };

  const handleToggleThreadUpvote = async () => {
    const nextState = !isUpvoted;
    setIsUpvoted(nextState);
    setUpvotes((v) => (nextState ? v + 1 : Math.max(0, v - 1)));

    try {
      await fetch(`/api/forum/threads/${thread.slug}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upvote",
          increment: nextState,
        }),
      });
    } catch {
      // Graceful local state retention
    }
  };

  const handleToggleReaction = async (type: "hype" | "playedIt" | "rip" | "insightful") => {
    const isActive = userReactions[type];
    const nextActive = !isActive;

    setUserReactions((prev) => ({ ...prev, [type]: nextActive }));
    setReactions((prev) => ({
      ...prev,
      [type]: nextActive ? prev[type] + 1 : Math.max(0, prev[type] - 1),
    }));

    try {
      await fetch(`/api/forum/threads/${thread.slug}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reaction",
          reactionType: type,
          increment: nextActive,
        }),
      });
    } catch {
      // Graceful local state retention
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || isSubmittingReply) return;

    setIsSubmittingReply(true);

    const authorDisplay = currentGamer
      ? currentGamer.displayName || currentGamer.username
      : replyAuthor.trim() || "GamerPlayer";

    const optimisticReply: ForumReply = {
      id: `rep-${Date.now()}`,
      author: currentGamer
        ? {
            name: authorDisplay,
            badge: currentGamer.badge,
            badgeColor: currentGamer.badgeColor,
            steamId: currentGamer.steamId,
            psnId: currentGamer.psnId,
            postCount: 1,
          }
        : {
            name: authorDisplay,
            badge: "Community Member",
            badgeColor: "#2563eb",
            postCount: 1,
          },
      createdAt: "Just now",
      content: replyContent.trim(),
      upvotes: 1,
    };

    // Optimistic UI update
    setReplies((prev) => [...prev, optimisticReply]);
    const savedContent = replyContent.trim();
    setReplyContent("");
    setReplyAuthor("");
    setReplySuccess(true);

    try {
      const res = await fetch(`/api/forum/threads/${thread.slug}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: savedContent,
          authorName: authorDisplay,
        }),
      });
      const data = await res.json();
      if (data.success && data.reply) {
        // Update with server confirmed id
        setReplies((prev) =>
          prev.map((r) => (r.id === optimisticReply.id ? data.reply : r))
        );
      }
    } catch {
      // Keep optimistic reply
    } finally {
      setIsSubmittingReply(false);
      setTimeout(() => setReplySuccess(false), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080b11] text-[#f8fafc]">
      <Header />

      <main className="flex-1 pb-20">
        {/* Breadcrumb Header */}
        <div className="border-b border-white/10 bg-[#0b0f19]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/forum" className="hover:text-white transition-colors">
                Forum
              </Link>
              <span>/</span>
              <span className="text-slate-500">{thread.category}</span>
              <span>/</span>
              <span className="text-white font-medium truncate max-w-xs sm:max-w-md">
                {thread.title}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Column (8 cols): Original Post & Replies */}
            <div className="lg:col-span-8 space-y-6">
              {/* Original Post (OP) Card */}
              <article className="rounded-2xl bg-[#0e131f] border border-white/10 overflow-hidden shadow-xl">
                {/* Thread Header Banner */}
                <div className="p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-[#121929] to-[#0e131f]">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {thread.isPinned && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40">
                        📌 Pinned Discussion
                      </span>
                    )}

                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-white/5">
                      {thread.category}
                    </span>

                    {thread.gameTag && (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-900/40 text-blue-300 border border-blue-500/20">
                        #{thread.gameTag}
                      </span>
                    )}
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                    {thread.title}
                  </h1>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span>Started {thread.createdAt}</span>
                    <span>&bull;</span>
                    <span>{thread.views.toLocaleString()} views</span>
                    <span>&bull;</span>
                    <span>{replies.length} replies</span>
                  </div>
                </div>

                {/* OP Split Layout: Author Column + Content Body */}
                <div className="grid grid-cols-1 sm:grid-cols-12 p-5 sm:p-6 gap-6">
                  {/* Author Meta Column (3 cols) */}
                  <div className="sm:col-span-3 sm:border-r sm:border-white/5 sm:pr-4 flex flex-row sm:flex-col items-center sm:items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-lg font-black text-white shadow-md shadow-blue-500/20">
                      {thread.author.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{thread.author.name}</p>
                      {thread.author.badge && (
                        <span
                          className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold text-white"
                          style={{ backgroundColor: thread.author.badgeColor || "#2563eb" }}
                        >
                          {thread.author.badge}
                        </span>
                      )}
                      <div className="mt-2 text-[10px] text-slate-400 space-y-0.5 hidden sm:block">
                        <p>{thread.author.postCount || 42} posts</p>
                        {thread.author.steamId && (
                          <p className="text-slate-400 font-mono">Steam: {thread.author.steamId}</p>
                        )}
                        {thread.author.psnId && (
                          <p className="text-slate-400 font-mono">PSN: {thread.author.psnId}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Post Content Body (9 cols) */}
                  <div className="sm:col-span-9 space-y-3">
                    <div className="prose prose-invert max-w-none">
                      {renderFormattedContent(thread.content)}
                    </div>

                    {/* Gamer Reaction Bar */}
                    <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handleToggleReaction("hype")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            userReactions.hype
                              ? "bg-amber-500/20 border-amber-500 text-amber-300"
                              : "bg-[#090d16] border-white/10 text-slate-400 hover:text-white"
                          }`}
                        >
                          <span>🔥</span>
                          <span>Hype</span>
                          <span className="text-[11px] font-mono text-slate-300">{reactions.hype}</span>
                        </button>

                        <button
                          onClick={() => handleToggleReaction("playedIt")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            userReactions.playedIt
                              ? "bg-blue-500/20 border-blue-500 text-blue-300"
                              : "bg-[#090d16] border-white/10 text-slate-400 hover:text-white"
                          }`}
                        >
                          <span>🎮</span>
                          <span>Played It</span>
                          <span className="text-[11px] font-mono text-slate-300">{reactions.playedIt}</span>
                        </button>

                        <button
                          onClick={() => handleToggleReaction("insightful")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            userReactions.insightful
                              ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                              : "bg-[#090d16] border-white/10 text-slate-400 hover:text-white"
                          }`}
                        >
                          <span>💡</span>
                          <span>Insightful</span>
                          <span className="text-[11px] font-mono text-slate-300">{reactions.insightful}</span>
                        </button>

                        <button
                          onClick={() => handleToggleReaction("rip")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            userReactions.rip
                              ? "bg-rose-500/20 border-rose-500 text-rose-300"
                              : "bg-[#090d16] border-white/10 text-slate-400 hover:text-white"
                          }`}
                        >
                          <span>💀</span>
                          <span>RIP</span>
                          <span className="text-[11px] font-mono text-slate-300">{reactions.rip}</span>
                        </button>
                      </div>

                      {/* Main Upvote Pill */}
                      <button
                        onClick={handleToggleThreadUpvote}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          isUpvoted
                            ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30"
                            : "bg-[#090d16] border-white/10 text-slate-300 hover:text-white hover:border-blue-500/40"
                        }`}
                      >
                        <span>▲</span>
                        <span>Upvote</span>
                        <span className="font-mono">{upvotes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>

              {/* Replies Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span>💬</span>
                    <span>Replies ({replies.length})</span>
                  </h2>
                </div>

                {replies.length === 0 ? (
                  <div className="rounded-xl bg-[#0e131f] border border-white/5 p-8 text-center text-slate-400 text-xs">
                    No replies yet. Be the first player to share your thoughts below!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="rounded-xl bg-[#0e131f] border border-white/5 p-4 sm:p-5 hover:border-white/10 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-xs font-bold text-white">
                              {reply.author.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white">{reply.author.name}</span>
                                {reply.author.badge && (
                                  <span
                                    className="px-1.5 py-0.2 rounded text-[8px] font-bold text-white"
                                    style={{ backgroundColor: reply.author.badgeColor || "#2563eb" }}
                                  >
                                    {reply.author.badge}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500">{reply.createdAt}</span>
                            </div>
                          </div>

                          <div className="text-xs text-slate-400 font-mono">
                            ▲ {reply.upvotes}
                          </div>
                        </div>

                        <div className="text-xs text-slate-300 leading-relaxed pl-9">
                          {renderFormattedContent(reply.content)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Post Reply Editor Card */}
              <div className="rounded-2xl bg-[#0e131f] border border-white/10 p-5 sm:p-6 shadow-xl">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <span>✍️</span> Leave a Reply
                </h3>

                {replySuccess && (
                  <div className="mb-4 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500 text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <span>✓</span> Your reply has been posted to the thread!
                  </div>
                )}

                {/* Gamer Identity Status */}
                <div className="mb-3 p-3 rounded-xl bg-[#090d16] border border-white/5 flex flex-wrap items-center justify-between gap-3">
                  {currentGamer ? (
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-white text-xs">
                        {currentGamer.displayName?.charAt(0) || currentGamer.username.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {currentGamer.displayName || currentGamer.username}
                          </span>
                          <span
                            className="px-1.5 py-0.2 rounded text-[9px] font-bold text-white"
                            style={{ backgroundColor: currentGamer.badgeColor || "#2563eb" }}
                          >
                            {currentGamer.badge}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Posting as @{currentGamer.username}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🎮</span>
                        <span className="text-xs text-slate-400">
                          Posting as Guest Gamer. Want badges & karma?
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={openAuthModal}
                        className="text-xs font-bold text-blue-400 hover:text-blue-300 underline underline-offset-2 cursor-pointer text-left"
                      >
                        Sign in or 1-Click Demo &rarr;
                      </button>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmitReply} className="space-y-3">
                  {!currentGamer && (
                    <div>
                      <input
                        type="text"
                        value={replyAuthor}
                        onChange={(e) => setReplyAuthor(e.target.value)}
                        placeholder="Your gamer handle (e.g. ShadowBlade99)"
                        className="w-full sm:w-72 px-3 py-2 bg-[#080b11] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}

                  {/* Toolbar & Write/Preview Tabs */}
                  <div className="border border-white/10 rounded-xl overflow-hidden bg-[#080b11]">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#0e131f] border-b border-white/10">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setReplyTab("write")}
                          className={`px-3 py-1 rounded text-xs font-bold cursor-pointer ${
                            replyTab === "write"
                              ? "bg-blue-600 text-white"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          Write
                        </button>
                        <button
                          type="button"
                          onClick={() => setReplyTab("preview")}
                          className={`px-3 py-1 rounded text-xs font-bold cursor-pointer ${
                            replyTab === "preview"
                              ? "bg-blue-600 text-white"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          Preview
                        </button>
                      </div>

                      <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
                        <span>Markdown supported</span>
                      </div>
                    </div>

                    {replyTab === "write" ? (
                      <textarea
                        required
                        rows={4}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Share your opinion, benchmark data, or answer..."
                        className="w-full p-3 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono leading-relaxed"
                      />
                    ) : (
                      <div className="p-4 min-h-[100px] text-xs text-slate-300">
                        {replyContent ? (
                          renderFormattedContent(replyContent)
                        ) : (
                          <span className="text-slate-500 italic">Nothing to preview yet.</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-[11px] text-slate-500">
                      Tip: Wrap spoilers with <code className="text-slate-400">&gt;!secret!&lt;</code>
                    </p>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                    >
                      Post Reply
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Sidebar (4 cols): Thread metadata & Related */}
            <div className="lg:col-span-4 space-y-6">
              {/* Thread Info Box */}
              <div className="rounded-xl bg-[#0e131f] border border-white/10 p-5">
                <h3 className="text-xs font-black uppercase tracking-wider text-white mb-3">
                  Thread Information
                </h3>
                <dl className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <dt className="text-slate-400">Category</dt>
                    <dd className="font-bold text-white">{thread.category}</dd>
                  </div>
                  {thread.gameTag && (
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <dt className="text-slate-400">Tagged Game</dt>
                      <dd className="font-bold text-blue-400">#{thread.gameTag}</dd>
                    </div>
                  )}
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <dt className="text-slate-400">Created</dt>
                    <dd className="font-medium text-slate-300">{thread.createdAt}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <dt className="text-slate-400">Total Upvotes</dt>
                    <dd className="font-bold text-emerald-400">{upvotes}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <dt className="text-slate-400">Replies</dt>
                    <dd className="font-bold text-white">{replies.length}</dd>
                  </div>
                </dl>
              </div>

              {/* Related Discussions */}
              <div className="rounded-xl bg-[#0e131f] border border-white/10 p-5">
                <h3 className="text-xs font-black uppercase tracking-wider text-white mb-3">
                  Related Discussions
                </h3>
                <div className="space-y-3">
                  {FORUM_THREADS.filter((t) => t.slug !== thread.slug)
                    .slice(0, 3)
                    .map((item) => (
                      <Link
                        key={item.id}
                        href={`/forum/${item.slug}`}
                        className="block group p-2.5 rounded-lg bg-[#090d16] hover:bg-slate-800/60 border border-white/5 transition-all"
                      >
                        <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                          {item.title}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-400">
                          <span className="text-blue-400">{item.category}</span>
                          <span>&bull;</span>
                          <span>{item.repliesCount} replies</span>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>

              {/* Back to forum link */}
              <div>
                <Link
                  href="/forum"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 border border-white/10 transition-colors"
                >
                  &larr; Back to all discussions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
