/**
 * Server-only GitHub content storage layer.
 * The token never leaves this module's runtime; it is read inside functions,
 * never at module scope, and never returned to the client.
 */

type GhConfig = {
  token: string;
  owner: string;
  repo: string;
  branch: string;
};

export function ghConfig(): GhConfig {
  const token = process.env["GITHUB_TOKEN"];
  const owner = process.env["GITHUB_OWNER"];
  const repo = process.env["GITHUB_REPO"];
  const branch = process.env["GITHUB_BRANCH"] || "main";
  if (!token || !owner || !repo) {
    throw new Error("GITHUB_NOT_CONFIGURED");
  }
  return { token, owner, repo, branch };
}

export function isGithubConfigured(): boolean {
  return Boolean(
    process.env["GITHUB_TOKEN"] && process.env["GITHUB_OWNER"] && process.env["GITHUB_REPO"],
  );
}

async function gh(path: string, init: RequestInit = {}): Promise<Response> {
  const cfg = ghConfig();
  return fetch(`https://api.github.com/repos/${cfg.owner}/${cfg.repo}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${cfg.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "himadri-creation-cms",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers as Record<string, string> | undefined),
    },
  });
}

export function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

export function decodeBase64(b64: string): string {
  const bin = atob(b64.replace(/\s/g, ""));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export type GhEntry = { name: string; path: string; sha: string; size: number; type: string };

export async function listDir(dir: string): Promise<GhEntry[]> {
  const cfg = ghConfig();
  const res = await gh(`/contents/${encodeURI(dir)}?ref=${encodeURIComponent(cfg.branch)}`);
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`GH_LIST_FAILED_${res.status}`);
  const json = (await res.json()) as GhEntry[] | GhEntry;
  return Array.isArray(json) ? json : [json];
}

export async function getFile(path: string): Promise<{ text: string; sha: string } | null> {
  const cfg = ghConfig();
  const res = await gh(`/contents/${encodeURI(path)}?ref=${encodeURIComponent(cfg.branch)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GH_GET_FAILED_${res.status}`);
  const json = (await res.json()) as { content?: string; sha: string; encoding?: string };
  return { text: json.content ? decodeBase64(json.content) : "", sha: json.sha };
}

export async function putFile(args: {
  path: string;
  /** base64 payload (already encoded) */
  contentBase64: string;
  message: string;
  sha?: string | undefined;
}): Promise<void> {
  const cfg = ghConfig();
  const res = await gh(`/contents/${encodeURI(args.path)}`, {
    method: "PUT",
    body: JSON.stringify({
      message: args.message,
      content: args.contentBase64,
      branch: cfg.branch,
      ...(args.sha ? { sha: args.sha } : {}),
    }),
  });
  if (!res.ok) throw new Error(`GH_PUT_FAILED_${res.status}`);
}

export async function deleteFile(args: { path: string; message: string }): Promise<void> {
  const cfg = ghConfig();
  const existing = await gh(
    `/contents/${encodeURI(args.path)}?ref=${encodeURIComponent(cfg.branch)}`,
  );
  if (existing.status === 404) return;
  if (!existing.ok) throw new Error(`GH_GET_FAILED_${existing.status}`);
  const meta = (await existing.json()) as { sha: string };
  const res = await gh(`/contents/${encodeURI(args.path)}`, {
    method: "DELETE",
    body: JSON.stringify({ message: args.message, sha: meta.sha, branch: cfg.branch }),
  });
  if (!res.ok) throw new Error(`GH_DELETE_FAILED_${res.status}`);
}

export async function fileExists(path: string): Promise<boolean> {
  const cfg = ghConfig();
  const res = await gh(`/contents/${encodeURI(path)}?ref=${encodeURIComponent(cfg.branch)}`, {
    method: "GET",
  });
  return res.ok;
}