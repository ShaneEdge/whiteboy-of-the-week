// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Whiteboy of the Week",
  description: "New epic whiteboy pics every Wednesday.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-semibold text-lg">
              Whiteboy of the Week
            </Link>

            <nav className="flex gap-4 text-sm">
              <Link href="/archive" className="hover:underline">
                Archive
              </Link>
              <Link href="/submit" className="hover:underline">
                Submit
              </Link>
              <Link href="/about" className="hover:underline">
                About
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>

        <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
          New epic pics every Wednesday • Adults only, posted with consent.
        </footer>
      </body>
    </html>
  );
}


