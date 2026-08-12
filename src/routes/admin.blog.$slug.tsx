import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "@/components/admin/AdminShell";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { adminGetPost } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/blog/$slug")({
  head: () => ({
    meta: [
      { title: "Edit Blog | Himadri Creation Admin" },
      { name: "description", content: "Edit an existing Himadri Creation photography blog." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EditBlog,
});

function EditBlog() {
  const { slug } = Route.useParams();
  const get = useServerFn(adminGetPost);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "post", slug],
    queryFn: () => get({ data: { slug } }),
  });

  return (
    <AdminShell title="Edit blog" description={slug}>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading this blog…</p>
      ) : isError ? (
        <p className="text-sm text-destructive">Unable to load this blog right now.</p>
      ) : !data ? (
        <p className="text-sm text-muted-foreground">This blog no longer exists.</p>
      ) : (
        <BlogEditor initial={data} />
      )}
    </AdminShell>
  );
}