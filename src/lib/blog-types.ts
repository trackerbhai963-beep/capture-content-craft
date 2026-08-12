export const BLOG_CATEGORIES = [
  "Wedding Photography",
  "Pre-Wedding",
  "Event Photography",
  "Photography Tips",
  "Wedding Ideas",
  "Client Stories",
  "Behind the Scenes",
  "Himadri Creation Updates",
  "Other",
] as const;

export type BlogStatus = "draft" | "published";

export type BlogImage = {
  src: string;
  alt: string;
  caption: string;
};

export type BlogMeta = {
  title: string;
  slug: string;
  category: string;
  description: string;
  coverImage: string;
  coverAlt: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  status: BlogStatus;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  images: BlogImage[];
};

export type BlogPost = BlogMeta & { content: string };

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 90);
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 3 && slug.length <= 90;
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function excerpt(text: string, max = 160): string {
  const clean = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

export function relatedPosts(all: BlogPost[], current: BlogPost, limit = 3): BlogPost[] {
  const others = all.filter((p) => p.slug !== current.slug && p.status === "published");
  const keywords = current.keywords
    .split(",")
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);

  const scored = others.map((p) => {
    let score = 0;
    if (p.category === current.category) score += 5;
    const haystack = `${p.title} ${p.description} ${p.keywords}`.toLowerCase();
    for (const k of keywords) if (k.length > 2 && haystack.includes(k)) score += 2;
    return { p, score, time: new Date(p.publishedAt || p.updatedAt).getTime() || 0 };
  });

  scored.sort((a, b) => b.score - a.score || b.time - a.time);
  return scored.slice(0, limit).map((s) => s.p);
}