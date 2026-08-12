import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminListMedia, adminDeleteMedia } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/media")({
  head: () => ({
    meta: [
      { title: "Media Library | Himadri Creation Admin" },
      { name: "description", content: "Browse and manage blog photography uploads." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MediaPage,
});

function MediaPage() {
  const qc = useQueryClient();
  const list = useServerFn(adminListMedia);
  const remove = useServerFn(adminDeleteMedia);
  const [error, setError] = useState("");
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin", "media"],
    queryFn: () => list(),
  });

  return (
    <AdminShell title="Media library" description="Every photo used across your blog">
      {error && <p className="mb-3 text-sm text-destructive">{error}</p>}
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading your photos…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No photos yet. Upload cover photos from the blog editor.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((m) => (
            <li key={m.path} className="overflow-hidden rounded-2xl border border-border bg-card">
              <img src={m.url} alt={m.path} className="aspect-square w-full object-cover" />
              <div className="space-y-2 p-3 text-xs">
                <p className="truncate text-muted-foreground">{m.url}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-border px-2 py-1"
                    onClick={() => void navigator.clipboard?.writeText(m.url)}
                  >
                    Copy link
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-destructive px-2 py-1 text-destructive"
                    onClick={async () => {
                      if (!window.confirm("Delete this photo?")) return;
                      setError("");
                      try {
                        await remove({ data: { path: m.path } });
                        await qc.invalidateQueries({ queryKey: ["admin", "media"] });
                      } catch {
                        setError("Unable to delete that photo right now.");
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}