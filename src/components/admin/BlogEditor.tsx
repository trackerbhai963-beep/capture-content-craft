import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { RichTextEditor } from "./RichTextEditor";
import { adminSavePost, adminUploadImage } from "@/lib/admin.functions";
import { BLOG_CATEGORIES, isValidSlug, slugify, type BlogPost, type BlogStatus } from "@/lib/blog-types";
import { prepareImage, UPLOAD_ERRORS } from "@/lib/image-client";

const EMPTY: BlogPost = {
  title: "",
  slug: "",
  category: "Wedding Photography",
  description: "",
  coverImage: "",
  coverAlt: "",
  author: "Himadri Creation",
  publishedAt: "",
  updatedAt: "",
  status: "draft",
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  canonicalUrl: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  images: [],
  content: "",
};

const SAVE_ERRORS: Record<string, string> = {
  EMPTY_TITLE: "Please add a blog title.",
  EMPTY_CONTENT: "Please write the article content.",
  INVALID_SLUG: "The URL slug is invalid. Use lowercase words separated by dashes.",
  DUPLICATE_SLUG: "Another blog already uses this URL slug. Please change it.",
  INVALID_CATEGORY: "Please choose a category.",
  GITHUB_NOT_CONFIGURED: "Content storage is not configured yet. Check Settings.",
};

const field =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary";

export function BlogEditor({ initial }: { initial?: BlogPost }) {
  const navigate = useNavigate();
  const save = useServerFn(adminSavePost);
  const upload = useServerFn(adminUploadImage);

  const [post, setPost] = useState<BlogPost>(initial ?? EMPTY);
  const [slugLocked, setSlugLocked] = useState(Boolean(initial));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<null | BlogStatus>(null);
  const originalSlug = initial?.slug ?? "";

  const effectiveSlug = useMemo(
    () => (slugLocked ? post.slug : slugify(post.title)),
    [slugLocked, post.slug, post.title],
  );

  function set<K extends keyof BlogPost>(key: K, value: BlogPost[K]) {
    setPost((p) => ({ ...p, [key]: value }));
  }

  async function uploadFor(file: File, kind: "cover" | "article") {
    setError("");
    if (!isValidSlug(effectiveSlug)) {
      setError("Add a blog title first so photos can be stored in the right folder.");
      return null;
    }
    try {
      const prepared = await prepareImage(file, {
        maxWidth: kind === "cover" ? 1920 : 1600,
        nameHint: kind === "cover" ? "cover" : file.name,
      });
      const res = await upload({
        data: {
          slug: effectiveSlug,
          filename: prepared.filename,
          contentType: prepared.contentType,
          base64: prepared.base64,
        },
      });
      return res.url;
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      setError(UPLOAD_ERRORS[code] ?? "Unable to upload that photo right now. Please try again.");
      return null;
    }
  }

  async function submit(status: BlogStatus) {
    setBusy(status);
    setError("");
    setMessage(status === "published" ? "Publishing…" : "Saving draft…");
    try {
      const res = await save({
        data: {
          status,
          post: {
            ...post,
            slug: effectiveSlug,
            originalSlug,
          },
        },
      });
      setMessage(status === "published" ? "✓ Blog published successfully" : "✓ Draft saved");
      if (res.slug !== originalSlug) {
        void navigate({ to: "/admin/blog/$slug", params: { slug: res.slug } });
      }
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      setMessage("");
      setError(
        SAVE_ERRORS[code] ??
          (status === "published"
            ? "Unable to publish the blog right now. Please try again."
            : "Unable to save the draft right now. Please try again."),
      );
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-6">
        <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Blog title</span>
            <input
              className={field}
              value={post.title}
              placeholder="How to Choose the Perfect Wedding Photographer"
              onChange={(e) => set("title", e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">URL slug</span>
            <input
              className={field}
              value={effectiveSlug}
              onChange={(e) => {
                setSlugLocked(true);
                set("slug", slugify(e.target.value));
              }}
            />
            <span className="mt-1 block text-xs text-muted-foreground">/blog/{effectiveSlug}</span>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Category</span>
            <select
              className={field}
              value={post.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {BLOG_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Short description</span>
            <textarea
              className={`${field} min-h-24`}
              value={post.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </label>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-3 text-sm font-semibold">Article content</p>
          <RichTextEditor value={post.content} onChange={(html) => set("content", html)} />
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <label className="cursor-pointer rounded-xl border border-primary px-4 py-2 font-medium text-primary">
              Add photo to article
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  const url = await uploadFor(file, "article");
                  if (!url) return;
                  const caption = window.prompt("Photo caption (optional)") ?? "";
                  const alt = window.prompt("Alt text for SEO (optional)") ?? post.title;
                  set("images", [...post.images, { src: url, alt, caption }]);
                  set(
                    "content",
                    `${post.content}<figure><img src="${url}" alt="${alt}" loading="lazy" />${
                      caption ? `<figcaption>${caption}</figcaption>` : ""
                    }</figure>`,
                  );
                }}
              />
            </label>
            <span className="text-xs text-muted-foreground">
              Photos are optimised to WebP before upload.
            </span>
          </div>

          {post.images.length > 0 && (
            <ul className="mt-5 space-y-3">
              {post.images.map((img, index) => (
                <li
                  key={img.src}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-border p-3"
                >
                  <img src={img.src} alt={img.alt} className="h-16 w-24 rounded-lg object-cover" />
                  <div className="min-w-40 flex-1 space-y-2">
                    <input
                      className={field}
                      value={img.caption}
                      placeholder="Caption"
                      onChange={(e) => {
                        const next = [...post.images];
                        next[index] = { ...img, caption: e.target.value };
                        set("images", next);
                      }}
                    />
                    <input
                      className={field}
                      value={img.alt}
                      placeholder="Alt text"
                      onChange={(e) => {
                        const next = [...post.images];
                        next[index] = { ...img, alt: e.target.value };
                        set("images", next);
                      }}
                    />
                  </div>
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      className="rounded-lg border border-border px-2 py-1"
                      onClick={() => {
                        if (index === 0) return;
                        const next = [...post.images];
                        const prev = next[index - 1]!;
                        next[index - 1] = img;
                        next[index] = prev;
                        set("images", next);
                      }}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-border px-2 py-1"
                      onClick={() =>
                        set(
                          "images",
                          post.images.filter((_, i) => i !== index),
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <p className="text-sm font-semibold">SEO settings</p>
          {(
            [
              ["metaTitle", "SEO title"],
              ["metaDescription", "Meta description"],
              ["keywords", "Focus keywords (comma separated)"],
              ["canonicalUrl", "Canonical URL"],
              ["ogTitle", "Open Graph title"],
              ["ogDescription", "Open Graph description"],
              ["ogImage", "Open Graph image path"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block text-sm">
              <span className="mb-1 block font-medium">{label}</span>
              <input
                className={field}
                value={post[key]}
                placeholder="Auto-generated from the title and description"
                onChange={(e) => set(key, e.target.value)}
              />
            </label>
          ))}
        </section>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <section className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm font-semibold">Cover photo</p>
          <div className="mt-3 aspect-[4/3] overflow-hidden rounded-xl bg-secondary">
            {post.coverImage ? (
              <img src={post.coverImage} alt={post.coverAlt} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full place-items-center text-xs text-muted-foreground">
                No cover photo yet
              </div>
            )}
          </div>
          <label className="mt-3 block cursor-pointer rounded-xl border border-primary px-4 py-2 text-center text-sm font-medium text-primary">
            Upload cover photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                const url = await uploadFor(file, "cover");
                if (url) {
                  set("coverImage", url);
                  if (!post.ogImage) set("ogImage", url);
                }
              }}
            />
          </label>
          <label className="mt-3 block text-sm">
            <span className="mb-1 block font-medium">Cover alt text</span>
            <input
              className={field}
              value={post.coverAlt}
              onChange={(e) => set("coverAlt", e.target.value)}
            />
          </label>
        </section>

        <section className="space-y-3 rounded-2xl border border-border bg-card p-5">
          <p className="text-sm font-semibold">
            Status: <span className="text-primary uppercase">{post.status}</span>
          </p>
          {message && <p className="text-sm text-primary">{message}</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => submit("published")}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold tracking-wide text-primary-foreground uppercase disabled:opacity-60"
          >
            {busy === "published" ? "Publishing…" : "Publish blog"}
          </button>
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => submit("draft")}
            className="w-full rounded-xl border border-primary py-3 text-sm font-semibold tracking-wide text-primary uppercase disabled:opacity-60"
          >
            {busy === "draft" ? "Saving…" : "Save draft"}
          </button>
          {initial?.status === "published" && (
            <a
              href={`/blog/${effectiveSlug}`}
              target="_blank"
              rel="noreferrer"
              className="block text-center text-sm text-primary underline"
            >
              Preview live article
            </a>
          )}
        </section>
      </aside>
    </div>
  );
}