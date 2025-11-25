// app/page.tsx
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SubscribeForm from "./components/SubscribeForm";

export default async function Home() {
  const featured = await prisma.submission.findFirst({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Whiteboy of the Week
        </h1>
        <p className="text-sm text-slate-300">
          New epic pics of certified whiteboys. 18+ only, posted with consent.
        </p>
        <p className="text-xs text-slate-500">
          Seasonal theme: <span className="font-semibold">Whiteboy Winter ❄️</span>
        </p>
      </header>

      <section className="space-y-4">
        {!featured ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-300">
            <p className="font-semibold mb-1">No featured whiteboy yet.</p>
            <p className="mb-3">
              Once you feature a submission from the admin dashboard, it will
              appear here as the current Whiteboy of the Week.
            </p>
            <Link
              href="/submit"
              className="inline-flex items-center rounded-full border border-slate-500 px-4 py-2 text-xs font-medium hover:border-slate-300"
            >
              Submit a whiteboy
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="flex flex-col gap-4 p-4 md:flex-row">
              <div className="flex-1 space-y-3">
                <p className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200">
                  ⭐ Current Whiteboy of the Week
                </p>
                <div className="space-y-1">
                  <p className="text-lg font-semibold">{featured.name}</p>
                  <p className="text-xs text-slate-400">
                    Featured on{" "}
                    {new Date(featured.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-xs text-slate-400">
                  Submitted by <span className="font-medium">{featured.contact}</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  Content rules: Adults only, and all submissions must be made
                  with the subject&apos;s consent. No harassment or hate.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <Link
                    href="/submit"
                    className="rounded-full border border-slate-500 px-4 py-2 font-medium hover:border-slate-300"
                  >
                    Submit your own whiteboy
                  </Link>
                  <Link
                    href="/archive"
                    className="rounded-full border border-slate-700 px-3 py-2 hover:border-slate-400"
                  >
                    View archive
                  </Link>
                </div>
              </div>

              {/* Image */}
              <div className="flex w-full items-center justify-center md:w-80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featured.imageUrl}
                  alt={`Whiteboy of the Week – ${featured.name}`}
                  className="aspect-3/4 w-full max-w-xs rounded-xl border border-slate-800 object-cover"
                />
              </div>
            </div>
          </div>
        )}
            </section>

      {/* 👇 Subscribe Section */}
      <SubscribeForm />

      <section className="text-xs text-slate-500">
        <p>
          If you want a submission removed, contact the site owner and it will be
          taken down.
        </p>
      </section>
    </div>
  );
}

