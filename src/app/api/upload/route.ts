import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { isAuthenticatedRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!isAuthenticatedRequest(req)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Admin access required." },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided in form data" },
        { status: 400 }
      );
    }

    // Verify it is an image
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Uploaded file must be an image" },
        { status: 400 }
      );
    }

    // Limit size to 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "Image size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    // Ensure upload directory exists
    await fs.mkdir(uploadsDir, { recursive: true });

    // Sanitize extension and filename
    const originalExt = path.extname(file.name) || ".jpg";
    const sanitizedBase = path
      .basename(file.name, originalExt)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 40);

    const filename = `hero-${Date.now()}-${sanitizedBase || "image"}${originalExt}`;
    const destinationPath = path.join(uploadsDir, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await fs.writeFile(destinationPath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully",
      url: publicUrl,
      filename,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error uploading file";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

