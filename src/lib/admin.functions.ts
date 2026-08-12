import { createServerFn } from "@tanstack/react-start";
import { isValidSlug, BLOG_CATEGORIES, type BlogPost, type BlogStatus } from "./blog-types";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/webp", "image/avif", "image/jpeg", "image/png"];

export type AdminPostInput = Omit<BlogPost, "publishedAt" | "updatedAt" | "author"> & {
  author?: string;
  originalSlug?: string;
};

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { username: string; password: string }) => {
    if (typeof data?.username !== "string" || typeof data?.password !== "string") {
      throw new Error("INVALID_INPUT");
    }
    return { username: data.username.trim().slice(0, 120), password: data.password.slice(0, 200) };
  })
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    const { credentialsValid, adminSession } = await import("./session.server");
    if (!credentialsValid(data.username, data.password)) return { ok: false };
    const session = await adminSession();
    await session.update({ admin: true, username: data.username, at: Date.now() });
    return { ok: true };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { adminSession } = await import("./session.server");
  const session = await adminSession();
  await session.clear();
  return { ok: true as const };
});

export const adminMe = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ authenticated: boolean; username: string; storageReady: boolean }> => {
    const { adminSession } = await import("./session.server");
    const { isGithubConfigured } = await import("./github.server");
    let session: Awaited<ReturnType<typeof adminSession>> | null = null;
    try {
      session = await adminSession();
    } catch {
      return { authenticated: false, username: "", storageReady: false };
    }
    const data = session.data;
    return {
      authenticated: Boolean(data.admin),
      username: data.username ?? "",
      storageReady: isGithubConfigured(),
    };
  },
);

export const adminListPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<BlogPost[]> => {
    const { requireAdmin } = await import("./session.server");
    await requireAdmin();
    const { readAllPosts } = await import("./blog-store.server");
    const posts = await readAllPosts();
    return posts.sort(
      (a, b) =>
        (new Date(b.updatedAt || b.publishedAt).getTime() || 0) -
        (new Date(a.updatedAt || a.publishedAt).getTime() || 0),
    );
  },
);

export const adminGetPost = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => {
    if (!isValidSlug(data?.slug ?? "")) throw new Error("INVALID_SLUG");
    return data;
  })
  .handler(async ({ data }): Promise<BlogPost | null> => {
    const { requireAdmin } = await import("./session.server");
    await requireAdmin();
    const { readPost } = await import("./blog-store.server");
    const found = await readPost(data.slug);
    return found ? found.post : null;
  });

export const adminSavePost = createServerFn({ method: "POST" })
  .inputValidator((data: { post: AdminPostInput; status: BlogStatus }) => {
    const post = data?.post;
    if (!post) throw new Error("INVALID_INPUT");
    if (!post.title?.trim()) throw new Error("EMPTY_TITLE");
    if (!post.content?.trim()) throw new Error("EMPTY_CONTENT");
    if (!isValidSlug(post.slug ?? "")) throw new Error("INVALID_SLUG");
    if (!BLOG_CATEGORIES.includes(post.category as (typeof BLOG_CATEGORIES)[number])) {
      throw new Error("INVALID_CATEGORY");
    }
    if (data.status !== "draft" && data.status !== "published") throw new Error("INVALID_STATUS");
    return data;
  })
  .handler(async ({ data }): Promise<{ ok: true; slug: string }> => {
    const { requireAdmin } = await import("./session.server");
    await requireAdmin();
    const { readPost, writePost, removePost } = await import("./blog-store.server");

    const input = data.post;
    const originalSlug = input.originalSlug && isValidSlug(input.originalSlug) ? input.originalSlug : "";
    const existingAtTarget = await readPost(input.slug);
    if (existingAtTarget && originalSlug !== input.slug) throw new Error("DUPLICATE_SLUG");

    const previous = originalSlug ? await readPost(originalSlug) : null;
    const now = new Date().toISOString();
    const publishedAt =
      data.status === "published"
        ? previous?.post.publishedAt || existingAtTarget?.post.publishedAt || now
        : previous?.post.publishedAt || "";

    const post: BlogPost = {
      title: input.title.trim(),
      slug: input.slug,
      category: input.category,
      description: input.description?.trim() ?? "",
      coverImage: input.coverImage ?? "",
      coverAlt: input.coverAlt?.trim() || input.title.trim(),
      author: input.author?.trim() || "Himadri Creation",
      publishedAt,
      updatedAt: now,
      status: data.status,
      metaTitle: input.metaTitle?.trim() || `${input.title.trim()} | Himadri Creation`,
      metaDescription: input.metaDescription?.trim() || input.description?.trim() || "",
      keywords: input.keywords?.trim() ?? "",
      canonicalUrl: input.canonicalUrl?.trim() ?? "",
      ogTitle: input.ogTitle?.trim() || input.title.trim(),
      ogDescription: input.ogDescription?.trim() || input.description?.trim() || "",
      ogImage: input.ogImage?.trim() || input.coverImage || "",
      images: Array.isArray(input.images) ? input.images.slice(0, 60) : [],
      content: input.content,
    };

    const targetSha = originalSlug === input.slug ? previous?.sha : existingAtTarget?.sha;
    await writePost(post, targetSha);
    if (originalSlug && originalSlug !== input.slug) await removePost(originalSlug);
    return { ok: true, slug: post.slug };
  });

export const adminSetStatus = createServerFn({ method: "POST" })
  .inputValidator((data: { slug: string; status: BlogStatus }) => {
    if (!isValidSlug(data?.slug ?? "")) throw new Error("INVALID_SLUG");
    if (data.status !== "draft" && data.status !== "published") throw new Error("INVALID_STATUS");
    return data;
  })
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { requireAdmin } = await import("./session.server");
    await requireAdmin();
    const { readPost, writePost } = await import("./blog-store.server");
    const found = await readPost(data.slug);
    if (!found) throw new Error("NOT_FOUND");
    const now = new Date().toISOString();
    await writePost(
      {
        ...found.post,
        status: data.status,
        publishedAt: data.status === "published" ? found.post.publishedAt || now : found.post.publishedAt,
        updatedAt: now,
      },
      found.sha,
    );
    return { ok: true };
  });

export const adminDeletePost = createServerFn({ method: "POST" })
  .inputValidator((data: { slug: string }) => {
    if (!isValidSlug(data?.slug ?? "")) throw new Error("INVALID_SLUG");
    return data;
  })
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { requireAdmin } = await import("./session.server");
    await requireAdmin();
    const { removePost } = await import("./blog-store.server");
    await removePost(data.slug);
    return { ok: true };
  });

export const adminUploadImage = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { slug: string; filename: string; contentType: string; base64: string }) => {
      if (!isValidSlug(data?.slug ?? "")) throw new Error("INVALID_SLUG");
      if (!ALLOWED_IMAGE_TYPES.includes(data.contentType)) throw new Error("INVALID_IMAGE_TYPE");
      if (!/^[a-z0-9][a-z0-9-]*\.(webp|avif|jpg|jpeg|png)$/.test(data.filename)) {
        throw new Error("INVALID_FILENAME");
      }
      const approxBytes = Math.floor((data.base64?.length ?? 0) * 0.75);
      if (!approxBytes) throw new Error("EMPTY_IMAGE");
      if (approxBytes > MAX_IMAGE_BYTES) throw new Error("IMAGE_TOO_LARGE");
      return data;
    },
  )
  .handler(async ({ data }): Promise<{ ok: true; url: string }> => {
    const { requireAdmin } = await import("./session.server");
    await requireAdmin();
    const { putFile, getFile } = await import("./github.server");
    const { MEDIA_DIR } = await import("./blog-store.server");
    const path = `${MEDIA_DIR}/${data.slug}/${data.filename}`;
    const existing = await getFile(path);
    await putFile({
      path,
      contentBase64: data.base64,
      message: `media: upload ${path}`,
      sha: existing?.sha,
    });
    return { ok: true, url: `/blog/${data.slug}/${data.filename}` };
  });

export const adminListMedia = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin } = await import("./session.server");
  await requireAdmin();
  const { listMedia } = await import("./blog-store.server");
  return listMedia();
});

export const adminDeleteMedia = createServerFn({ method: "POST" })
  .inputValidator((data: { path: string }) => {
    if (!/^public\/blog\/[a-z0-9-]+(\/[a-z0-9-]+)?\.(webp|avif|jpg|jpeg|png)$/.test(data?.path ?? "")) {
      throw new Error("INVALID_PATH");
    }
    return data;
  })
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { requireAdmin } = await import("./session.server");
    await requireAdmin();
    const { deleteFile } = await import("./github.server");
    await deleteFile({ path: data.path, message: `media: delete ${data.path}` });
    return { ok: true };
  });