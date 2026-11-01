import { NextRequest, NextResponse } from "next/server";
import { getForumThreads, createForumThread } from "@/lib/forum";
import { getGamerFromRequest } from "@/lib/forumAuth";
import { ForumThread } from "@/types";

export async function GET() {
  try {
    const threads = await getForumThreads();
    return NextResponse.json({
      success: true,
      threads,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load threads";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, gameTag, content, authorName } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { success: false, message: "Title, content and category are required" },
        { status: 400 }
      );
    }

    const currentGamer = getGamerFromRequest(req);

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newThread: ForumThread = {
      id: `thread-${Date.now()}`,
      slug: slug || `topic-${Date.now()}`,
      title: title.trim(),
      category,
      gameTag: gameTag?.trim() || undefined,
      isPinned: false,
      upvotes: 1,
      views: 1,
      repliesCount: 0,
      createdAt: "Just now",
      lastActivity: "Just now",
      author: currentGamer
        ? {
            name: currentGamer.displayName || currentGamer.username,
            badge: currentGamer.badge,
            badgeColor: currentGamer.badgeColor,
            steamId: currentGamer.steamId,
            psnId: currentGamer.psnId,
            postCount: 1,
          }
        : {
            name: authorName?.trim() || "GamerPlayer",
            badge: "Community Member",
            badgeColor: "#2563eb",
            postCount: 1,
          },
      content: content.trim(),
      reactions: { hype: 1, playedIt: 0, rip: 0, insightful: 0 },
      replies: [],
    };

    const saved = await createForumThread(newThread);

    return NextResponse.json({
      success: true,
      message: "Discussion published successfully",
      thread: saved,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create thread";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

