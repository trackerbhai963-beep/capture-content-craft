import type { BlogPost } from "./blog-types";

const FENCE = "---";

/** Serialize a post to a markdown file with JSON frontmatter. */
export function stringifyPost(post: BlogPost): string {
  const { content, ...meta } = post;
  return `${FENCE}\n${JSON.stringify(meta, null, 2)}\n${FENCE}\n\n${content}\n`;
}

/** Parse a markdown file with JSON frontmatter back into a post. */
export function parsePost(raw: string, fallbackSlug: string): BlogPost | null {
  const trimmed = raw.replace(/^\uFEFF/, "").trimStart();
  if (!trimmed.startsWith(FENCE)) return null;
  const end = trimmed.indexOf(`\n${FENCE}`, FENCE.length);
  if (end === -1) return null;
  const head = trimmed.slice(FENCE.length, end);
  const body = trimmed.slice(end + FENCE.length + 1).replace(/^\s*\n/, "");

  let meta: Record<string, unknown>;
  try {
    meta = JSON.parse(head) as Record<string, unknown>;
  } catch {
    return null;
  }

  const str = (key: string, def = "") => (typeof meta[key] === "string" ? (meta[key] as string) : def);

  return {
    title: str("title", fallbackSlug),
    slug: str("slug", fallbackSlug),
    category: str("category", "Other"),
    description: str("description"),
    coverImage: str("coverImage"),
    coverAlt: str("coverAlt", str("title")),
    author: str("author", "Himadri Creation"),
    publishedAt: str("publishedAt"),
    updatedAt: str("updatedAt"),
    status: str("status") === "published" ? "published" : "draft",
    metaTitle: str("metaTitle", str("title")),
    metaDescription: str("metaDescription", str("description")),
    keywords: str("keywords"),
    canonicalUrl: str("canonicalUrl"),
    ogTitle: str("ogTitle", str("title")),
    ogDescription: str("ogDescription", str("description")),
    ogImage: str("ogImage", str("coverImage")),
    images: Array.isArray(meta["images"])
      ? (meta["images"] as BlogPost["images"]).filter((i) => i && typeof i.src === "string")
      : [],
    content: body,
  };
}