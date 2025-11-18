import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "./AdminDashboard";

const SESSION_COOKIE_NAME = "admin_session";

export default async function AdminPage() {
  // ⬇️ NEW: cookies() is async now
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const isAuthed = session === process.env.ADMIN_SESSION_SECRET;

  // Server action: login
  async function login(formData: FormData) {
    "use server";

    const password = formData.get("password");

    // Basic sanity checks
    if (
      typeof password !== "string" ||
      !process.env.ADMIN_PASSWORD ||
      !process.env.ADMIN_SESSION_SECRET
    ) {
      redirect("/admin?error=1");
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      // Wrong password
      redirect("/admin?error=1");
    }

    // ⬇️ NEW: await cookies() inside the action too
    const cookieStore = await cookies();

    // Set secure session cookie
    cookieStore.set(SESSION_COOKIE_NAME, process.env.ADMIN_SESSION_SECRET!, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/admin",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    redirect("/admin");
  }

  // Server action: logout
  async function logout() {
    "use server";

    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);

    redirect("/admin");
  }

  // If not authenticated, show login form
  if (!isAuthed) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-sm space-y-4 border rounded-xl p-6 shadow">
          <h1 className="text-xl font-bold text-center">Admin Login</h1>

          <form action={login} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium">
                Admin Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="border rounded-md px-3 py-2 text-sm w-full"
                placeholder="Enter admin password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md px-3 py-2 text-sm font-medium border"
            >
              Log In
            </button>
          </form>

          <p className="text-xs text-center text-gray-500">
            Access is restricted to site moderators.
          </p>
        </div>
      </main>
    );
  }

  // If authenticated, show dashboard with Logout
  return (
    <main className="min-h-screen flex flex-col">
      <header className="w-full border-b px-4 py-3 flex items-center justify-between">
        <h1 className="font-semibold">Admin Tools</h1>

        <form action={logout}>
          <button
            type="submit"
            className="text-sm border rounded-md px-3 py-1"
          >
            Log out
          </button>
        </form>
      </header>

      <section className="flex-1">
        <AdminDashboard />
      </section>
    </main>
  );
}
