// app/about/page.tsx

export default function AboutPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">About Whiteboy of the Week</h1>

      <p className="text-sm text-slate-300">
        Whiteboy of the Week is is the hottest new site: once a week, we
        drop a new epic whiteboy pic.
      </p>

      <p className="text-sm text-slate-300">
        Just dudes
        being dudes, serving seasonal whiteboy vibes like{" "}
        <span className="italic">Whiteboy Winter</span>,{" "}
        <span className="italic">Whiteboy Summer</span>, and beyond.
      </p>

      <p className="text-sm text-slate-300">
        In the future, we might add email reminders for new
        Wednesdays, and rotating seasonal themes. For now, enjoy the weekly
        drop.
      </p>
    </div>
  );
}
