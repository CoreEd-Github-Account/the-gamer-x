import { NextResponse } from "next/server";
import { GAMER_COOKIE_NAME } from "@/lib/forumAuth";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  response.cookies.set(GAMER_COOKIE_NAME, "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}

