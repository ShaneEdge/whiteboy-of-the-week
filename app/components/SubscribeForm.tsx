"use client";

import { useState, type FormEvent } from "react";

type SubscribeStatus = "idle" | "success" | "error" | "loading";
type SubscribeError = { error?: string };

export default function SubscribeForm() {
  const [status, setStatus] = useState<SubscribeStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // 👇 capture the form *before* any await, so it doesn't get nulled out
    const form = e.currentTarget;

    setStatus("loading");
    setMessage("");

    const formData = new FormData(form);

    const res = await fetch("/api/subscribe", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setStatus("success");
      setMessage("You're subscribed! Look for Whiteboy Wednesday emails 🍻");
      form.reset(); // safe now
    } else {
      setStatus("error");

      let data: SubscribeError | null = null;
      try {
        data = (await res.json()) as SubscribeError;
      } catch {
        // ignore JSON parse errors
      }

      setMessage(data?.error ?? "Something went wrong. Try again?");
    }
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3">
      <h2 className="text-lg font-semibold">Get Whiteboy Wednesday reminders</h2>
      <p className="text-sm text-slate-300">
        Subscribe and we&apos;ll email you when a new Whiteboy of the Week drops.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <input
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-md border border-slate-500 px-4 py-2 text-sm font-medium hover:border-slate-300 disabled:opacity-50"
        >
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </form>

      {status === "success" && (
        <p className="text-xs text-green-400">{message}</p>
      )}
      {status === "error" && <p className="text-xs text-red-400">{message}</p>}

      <p className="text-[11px] text-slate-500">
        We only email you once per week. No spam.
      </p>
    </section>
  );
}
