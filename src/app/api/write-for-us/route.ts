import { NextRequest, NextResponse } from "next/server";
import { getSubmissions, addSubmission, saveSubmissions } from "@/lib/submissions";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const submissions = await getSubmissions();
    return NextResponse.json({ success: true, submissions });
  } catch (error) {
    console.error("GET /api/write-for-us error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to retrieve submissions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, category, title, pitch, portfolioUrl, samples, estimatedWords } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Please provide your name or byline." },
        { status: 400 }
      );
    }

    if (!email?.trim() || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid contact email address." },
        { status: 400 }
      );
    }

    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, message: "Please provide a proposed working title." },
        { status: 400 }
      );
    }

    if (!pitch?.trim() || pitch.trim().length < 40) {
      return NextResponse.json(
        { success: false, message: "Please provide a pitch synopsis of at least 40 characters." },
        { status: 400 }
      );
    }

    const created = await addSubmission({
      name: name.trim(),
      email: email.trim(),
      category: category || "Features & Essays",
      title: title.trim(),
      pitch: pitch.trim(),
      portfolioUrl: portfolioUrl?.trim() || undefined,
      samples: samples?.trim() || undefined,
      estimatedWords: estimatedWords?.trim() || "800 - 1,500 words",
    });

    if (created) {
      return NextResponse.json({
        success: true,
        submission: created,
        message: "Your pitch has been submitted successfully to TheGamerX editorial team.",
      });
    }

    return NextResponse.json(
      { success: false, message: "Failed to save submission. Please try again." },
      { status: 500 }
    );
  } catch (error) {
    console.error("POST /api/write-for-us error:", error);
    return NextResponse.json(
      { success: false, message: "Server error processing submission." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_session")?.value;
    if (!adminToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin session required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { submissions } = body;

    if (!Array.isArray(submissions)) {
      return NextResponse.json(
        { success: false, message: "Invalid submissions payload" },
        { status: 400 }
      );
    }

    const success = await saveSubmissions(submissions);
    if (success) {
      return NextResponse.json({ success: true, submissions });
    }

    return NextResponse.json(
      { success: false, message: "Failed to persist submissions update" },
      { status: 500 }
    );
  } catch (error) {
    console.error("PUT /api/write-for-us error:", error);
    return NextResponse.json(
      { success: false, message: "Server error updating submissions" },
      { status: 500 }
    );
  }
}

