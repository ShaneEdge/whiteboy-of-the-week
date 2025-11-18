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
  featured?: boolean;
}

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

type ViewMode = "submissions" | "subscribers";

export default function AdminDashboard() {
  const [view, setView] = useState<ViewMode>("submissions");

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [subs, setSubs] = useState<Subscriber[]>([]);

  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [loadingSubs, setLoadingSubs] = useState(false);

  const [error, setError] = useState("");

  // --- Submissions logic ---

  async function loadSubmissions() {
    try {
      setLoadingSubmissions(true);
      setError("");
      const res = await fetch("/api/admin/submissions");
      if (!res.ok) throw new Error("Failed to load submissions");
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load submissions");
    } finally {
      setLoadingSubmissions(false);
    }
  }

  async function updateStatus(id: string, status: SubmissionStatus) {
    try {
      setError("");
      const res = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      const updated: Submission = await res.json();
      setSubmissions((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update submission status");
    }
  }

  async function featureSubmission(id: string) {
    try {
      setError("");
      const res = await fetch("/api/admin/feature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to feature submission");

      const updated: Submission = await res.json();
      setSubmissions((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to feature submission");
    }
  }

  // --- Subscribers logic ---

  async function loadSubscribers() {
    try {
      setLoadingSubs(true);
      setError("");
      const res = await fetch("/api/admin/subscribers");
      if (!res.ok) throw new Error("Failed to load subscribers");
      const data = await res.json();
      setSubs(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load subscribers");
    } finally {
      setLoadingSubs(false);
    }
  }

  async function deleteSubscriber(id: string) {
    try {
      setError("");
      const res = await fetch("/api/admin/subscribers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete subscriber");

      setSubs((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete subscriber");
    }
  }

  // Initial load
  useEffect(() => {
    loadSubmissions();
  }, []);

  // When switching to subscribers view, load if empty
  useEffect(() => {
    if (view === "subscribers" && subs.length === 0 && !loadingSubs) {
      loadSubscribers();
    }
  }, [view, subs.length, loadingSubs]);

  return (
    <div className="space-y-4 p-4">
      {/* Header + view toggle */}
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Admin Tools</h1>
          <p className="text-sm text-slate-300">
            Moderate submissions and manage email subscribers.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setView("submissions")}
            className={`rounded-full px-3 py-1 border ${
              view === "submissions"
                ? "border-slate-200 bg-slate-200 text-slate-900"
                : "border-slate-600 text-slate-200 hover:border-slate-300"
            }`}
          >
            Submissions
          </button>
          <button
            onClick={() => setView("subscribers")}
            className={`rounded-full px-3 py-1 border ${
              view === "subscribers"
                ? "border-slate-200 bg-slate-200 text-slate-900"
                : "border-slate-600 text-slate-200 hover:border-slate-300"
            }`}
          >
            Subscribers
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* --- View: Submissions --- */}
      {view === "submissions" && (
        <div className="space-y-3">
          <button
            onClick={loadSubmissions}
            className="rounded-full border border-slate-500 px-3 py-1 text-xs hover:border-slate-300"
          >
            Refresh submissions
          </button>

          {loadingSubmissions ? (
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
                    {/* Left: details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{s.name}</p>
                        {s.featured && (
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

                    {/* Middle: thumbnail */}
                    {s.imageUrl && (
                      <div className="mt-2 w-full max-w-[140px] self-start md:mt-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
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
      )}

      {/* --- View: Subscribers --- */}
      {view === "subscribers" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={loadSubscribers}
              className="rounded-full border border-slate-500 px-3 py-1 text-xs hover:border-slate-300"
            >
              Refresh subscribers
            </button>
            <p className="text-xs text-slate-400">
              Total subscribers:{" "}
              <span className="font-semibold text-slate-200">
                {subs.length}
              </span>
            </p>
          </div>

          {loadingSubs ? (
            <p className="text-sm text-slate-400">Loading subscribers…</p>
          ) : subs.length === 0 ? (
            <p className="text-sm text-slate-400">
              No subscribers yet. The homepage subscribe form will add them
              here.
            </p>
          ) : (
            <div className="space-y-2">
              {subs.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs"
                >
                  <div>
                    <p className="font-medium text-slate-100">{s.email}</p>
                    <p className="text-[11px] text-slate-500">
                      Joined: {new Date(s.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteSubscriber(s.id)}
                    className="rounded-full border border-red-500 px-3 py-1 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
