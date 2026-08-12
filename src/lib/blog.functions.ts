import { createServerFn } from "@tanstack/react-start";
import type { BlogPost } from "./blog-types";

/** Public: all published posts, newest first. */
export const listPublishedPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<BlogPost[]> => {
    const { readAllPosts } = await import("./blog-store.server");
    const posts = await readAllPosts();
    return posts
      .filter((p) => p.status === "published")
      .sort(
        (a, b) =>
          (new Date(b.publishedAt || b.updatedAt).getTime() || 0) -
          (new Date(a.publishedAt || a.updatedAt).getTime() || 0),
      );
  },
);

/** Public: one published post plus related posts. */
export const getPublishedPost = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => {
    const { isValidSlug } = require("./blog-types") as typeof import("./blog-types");
    if (!isValidSlug(data.slug)) throw new Error("INVALID_SLUG");
    return data;
  })
  .handler(async ({ data }): Promise<{ post: BlogPost; related: BlogPost[] } | null> => {
    const { readAllPosts } = await import("./blog-store.server");
    const { relatedPosts } = await import("./blog-types");
    const posts = await readAllPosts();
    const post = posts.find((p) => p.slug === data.slug && p.status === "published");
    if (!post) return null;
    return { post, related: relatedPosts(posts, post, 3) };
  });