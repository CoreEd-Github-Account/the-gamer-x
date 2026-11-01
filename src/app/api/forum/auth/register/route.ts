import { NextRequest, NextResponse } from "next/server";
import { registerGamer, createGamerToken, GAMER_COOKIE_NAME } from "@/lib/forumAuth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, displayName, steamId, psnId } = body;

    if (!username) {
      return NextResponse.json(
        { success: false, message: "Username is required" },
        { status: 400 }
      );
    }

    const gamer = await registerGamer({
      username,
      password,
      displayName,
      steamId,
      psnId,
    });

    const token = createGamerToken(gamer);
    const response = NextResponse.json({
      success: true,
      message: `Profile created! Welcome to TheGamerX, @${gamer.username}!`,
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
    const message = error instanceof Error ? error.message : "Failed to register profile";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}

