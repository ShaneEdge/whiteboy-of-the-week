// app/submit/page.tsx
"use client";

import { useState, FormEvent } from "react";

export default function SubmitPage() {
  const [status, setStatus] = useState<null | "idle" | "success" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");
    setStatus("idle");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const contact = String(formData.get("contact") || "").trim();
    const imageUrl = String(formData.get("imageUrl") || "").trim();
    const isAdult = formData.get("isAdult") === "on";
    const hasConsent = formData.get("hasConsent") === "on";

    if (!name || !contact || !imageUrl) {
      setErrorMsg("Please fill out all required fields.");
      setStatus("error");
      return;
    }
    if (!isAdult || !hasConsent) {
      setErrorMsg(
        "You must confirm that the person is 18+ and that you have their consent."
      );
      setStatus("error");
      return;
    }

    // Phase 1: just log locally. Later we can send to an API route / DB.
    console.log("New whiteboy submission:", {
      name,
      contact,
      imageUrl,
      isAdult,
      hasConsent,
    });

    form.reset();
    setStatus("success");
  }

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-3xl font-bold">Submit a Whiteboy</h1>

      <p className="text-sm text-slate-300">
        Want to nominate someone for Whiteboy of the Week? Use this form to
        send us a link. We review submissions manually before featuring
        anything.
      </p>

      <p className="text-xs text-slate-400">
        Rules: 18+ only, no harassment or hate, and you must have the
        person&apos;s permission to submit their image.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Your name or username *
          </label>
          <input
            name="name"
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-slate-400"
            placeholder="Example: @whiteboyfan420"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Contact (email or social handle) *
          </label>
          <input
            name="contact"
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-slate-400"
            placeholder="Example: your.email@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Image URL (public link) *
          </label>
          <input
            name="imageUrl"
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-slate-400"
            placeholder="https://..."
          />
          <p className="mt-1 text-xs text-slate-500">
            For now, paste a link (Google Drive, Dropbox, Imgur, etc.). We&apos;ll
            add direct uploads later.
          </p>
        </div>

        <div className="space-y-2 text-xs text-slate-300">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isAdult" />
            <span>
              I confirm the person in the image is at least 18 years old.
            </span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="hasConsent" />
            <span>
              I have their consent to submit this image to Whiteboy of the Week.
            </span>
          </label>
        </div>

        {status === "error" && (
          <p className="text-xs text-red-400">{errorMsg}</p>
        )}
        {status === "success" && (
          <p className="text-xs text-emerald-400">
            Thanks! Your whiteboy submission has been received. We&apos;ll review
            it manually.
          </p>
        )}

        <button
          type="submit"
          className="rounded-full border border-slate-500 px-4 py-2 text-sm font-medium hover:border-slate-300"
        >
          Submit Whiteboy
        </button>
      </form>
    </div>
  );
}
