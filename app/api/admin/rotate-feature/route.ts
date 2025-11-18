import { NextResponse } from "next/server";
import { featureNextWhiteboy } from "@/lib/featureWhiteboy";

export async function POST() {
  try {
    const featured = await featureNextWhiteboy();

    if (!featured) {
      return NextResponse.json(
        { error: "No approved submissions available to feature" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, featured });
  } catch (err) {
    console.error("Error rotating featured whiteboy:", err);
    return NextResponse.json(
      { error: "Server error rotating feature" },
      { status: 500 }
    );
  }
}
