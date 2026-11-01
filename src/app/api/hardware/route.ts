import { NextRequest, NextResponse } from "next/server";
import { getHardwareItems, saveHardwareItems } from "@/lib/hardware";
import { isAuthenticatedRequest } from "@/lib/auth";

export async function GET() {
  try {
    const items = await getHardwareItems();
    return NextResponse.json({
      success: true,
      hardware: items,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load hardware items";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthenticatedRequest(req)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Admin session required." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const items = body.hardware || body;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { success: false, message: "Payload must be an array of hardware items" },
        { status: 400 }
      );
    }

    const saved = await saveHardwareItems(items);

    return NextResponse.json({
      success: true,
      message: "Hardware items updated successfully",
      hardware: saved,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update hardware";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

