import { NextRequest, NextResponse } from "next/server";
import { authenticateGamer, createGamerToken, GAMER_COOKIE_NAME } from "@/lib/forumAuth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username) {
      return NextResponse.json(
        { success: false, message: "Username is required" },
        { status: 400 }
      );
    }

    const gamer = await authenticateGamer(username, password);
    if (!gamer) {
      return NextResponse.json(
        { success: false, message: "Invalid gamer username or password" },
        { status: 401 }
      );
    }

    const token = createGamerToken(gamer);
    const response = NextResponse.json({
      success: true,
      message: `Welcome back, @${gamer.username}!`,
      gamer,
    });

    response.cookies.set(GAMER_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to sign in";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

