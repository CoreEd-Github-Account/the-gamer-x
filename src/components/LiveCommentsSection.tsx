"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useGamerAuth } from "../context/GamerAuthContext";
import { ForumReply } from "../types";

interface LiveCommentsSectionProps {
  postSlug: string;
  postTitle: string;
  category?: string;
}

export const LiveCommentsSection: React.FC<LiveCommentsSectionProps> = ({
  postSlug,
  postTitle,
  category = "Gaming",
}) => {
  const { currentGamer, openAuthModal } = useGamerAuth();
  const [comments, setComments] = useState<ForumReply[]>([]);
  const [commentText, setCommentText] = useState("");
  const [guestAuthor, setGuestAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  // Target thread slug (linked to forum)
  const threadSlug = postSlug;

  useEffect(() => {
    // Attempt to load existing replies for this slug from API
    fetch(`/api/forum/threads/${threadSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.thread && Array.isArray(data.thread.replies)) {
          setComments(data.thread.replies);
        } else {
          // Provide default starter comment
          setComments([
            {
              id: `starter-${postSlug}`,
              author: {
                name: "TheGamerX_Bot",
                badge: "Staff",
                badgeColor: "#2563eb",
                postCount: 500,
              },
              createdAt: "Earlier today",
              content: `Welcome to the discussion for **${postTitle}**! What are your impressions on this development? Keep it civil and respect fellow gamers.`,
              upvotes: 8,
            },
          ]);
        }
      })
      .catch(() => {
        setComments([
          {
            id: `starter-${postSlug}`,
            author: {
              name: "TheGamerX_Bot",
              badge: "Staff",
              badgeColor: "#2563eb",
              postCount: 500,
            },
            createdAt: "Earlier today",
            content: `Welcome to the discussion for **${postTitle}**! What are your impressions on this development? Keep it civil and respect fellow gamers.`,
            upvotes: 8,
          },
        ]);
      });
  }, [threadSlug, postTitle, postSlug]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const authorDisplayName = currentGamer
      ? currentGamer.displayName || currentGamer.username
      : guestAuthor.trim() || "GamerPlayer";

    const newComment: ForumReply = {
      id: `comm-${Date.now()}`,
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
      createdAt: "Just now",
      content: commentText.trim(),
      upvotes: 1,
    };

    setComments((prev) => [...prev, newComment]);
    const saved = commentText.trim();
    setCommentText("");
    setGuestAuthor("");
    setSuccessNotice(true);

    try {
      await fetch(`/api/forum/threads/${threadSlug}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: saved,
          authorName: authorDisplayName,
        }),
      });
    } catch {
      // Retain optimistic comment
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccessNotice(false), 3000);
    }
  };

  return (
    <section className="mt-14 pt-10 border-t border-white/10" aria-label="Community Comments">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <h2 className="text-lg font-black text-white tracking-tight uppercase">
              Community Live Comments
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30 font-mono">
              {comments.length}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Debate this post live with other gamers. Comments sync with TheGamerX forums.
          </p>
        </div>

        <Link
          href={`/forum`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>View all {category} debates</span>
          <span>&rarr;</span>
        </Link>
      </div>

      {/* Comment Input Card */}
      <div className="rounded-2xl bg-[#0e1320] border border-blue-500/30 p-5 shadow-xl mb-8">
        {/* Gamer Status Pill */}
        <div className="mb-3 flex items-center justify-between">
          {currentGamer ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-white text-[10px]">
                {currentGamer.displayName?.charAt(0) || currentGamer.username.charAt(0)}
              </div>
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
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-400">
                Commenting as Guest.
              </span>
              <button
                type="button"
                onClick={openAuthModal}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 underline cursor-pointer"
              >
                Sign in or 1-Click Demo &rarr;
              </button>
            </div>
          )}
        </div>

        {successNotice && (
          <div className="mb-3 p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
            ✓ Comment posted!
          </div>
        )}

        <form onSubmit={handlePostComment} className="space-y-3">
          {!currentGamer && (
            <div>
              <input
                type="text"
                value={guestAuthor}
                onChange={(e) => setGuestAuthor(e.target.value)}
                placeholder="Enter your GamerTag (e.g. Spartan117)"
                className="w-full sm:w-64 px-3 py-2 bg-[#080b11] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <textarea
              required
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="What are your thoughts on this story? Share your reaction..."
              className="w-full p-3 bg-[#080b11] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Spam and flame wars are moderated by staff.
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide shadow-md shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      </div>

      {/* Comments Feed List */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="rounded-xl bg-[#0e1320] border border-white/5 p-4 hover:border-white/15 transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center font-bold text-xs text-white">
                  {comment.author.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{comment.author.name}</span>
                    {comment.author.badge && (
                      <span
                        className="px-1.5 py-0.2 rounded text-[8px] font-bold text-white"
                        style={{ backgroundColor: comment.author.badgeColor || "#2563eb" }}
                      >
                        {comment.author.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500">{comment.createdAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                <span>▲</span>
                <span>{comment.upvotes}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pl-9 whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LiveCommentsSection;

