// app/archive/page.tsx
/* eslint-disable @next/next/no-img-element */

import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic"; // always show latest approved whiteboys

export default async function ArchivePage() {
  const submissions = await prisma.submission.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Archive</h1>
        <p className="text-sm text-slate-300">
          A gallery of all approved Whiteboy of the Week submissions.
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link
            href="/"
            className="rounded-full border border-slate-600 px-3 py-1 hover:border-slate-300"
          >
            ← Back to featured
          </Link>
          <Link
            href="/submit"
            className="rounded-full border border-slate-600 px-3 py-1 hover:border-slate-300"
          >
            Submit a new whiteboy
          </Link>
        </div>
      </header>

      {submissions.length === 0 ? (
        <p className="text-sm text-slate-400">
          No approved submissions yet. Once you approve some in the admin
          dashboard, they&apos;ll show up here.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {submissions.map((s) => (
            <article
              key={s.id}
              className="flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
            >
              <div className="relative aspect-3/4 w-full overflow-hidden border-b border-slate-800 bg-slate-950">
                <img
                  src={s.imageUrl}
                  alt={s.name}
                  className="h-full w-full object-cover"
                />
                {s.featured && (
                  <span className="absolute left-2 top-2 rounded-full bg-yellow-500/90 px-2 py-0.5 text-[10px] font-semibold text-slate-900">
                    FEATURED
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-1 px-3 py-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold truncate">{s.name}</p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-xs text-slate-400 truncate">
                  Submitted by <span className="font-medium">{s.contact}</span>
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  18+ confirmed: {s.isAdult ? "Yes" : "No"} • Consent:{" "}
                  {s.hasConsent ? "Yes" : "No"}
                </p>

                <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                  <a
                    href={s.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-slate-200"
                  >
                    Open full image
                  </a>
                  <span className="text-slate-600">
                    Status: <span className="text-slate-300">APPROVED</span>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
