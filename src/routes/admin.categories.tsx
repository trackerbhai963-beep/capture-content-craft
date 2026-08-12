import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminListPosts } from "@/lib/admin.functions";
import { BLOG_CATEGORIES } from "@/lib/blog-types";

export const Route = createFileRoute("/admin/categories")({
  head: () => ({
    meta: [
      { title: "Categories | Himadri Creation Admin" },
      { name: "description", content: "Photography blog categories and post counts." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const list = useServerFn(adminListPosts);
  const { data: posts = [] } = useQuery({ queryKey: ["admin", "posts"], queryFn: () => list() });

  return (
    <AdminShell title="Categories" description="Fixed photography categories used across the blog">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BLOG_CATEGORIES.map((c) => (
          <li key={c} className="rounded-2xl border border-border bg-card p-5">
            <p className="font-display text-lg text-primary-dark">{c}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {posts.filter((p) => p.category === c).length} blog(s)
            </p>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}