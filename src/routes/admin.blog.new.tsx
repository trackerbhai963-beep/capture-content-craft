import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { BlogEditor } from "@/components/admin/BlogEditor";

export const Route = createFileRoute("/admin/blog/new")({
  head: () => ({
    meta: [
      { title: "Create Blog | Himadri Creation Admin" },
      { name: "description", content: "Write a new photography blog for Himadri Creation." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AdminShell title="Create blog" description="Write and publish a new photography story">
      <BlogEditor />
    </AdminShell>
  ),
});