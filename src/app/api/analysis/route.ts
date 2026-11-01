import { NextRequest, NextResponse } from "next/server";
import { getIndustryArticles, saveIndustryArticles } from "@/lib/industry";
import { isAuthenticatedRequest } from "@/lib/auth";

export async function GET() {
  try {
    const articles = await getIndustryArticles();
    return NextResponse.json({
      success: true,
      articles,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to retrieve industry analysis articles" },
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
    const articles = body.articles || body;

    if (!Array.isArray(articles)) {
      return NextResponse.json(
        { success: false, message: "Payload must include an array of articles" },
        { status: 400 }
      );
    }

    const saved = await saveIndustryArticles(articles);

    return NextResponse.json({
      success: true,
      message: "Industry analysis articles updated successfully",
      articles: saved,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update industry analysis articles";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return PUT(req);
}

