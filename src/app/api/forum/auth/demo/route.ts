import { NextRequest, NextResponse } from "next/server";
import { findGamerByUsername, createGamerToken, GAMER_COOKIE_NAME, INITIAL_GAMERS } from "@/lib/forumAuth";
import { GamerProfile } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const username = body.username || INITIAL_GAMERS[0].username;

    const gamer = await findGamerByUsername(username);
    if (!gamer) {
      return NextResponse.json(
        { success: false, message: "Demo gamer not found" },
        { status: 404 }
      );
    }

    const profile: GamerProfile = {
      id: gamer.id,
      username: gamer.username,
      displayName: gamer.displayName,
      badge: gamer.badge,
      badgeColor: gamer.badgeColor,
      steamId: gamer.steamId,
      psnId: gamer.psnId,
      xboxId: gamer.xboxId,
      karma: gamer.karma,
      joinedAt: gamer.joinedAt,
      bio: gamer.bio,
    };
    const token = createGamerToken(profile);

    const response = NextResponse.json({
      success: true,
      message: `Signed in as @${profile.username}`,
      gamer: profile,
    });

    response.cookies.set(GAMER_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed demo login";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

