import { NextRequest, NextResponse } from "next/server";
import { getHeroSlides, saveHeroSlides } from "@/lib/hero";
import { isAuthenticatedRequest } from "@/lib/auth";

export async function GET() {
  try {
    const slides = await getHeroSlides();
    return NextResponse.json({
      success: true,
      slides,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to retrieve hero slides" },
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
    const slides = body.slides || body;

    if (!Array.isArray(slides)) {
      return NextResponse.json(
        { success: false, message: "Payload must include an array of slides" },
        { status: 400 }
      );
    }

    const saved = await saveHeroSlides(slides);

    return NextResponse.json({
      success: true,
      message: "Hero slides updated successfully",
      slides: saved,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update hero slides";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // Support POST as well as PUT for updating slides
  return PUT(req);
}
