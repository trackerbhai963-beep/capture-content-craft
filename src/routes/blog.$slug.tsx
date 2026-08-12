import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteChrome, BrandCTA } from "@/components/SiteChrome";
import { BlogCard } from "@/components/BlogCard";
import { getPublishedPost } from "@/lib/blog.functions";
import { formatDate } from "@/lib/blog-types";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const readable = params.slug.replace(/-/g, " ");
    const title = `${readable} | Himadri Creation Blog`;
    const description = `Photography story from Himadri Creation: ${readable}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const fetchPost = useServerFn(getPublishedPost);
  const { data, isLoading } = useQuery({
    queryKey: ["blog", "post", slug],
    queryFn: () => fetchPost({ data: { slug } }),
  });

  if (isLoading) {
    return (
      <SiteChrome>
        <main className="mx-auto max-w-3xl px-4 py-20">
          <div className="h-8 w-2/3 animate-pulse rounded bg-secondary" />
          <div className="mt-6 h-72 animate-pulse rounded-3xl bg-secondary" />
        </main>
      </SiteChrome>
    );
  }

  if (!data) {
    return (
      <SiteChrome>
        <main className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="font-display text-3xl text-primary-dark">Article not found</h1>
          <p className="mt-3 text-muted-foreground">
            This story may have been moved or is not published yet.
          </p>
          <Link to="/blog" className="mt-6 inline-block text-primary underline">
            Back to the blog
          </Link>
        </main>
      </SiteChrome>
    );
  }

  const { post, related } = data;

  return (
    <SiteChrome>
      <article className="mx-auto max-w-3xl px-4 pt-12 sm:px-6">
        <p className="text-[0.7rem] font-semibold tracking-[0.28em] text-accent uppercase">
          {post.category}
        </p>
        <h1 className="font-display mt-3 text-3xl leading-tight text-primary-dark sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          By {post.author} · Published on {formatDate(post.publishedAt || post.updatedAt)}
        </p>
        {post.description && <p className="mt-5 text-lg text-foreground/80">{post.description}</p>}

        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.coverAlt || post.title}
            width={1600}
            height={1000}
            decoding="async"
            className="mt-8 w-full rounded-3xl object-cover shadow-lift"
          />
        )}

        <div
          className="prose-hc mt-10 text-foreground/90"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <div className="px-4 sm:px-6">
        <BrandCTA />
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-2xl text-primary-dark">Related Articles</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </SiteChrome>
  );
}