// lib/whiteboys.ts

export type Season = "winter" | "spring" | "summer" | "fall";

export interface WhiteboyEntry {
  id: string;
  date: string;       // ISO date: YYYY-MM-DD (Wednesday of that week)
  dateLabel: string;  // Pretty label for display
  imageSrc: string;
  caption: string;
  season: Season;
}

// 🔹 Add a new entry each Wednesday with the proper date
export const whiteboys: WhiteboyEntry[] = [
  {
    id: "wb-001",
    date: "2025-11-19", // <- real date for that week's drop
    dateLabel: "Nov 19, 2025",
    imageSrc: "/whiteboys/wb-001.jpg",
    caption: "Peak Whiteboy Winter energy.",
    season: "winter",
  },
  // when you add a new week, add it here with the new Wednesday date:
  // {
  //   id: "wb-002",
  //   date: "2025-11-26",
  //   dateLabel: "Nov 26, 2025",
  //   imageSrc: "/whiteboys/wb-002.jpg",
  //   caption: "Another legendary whiteboy.",
  //   season: "winter",
  // },
];

// --- Helpers ---

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// Given "today", return the correct whiteboy for this week.
// It always picks the MOST RECENT entry whose date <= today.
export function getWeeklyWhiteboy(today = new Date()): WhiteboyEntry {
  const todayDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  let current = whiteboys[0];

  for (const wb of whiteboys) {
    const wbDate = parseDate(wb.date);
    if (wbDate <= todayDay && wbDate >= parseDate(current.date)) {
      current = wb;
    }
  }

  return current;
}

// Auto season based on month (0–11)
export function getCurrentSeason(today = new Date()): {
  name: string;
  tagline: string;
} {
  const month = today.getMonth();

  if (month === 11 || month === 0 || month === 1) {
    return { name: "Whiteboy Winter", tagline: "Whiteboy Winter ❄️" };
  }
  if (month >= 2 && month <= 4) {
    return { name: "Whiteboy Spring", tagline: "Whiteboy Spring 🌱" };
  }
  if (month >= 5 && month <= 7) {
    return { name: "Whiteboy Summer", tagline: "Whiteboy Summer ☀️" };
  }
  return { name: "Autumn Whiteboy", tagline: "Autumn Whiteboy 🍂" };
}
