import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

export type AdminSession = { admin?: boolean; username?: string; at?: number };

const MAX_AGE = 60 * 60 * 8; // 8 hours

function sessionConfig() {
  const password = process.env["SESSION_SECRET"];
  if (!password || password.length < 32) throw new Error("SESSION_NOT_CONFIGURED");
  return {
    password,
    name: "hc-admin",
    maxAge: MAX_AGE,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

export function adminSession() {
  return useSession<AdminSession>(sessionConfig());
}

function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a, "utf8").digest();
  const hb = createHash("sha256").update(b, "utf8").digest();
  return timingSafeEqual(ha, hb);
}

export function credentialsValid(username: string, password: string): boolean {
  const expectedUser = process.env["ADMIN_USERNAME"];
  const expectedPass = process.env["ADMIN_PASSWORD"];
  if (!expectedUser || !expectedPass) return false;
  const okUser = safeEqual(username, expectedUser);
  const okPass = safeEqual(password, expectedPass);
  return okUser && okPass;
}

/** Throws UNAUTHORIZED when the caller has no valid admin session. */
export async function requireAdmin(): Promise<string> {
  const session = await adminSession();
  const data = session.data;
  const fresh = typeof data.at === "number" && Date.now() - data.at < MAX_AGE * 1000;
  if (!data.admin || !fresh) {
    throw new Error("UNAUTHORIZED");
  }
  return data.username ?? "admin";
}