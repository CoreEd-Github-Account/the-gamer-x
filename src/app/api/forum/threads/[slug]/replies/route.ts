import { NextRequest, NextResponse } from "next/server";
import { addReplyToThread } from "@/lib/forum";
import { getGamerFromRequest } from "@/lib/forumAuth";
import { ForumReply } from "@/types";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { content, authorName } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, message: "Reply content cannot be empty" },
        { status: 400 }
      );
    }

    const currentGamer = getGamerFromRequest(req);

    const newReply: ForumReply = {
      id: `rep-${Date.now()}`,
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
      createdAt: "Just now",
      content: content.trim(),
      upvotes: 1,
    };

    const result = await addReplyToThread(slug, newReply);

    return NextResponse.json({
      success: true,
      message: "Reply posted successfully",
      reply: result.reply,
      thread: result.thread,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to post reply";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

