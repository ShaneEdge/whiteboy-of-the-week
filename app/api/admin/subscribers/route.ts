import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/subscribers
export async function GET() {
  const subs = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(subs);
}

// DELETE /api/admin/subscribers  with JSON body: { id: "..." }
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing subscriber id" },
        { status: 400 }
      );
    }

    await prisma.subscriber.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete subscriber", err);
    return NextResponse.json(
      { error: "Failed to delete subscriber" },
      { status: 500 }
    );
  }
}

