import { NextResponse } from "next/server";
import { getCurrentGamerSession } from "@/lib/forumAuth";

export async function GET() {
  try {
    const gamer = await getCurrentGamerSession();
    return NextResponse.json({
      success: true,
      gamer,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to read session" },
      { status: 500 }
    );
  }
}

