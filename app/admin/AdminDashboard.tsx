"use client";

import React from "react";

export default function AdminDashboard() {
  // 👇 TEMPORARY placeholder content
  // In the next step, we’ll move your REAL admin UI (pending photos, approve/reject, feature button, etc.)
  // from app/admin/page.tsx into here.

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold text-center">
        Admin Dashboard (Placeholder)
      </h1>
      <p className="text-sm text-center max-w-md text-gray-600">
        Your real moderation tools (approve / reject / feature) will live in
        this component. For now, this is just a placeholder to get the
        protection logic set up.
      </p>
    </main>
  );
}
