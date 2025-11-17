// app/archive/page.tsx
import Image from "next/image";
import { whiteboys } from "@/lib/whiteboys";

export default function ArchivePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Archive</h1>
      <p className="mt-2 text-sm text-slate-300">
        All past Whiteboy of the Week drops, organized by week.
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {whiteboys.map((wb) => (
          <div
            key={wb.id}
            className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
          >
            <div className="relative aspect-3/4">
              <Image
                src={wb.imageSrc}
                alt={wb.caption}
                fill
                className="object-cover"
              />
            </div>
            <div className="border-t border-slate-800 px-3 py-2 text-sm">
              <p className="text-slate-100">{wb.caption}</p>
              <p className="mt-1 text-xs text-slate-400">
                Week of {wb.dateLabel} •{" "}
                {wb.season === "winter" && "Whiteboy Winter"}
                {wb.season === "summer" && "Whiteboy Summer"}
                {wb.season === "spring" && "Whiteboy Spring"}
                {wb.season === "fall" && "Autumn Whiteboy"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
