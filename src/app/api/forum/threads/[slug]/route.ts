import { NextRequest, NextResponse } from "next/server";
import { getForumThreadBySlug } from "@/lib/forum";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const thread = await getForumThreadBySlug(slug);

    if (!thread) {
      return NextResponse.json(
        { success: false, message: "Thread not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      thread,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load thread";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

