// lib/whiteboys.ts

export type Season = "winter" | "spring" | "summer" | "fall";

export interface WhiteboyEntry {
  id: string;
  dateLabel: string;    // e.g. "Nov 19, 2025"
  imageSrc: string;     // path in /public
  caption: string;
  season: Season;
}

export const whiteboys: WhiteboyEntry[] = [
  {
    id: "wb-001",
    dateLabel: "Nov 19, 2025",
    imageSrc: "/whiteboys/wb-001.jpg",
    caption: "Peak Whiteboy Winter energy.",
    season: "winter",
  },
];

export const currentSeason = {
  name: "Whiteboy Winter",
  tagline: "Whiteboy Winter ❄️",
};

// For now we just feature the first entry
export const weeklyWhiteboy: WhiteboyEntry = whiteboys[0];
