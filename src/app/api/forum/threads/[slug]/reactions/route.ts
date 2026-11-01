import { NextRequest, NextResponse } from "next/server";
import { toggleThreadReaction, toggleThreadUpvote } from "@/lib/forum";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { action, reactionType, increment } = body;

    if (action === "upvote") {
      const updated = await toggleThreadUpvote(slug, Boolean(increment));
      return NextResponse.json({ success: true, thread: updated });
    }

    if (action === "reaction" && reactionType) {
      const updated = await toggleThreadReaction(slug, reactionType, Boolean(increment));
      return NextResponse.json({ success: true, thread: updated });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update reaction";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

