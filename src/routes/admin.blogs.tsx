import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminListPosts, adminSetStatus, adminDeletePost } from "@/lib/admin.functions";
import { BLOG_CATEGORIES } from "@/lib/blog-types";

export const Route = createFileRoute("/admin/blogs")({
  head: () => ({
    meta: [
      { title: "All Blogs | Himadri Creation Admin" },
      { name: "description", content: "Edit, publish or delete Himadri Creation blog posts." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BlogsPage,
});

function BlogsPage() {
  const qc = useQueryClient();
  const list = useServerFn(adminListPosts);
  const setStatus = useServerFn(adminSetStatus);
  const remove = useServerFn(adminDeletePost);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatusFilter] = useState("All");
  const [error, setError] = useState("");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin", "posts"],
    queryFn: () => list(),
  });

  const filtered = posts.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      (status === "All" || p.status === status) &&
      p.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminShell title="All blogs" description="Search, edit and manage every article">
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search blogs…"
          className="min-w-48 flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
        >
          {["All", ...BLOG_CATEGORIES].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
        >
          {["All", "published", "draft"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {error && <p className="mb-3 text-sm text-destructive">{error}</p>}

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {isLoading ? (
          <p className="p-5 text-sm text-muted-foreground">Loading your blogs…</p>
        ) : filtered.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No blogs match these filters.</p>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((p) => (
              <li key={p.slug} className="flex flex-wrap items-center gap-3 p-4">
                {p.coverImage && (
                  <img src={p.coverImage} alt={p.coverAlt} className="h-14 w-20 rounded-lg object-cover" />
                )}
                <div className="min-w-40 flex-1">
                  <p className="text-sm font-semibold">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.category} · {p.status} · {(p.publishedAt || "").slice(0, 10)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Link
                    to="/admin/blog/$slug"
                    params={{ slug: p.slug }}
                    className="rounded-lg border border-border px-3 py-1.5"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="rounded-lg border border-border px-3 py-1.5"
                    onClick={async () => {
                      setError("");
                      try {
                        await setStatus({
                          data: {
                            slug: p.slug,
                            status: p.status === "published" ? "draft" : "published",
                          },
                        });
                        await qc.invalidateQueries({ queryKey: ["admin", "posts"] });
                      } catch {
                        setError("Unable to change that blog's status right now.");
                      }
                    }}
                  >
                    {p.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-destructive px-3 py-1.5 text-destructive"
                    onClick={async () => {
                      if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
                      setError("");
                      try {
                        await remove({ data: { slug: p.slug } });
                        await qc.invalidateQueries({ queryKey: ["admin", "posts"] });
                      } catch {
                        setError("Unable to delete that blog right now.");
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}