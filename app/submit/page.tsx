// app/submit/page.tsx
"use client";

import {
  useState,
  useEffect,
  FormEvent,
  ChangeEvent,
} from "react";

type StatusState = "idle" | "loading" | "success" | "error";

export default function SubmitPage() {
  const [status, setStatus] = useState<StatusState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Clean up preview URL when component unmounts or changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPreviewUrl(null);
      setFileName(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select an image file (jpg, png, etc.).");
      setStatus("error");
      e.target.value = "";
      return;
    }

    setErrorMsg("");
    setStatus("idle");
    setFileName(file.name);

    // Local preview
    const url = URL.createObjectURL(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });

    // Upload to /api/upload
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg =
          data?.error || "File upload failed. Please try again.";
        setErrorMsg(msg);
        setStatus("error");
        return;
      }

      const data = await res.json();

      // Auto-fill the imageUrl input with the returned Blob URL
      const input = document.querySelector<HTMLInputElement>(
        'input[name="imageUrl"]',
      );
      if (input) {
        input.value = data.url;
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error during upload. Please try again.");
      setStatus("error");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");
    setStatus("loading");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const contact = String(formData.get("contact") || "").trim();
    const imageUrl = String(formData.get("imageUrl") || "").trim();
    const isAdult = formData.get("isAdult") === "on";
    const hasConsent = formData.get("hasConsent") === "on";

    if (!imageUrl) {
      setErrorMsg(
        "Please upload an image or provide an image URL."
      );
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          imageUrl,
          isAdult,
          hasConsent,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg =
          data?.error || "Submission failed. Please try again.";
        setErrorMsg(msg);
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("success");
      setPreviewUrl(null);
      setFileName(null);
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-3xl font-bold">Submit a Whiteboy</h1>

      <p className="text-sm text-slate-300">
        Want to nominate someone for Whiteboy of the Week? Use this
        form to send us an image. We review submissions manually
        before featuring anything.
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

        {/* File picker + preview + upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">
            Image file (upload)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-200 file:mr-3 file:rounded-md file:border file:border-slate-600 file:bg-slate-800 file:px-3 file:py-1 file:text-xs file:font-medium hover:file:border-slate-300"
          />
          {fileName && (
            <p className="text-xs text-slate-400">
              Selected: {fileName}
            </p>
          )}
          {previewUrl && (
            <div className="mt-2 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-2">
              <p className="mb-2 text-xs text-slate-400">Preview:</p>
              <div className="relative aspect-3/4 w-32 overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Selected whiteboy preview"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
          {uploading && (
            <p className="text-xs text-slate-400">
              Uploading image…
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Image URL (auto-filled from upload, or custom) *
          </label>
          <input
            name="imageUrl"
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-slate-400"
            placeholder="https://..."
          />
          <p className="mt-1 text-xs text-slate-500">
            When you upload a file, this will auto-fill with a hosted
            URL. You can also paste your own URL if you prefer.
          </p>
        </div>

        <div className="space-y-2 text-xs text-slate-300">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isAdult" />
            <span>
              I confirm the person in the image is at least 18 years
              old.
            </span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="hasConsent" />
            <span>
              I have their consent to submit this image to Whiteboy of
              the Week.
            </span>
          </label>
        </div>

        {status === "error" && (
          <p className="text-xs text-red-400">{errorMsg}</p>
        )}
        {status === "success" && (
          <p className="text-xs text-emerald-400">
            Thanks! Your whiteboy submission has been received.
            We&apos;ll review it manually.
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading" || uploading}
          className="rounded-full border border-slate-500 px-4 py-2 text-sm font-medium hover:border-slate-300 disabled:opacity-60"
        >
          {status === "loading"
            ? "Submitting..."
            : uploading
            ? "Uploading image…"
            : "Submit Whiteboy"}
        </button>
      </form>
    </div>
  );
}
