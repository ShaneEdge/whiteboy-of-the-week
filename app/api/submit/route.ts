// app/api/submit/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const contact = String(body.contact || "").trim();
    const imageUrl = String(body.imageUrl || "").trim();
    const isAdult = Boolean(body.isAdult);
    const hasConsent = Boolean(body.hasConsent);

    if (!name || !contact || !imageUrl) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (!isAdult || !hasConsent) {
      return NextResponse.json(
        {
          error:
            "You must confirm the person is 18+ and you have their consent.",
        },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.create({
      data: {
        name,
        contact,
        imageUrl,
        isAdult,
        hasConsent,
      },
    });

    return NextResponse.json(
      { ok: true, id: submission.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error saving submission:", err);
    return NextResponse.json(
      { error: "Something went wrong processing your submission." },
      { status: 500 }
    );
  }
}
