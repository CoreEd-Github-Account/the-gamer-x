import { NextRequest, NextResponse } from "next/server";
import { getTrendingGames, saveTrendingGames } from "@/lib/games";
import { isAuthenticatedRequest } from "@/lib/auth";

export async function GET() {
  try {
    const games = await getTrendingGames();
    return NextResponse.json({
      success: true,
      games,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to retrieve trending games" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthenticatedRequest(req)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Admin credentials required." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const games = body.games || body;

    if (!Array.isArray(games)) {
      return NextResponse.json(
        { success: false, message: "Payload must include an array of games" },
        { status: 400 }
      );
    }

    const saved = await saveTrendingGames(games);

    return NextResponse.json({
      success: true,
      message: "Trending games updated successfully",
      games: saved,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update trending games";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return PUT(req);
}

