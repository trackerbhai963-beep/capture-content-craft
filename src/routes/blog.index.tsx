import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { SiteChrome, BrandCTA } from "@/components/SiteChrome";
import { BlogCard } from "@/components/BlogCard";
import { listPublishedPosts } from "@/lib/blog.functions";
import { BLOG_CATEGORIES } from "@/lib/blog-types";

const title = "Photography Blog | Himadri Creation";
const description =
  "Wedding photography guides, pre-wedding shoot ideas, event stories and photography tips from the Himadri Creation studio in Bankura.";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
  }),
  component: BlogIndex,
});

const PAGE_SIZE = 9;

function BlogIndex() {
  const fetchPosts = useServerFn(listPublishedPosts);
  const { data, isLoading } = useQuery({ queryKey: ["blog", "published"], queryFn: () => fetchPosts() });
  const [category, setCategory] = useState("All");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const posts = useMemo(() => {
    const all = data ?? [];
    return category === "All" ? all : all.filter((p) => p.category === category);
  }, [data, category]);

  const categories = useMemo(
    () => ["All", ...BLOG_CATEGORIES.filter((c) => (data ?? []).some((p) => p.category === c))],
    [data],
  );

  return (
    <SiteChrome>
      <main className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <p className="text-xs font-semibold tracking-[0.3em] text-accent uppercase">
          Himadri Creation Journal
        </p>
        <h1 className="font-display mt-3 text-4xl text-primary-dark sm:text-5xl">
          Stories, guides and photography inspiration
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">{description}</p>

        {categories.length > 1 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCategory(c);
                  setVisible(PAGE_SIZE);
                }}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  category === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground/75 hover:border-primary/50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-3xl bg-secondary" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-border bg-card p-12 text-center">
            <p className="font-display text-2xl text-primary-dark">No articles published yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              New photography stories and guides are on the way. Check back soon.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.slice(0, visible).map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
            {visible < posts.length && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="rounded-full border border-primary px-8 py-3 text-sm font-semibold tracking-wide text-primary uppercase transition hover:bg-primary hover:text-primary-foreground"
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}

        <BrandCTA />
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Looking for our work instead?{" "}
          <Link to="/" className="text-primary underline">
            Visit the gallery
          </Link>
        </p>
      </main>
    </SiteChrome>
  );
}