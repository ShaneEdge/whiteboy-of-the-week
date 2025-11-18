// app/admin/AdminDashboard.tsx
"use client";

import { useEffect, useState } from "react";

type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

interface Submission {
  id: string;
  createdAt: string;
  name: string;
  contact: string;
  imageUrl: string;
  isAdult: boolean;
  hasConsent: boolean;
  status: SubmissionStatus;
  // Optional: used if your API sends back featured info
  isFeatured?: boolean;
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSubmissions() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admin/submissions");
      if (!res.ok) {
        throw new Error("Failed to load submissions");
      }
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubmissions();
  }, []);

  async function updateStatus(id: string, status: SubmissionStatus) {
    try {
      setError("");
      const res = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      const updated: Submission = await res.json();
      setSubmissions((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update submission status");
    }
  }

  // 🔹 Feature button handler
  async function featureSubmission(id: string) {
    try {
      setError("");

      // ⬇️ If your old API used a different route/method,
      // just swap this out to match it.
      const res = await fetch("/api/admin/feature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error("Failed to feature submission");
      }

      const updated: Submission = await res.json();
      setSubmissions((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to feature submission");
    }
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold">Admin – Submissions</h1>
          <p className="text-sm text-slate-300">
            View and moderate Whiteboy of the Week submissions.
          </p>
        </div>

        <button
          onClick={loadSubmissions}
          className="rounded-full border border-slate-500 px-3 py-1 text-xs hover:border-slate-300"
        >
          Refresh
        </button>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-400">Loading submissions…</p>
      ) : submissions.length === 0 ? (
        <p className="text-sm text-slate-400">No submissions yet.</p>
      ) : (
        <div className="space-y-3">
          {submissions.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                {/* Left side: text details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{s.name}</p>
                    {s.isFeatured && (
                      <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-yellow-300">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{s.contact}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Submitted: {new Date(s.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs break-all text-slate-400">
                    Image URL: {s.imageUrl}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    18+ confirmed: {s.isAdult ? "Yes" : "No"} • Consent:{" "}
                    {s.hasConsent ? "Yes" : "No"}
                  </p>
                </div>

                {/* Middle: thumbnail preview */}
                {s.imageUrl && (
                  <div className="mt-2 w-full max-w-[140px] self-start md:mt-0">
                    <img
                      src={s.imageUrl}
                      alt={`Submission from ${s.name}`}
                      className="h-32 w-full rounded-lg border border-slate-700 object-cover"
                    />
                    <p className="mt-1 text-[10px] text-center text-slate-500">
                      Preview
                    </p>
                  </div>
                )}

                {/* Right: status pill */}
                <span
                  className={`mt-2 inline-flex h-fit rounded-full px-2 py-0.5 text-xs font-medium md:mt-0 ${
                    s.status === "APPROVED"
                      ? "bg-emerald-900 text-emerald-200"
                      : s.status === "REJECTED"
                      ? "bg-red-900 text-red-200"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {s.status}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => updateStatus(s.id, "APPROVED")}
                  className="rounded-full border border-emerald-500 px-3 py-1 hover:bg-emerald-500/10"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(s.id, "REJECTED")}
                  className="rounded-full border border-red-500 px-3 py-1 hover:bg-red-500/10"
                >
                  Reject
                </button>
                <button
                  onClick={() => updateStatus(s.id, "PENDING")}
                  className="rounded-full border border-slate-500 px-3 py-1 hover:bg-slate-500/10"
                >
                  Reset
                </button>
                <button
                  onClick={() => featureSubmission(s.id)}
                  className="rounded-full border border-yellow-500 px-3 py-1 hover:bg-yellow-500/10"
                >
                  Feature
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
