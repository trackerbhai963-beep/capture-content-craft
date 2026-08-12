import { Link } from "@tanstack/react-router";
import { formatDate, type BlogPost } from "@/lib/blog-types";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
      <Link to="/blog/$slug" params={{ slug: post.slug }} className="block">
        <div className="aspect-[4/3] overflow-hidden bg-secondary">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.coverAlt || post.title}
              loading="lazy"
              decoding="async"
              width={800}
              height={600}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Himadri Creation
            </div>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[0.68rem] font-semibold tracking-[0.2em] text-accent uppercase">
          {post.category}
        </p>
        <h2 className="font-display mt-2 text-xl leading-snug text-primary-dark">
          <Link to="/blog/$slug" params={{ slug: post.slug }}>
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {post.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-6 text-xs text-muted-foreground">
          <span>{formatDate(post.publishedAt || post.updatedAt)}</span>
          <Link
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="font-semibold tracking-wide text-primary uppercase"
          >
            Read article →
          </Link>
        </div>
      </div>
    </article>
  );
}