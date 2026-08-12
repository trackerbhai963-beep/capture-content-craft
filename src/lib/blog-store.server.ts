import { listDir, getFile, putFile, deleteFile } from "./github.server";
import { parsePost, stringifyPost } from "./frontmatter";
import type { BlogPost } from "./blog-types";

export const BLOG_DIR = "content/blogs";
export const MEDIA_DIR = "public/blog";

export async function readAllPosts(): Promise<BlogPost[]> {
  const entries = await listDir(BLOG_DIR);
  const files = entries.filter((e) => e.type === "file" && e.name.endsWith(".md"));
  const posts = await Promise.all(
    files.map(async (f) => {
      const file = await getFile(f.path);
      if (!file) return null;
      return parsePost(file.text, f.name.replace(/\.md$/, ""));
    }),
  );
  return posts.filter((p): p is BlogPost => p !== null);
}

export async function readPost(slug: string): Promise<{ post: BlogPost; sha: string } | null> {
  const file = await getFile(`${BLOG_DIR}/${slug}.md`);
  if (!file) return null;
  const post = parsePost(file.text, slug);
  if (!post) return null;
  return { post, sha: file.sha };
}

export async function writePost(post: BlogPost, sha?: string): Promise<void> {
  const { encodeBase64 } = await import("./github.server");
  await putFile({
    path: `${BLOG_DIR}/${post.slug}.md`,
    contentBase64: encodeBase64(stringifyPost(post)),
    message: `content: ${sha ? "update" : "create"} blog "${post.title}"`,
    sha,
  });
}

export async function removePost(slug: string): Promise<void> {
  await deleteFile({ path: `${BLOG_DIR}/${slug}.md`, message: `content: delete blog ${slug}` });
}

export async function listMedia(): Promise<{ path: string; url: string; size: number }[]> {
  const top = await listDir(MEDIA_DIR);
  const out: { path: string; url: string; size: number }[] = [];
  for (const entry of top) {
    if (entry.type === "file") {
      out.push({ path: entry.path, url: entry.path.replace(/^public/, ""), size: entry.size });
    } else if (entry.type === "dir") {
      const inner = await listDir(entry.path);
      for (const f of inner) {
        if (f.type === "file") {
          out.push({ path: f.path, url: f.path.replace(/^public/, ""), size: f.size });
        }
      }
    }
  }
  return out.sort((a, b) => a.path.localeCompare(b.path));
}