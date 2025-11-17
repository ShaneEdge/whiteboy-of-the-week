// app/api/admin/submissions/route.ts
import type { SubmissionStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get all submissions, newest first
export async function GET() {
  const submissions = await prisma.submission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(submissions);
}

// Update the status of a submission (APPROVED / REJECTED / PENDING)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = String(body.id || "").trim();
    const rawStatus = String(body.status || "").trim().toUpperCase();

    if (
      !id ||
      !["PENDING", "APPROVED", "REJECTED"].includes(rawStatus)
    ) {
      return NextResponse.json(
        { error: "Invalid id or status" },
        { status: 400 }
      );
    }

    const status = rawStatus as SubmissionStatus;

    const updated = await prisma.submission.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error updating submission status:", err);
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    );
  }
}

