// app/page.tsx
import Image from "next/image";
import { getCurrentSeason, getWeeklyWhiteboy } from "@/lib/whiteboys";

export default function HomePage() {
  const season = getCurrentSeason();
  const wb = getWeeklyWhiteboy();

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
        {season.tagline}
      </p>

      <h1 className="mt-3 text-center text-4xl font-bold md:text-5xl">
        Whiteboy of the Week
      </h1>

      <p className="mt-2 max-w-md text-center text-sm text-slate-300">
        A weekly drop of peak whiteboy energy. New epic pic every Wednesday.
      </p>

      <div className="mt-8 w-full max-w-md">
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">
          <div className="relative aspect-3/4">
            <Image
              src={wb.imageSrc}
              alt={wb.caption}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="border-t border-slate-800 px-4 py-3 text-center text-sm text-slate-200">
            <p>{wb.caption}</p>
            <p className="mt-1 text-xs text-slate-400">
              Week of {wb.dateLabel} • {season.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

