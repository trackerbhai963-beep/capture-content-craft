import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, useAdminSession } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings | Himadri Creation Admin" },
      { name: "description", content: "Admin account and content storage status." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { data } = useAdminSession();

  return (
    <AdminShell title="Settings" description="Account and content storage">
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5 text-sm">
          <h2 className="font-display text-lg text-primary-dark">Admin account</h2>
          <p className="mt-2 text-muted-foreground">
            Signed in as <span className="font-semibold text-foreground">{data?.username}</span>.
          </p>
          <p className="mt-2 text-muted-foreground">
            Your username and password are stored as secure server settings, never in the website
            code. Ask for a change any time and it applies instantly.
          </p>
        </section>
        <section className="rounded-2xl border border-border bg-card p-5 text-sm">
          <h2 className="font-display text-lg text-primary-dark">Content storage</h2>
          <p className="mt-2 text-muted-foreground">
            {data?.storageReady
              ? "Connected. Every blog you publish is saved straight into your website repository, and photos are stored alongside them."
              : "Not configured yet. Once the repository connection is added, publishing will save blogs and photos automatically."}
          </p>
        </section>
      </div>
    </AdminShell>
  );
}