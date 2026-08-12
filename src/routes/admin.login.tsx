import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { adminLogin } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login | Himadri Creation" },
      { name: "description", content: "Secure login for the Himadri Creation blog admin panel." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const login = useServerFn(adminLogin);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await login({
        data: {
          username: String(form.get("username") ?? ""),
          password: String(form.get("password") ?? ""),
        },
      });
      if (res.ok) {
        void navigate({ to: "/admin" });
        return;
      }
      setError("Incorrect username or password.");
    } catch {
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-primary-dark px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-lift">
        <img
          src="/assets/logo-nav.jpeg"
          alt="Himadri Creation"
          width={64}
          height={64}
          className="mx-auto h-16 w-16 rounded-full object-cover"
        />
        <h1 className="font-display mt-5 text-center text-2xl text-primary-dark">
          Himadri Creation Admin
        </h1>
        <p className="mt-1 text-center text-xs tracking-[0.24em] text-muted-foreground uppercase">
          Secure Sign In
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Username</span>
            <input
              name="username"
              autoComplete="username"
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 outline-none focus:border-primary"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Password</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 outline-none focus:border-primary"
            />
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold tracking-wide text-primary-foreground uppercase transition hover:bg-primary-dark disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}