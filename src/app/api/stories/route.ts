import { NextRequest, NextResponse } from "next/server";
import { getStories, saveStories } from "@/lib/stories";
import { isAuthenticatedRequest } from "@/lib/auth";

export async function GET() {
  try {
    const stories = await getStories();
    return NextResponse.json({
      success: true,
      stories,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to retrieve stories" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthenticatedRequest(req)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Admin access required." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const stories = body.stories || body;

    if (!Array.isArray(stories)) {
      return NextResponse.json(
        { success: false, message: "Payload must include an array of stories" },
        { status: 400 }
      );
    }

    const saved = await saveStories(stories);

    return NextResponse.json({
      success: true,
      message: "Stories updated successfully",
      stories: saved,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save stories";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return PUT(req);
}

