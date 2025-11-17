// app/page.tsx
import Image from "next/image";
import { currentSeason, weeklyWhiteboy } from "@/lib/whiteboys";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
        {currentSeason.tagline}
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
              src={weeklyWhiteboy.imageSrc}
              alt={weeklyWhiteboy.caption}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="border-t border-slate-800 px-4 py-3 text-center text-sm text-slate-200">
            <p>{weeklyWhiteboy.caption}</p>
            <p className="mt-1 text-xs text-slate-400">
              Week of {weeklyWhiteboy.dateLabel} • Whiteboy Winter
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

