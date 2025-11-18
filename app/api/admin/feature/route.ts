// app/api/admin/feature/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Missing or invalid id" }, { status: 400 });
    }

    // Clear existing featured flag
    await prisma.submission.updateMany({
      data: { featured: false },
    });

    // Set this submission as featured
    const updated = await prisma.submission.update({
      where: { id },
      data: { featured: true },
    });

    return NextResponse.json({ success: true, featuredId: updated.id });
  } catch (err) {
    console.error("Error featuring submission:", err);
    return NextResponse.json(
      { error: "Failed to feature submission" },
      { status: 500 },
    );
  }
}