import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  const subscribers = await prisma.subscriber.findMany();

  if (subscribers.length === 0) {
    return NextResponse.json({ error: "No subscribers" }, { status: 400 });
  }

  for (const sub of subscribers) {
    await resend.emails.send({
      from: "Whiteboy Wednesday <your_verified_domain@resend.dev>",
      to: sub.email,
      subject: "It's Whiteboy Wednesday 👱‍♂️🔥",
      html: `
        <h1>It's Whiteboy Wednesday!</h1>
        <p>A new whiteboy has been featured on the site.</p>
        <p><a href="https://whiteboyoftheweek.com">Check him out →</a></p>
      `,
    });
  }

  return NextResponse.json({ success: true });
}
