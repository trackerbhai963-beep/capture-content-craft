import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminListPosts } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard | Himadri Creation Admin" },
      { name: "description", content: "Blog overview for the Himadri Creation admin panel." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const list = useServerFn(adminListPosts);
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin", "posts"],
    queryFn: () => list(),
  });

  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.length - published;

  return (
    <AdminShell
      title="Dashboard"
      description="Manage your photography blog content"
      actions={
        <Link
          to="/admin/blog/new"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          New blog
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Total blogs", posts.length],
          ["Published", published],
          ["Drafts", drafts],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">{label}</p>
            <p className="font-display mt-2 text-3xl text-primary-dark">{value}</p>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-display text-lg text-primary-dark">Recent blogs</h2>
        {isLoading ? (
          <p className="mt-3 text-sm text-muted-foreground">Loading your blogs…</p>
        ) : posts.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No blogs yet. Create your first photography story.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {posts.slice(0, 6).map((p) => (
              <li key={p.slug} className="flex flex-wrap items-center gap-3 py-3">
                <span className="flex-1 text-sm font-medium">{p.title}</span>
                <span className="text-xs text-muted-foreground">{p.category}</span>
                <span className="text-primary text-xs uppercase">{p.status}</span>
                <Link
                  to="/admin/blog/$slug"
                  params={{ slug: p.slug }}
                  className="text-primary text-sm underline"
                >
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AdminShell>
  );
}