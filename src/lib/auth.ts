import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "gamerx_admin_session";

function getSecretKey(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    "fallback_secret_key_gamerx_32chars_minimum_length_2026"
  );
}

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "admin123",
  };
}

/**
 * Creates an HMAC signature for a payload string.
 */
function signPayload(payload: string): string {
  const hmac = crypto.createHmac("sha256", getSecretKey());
  hmac.update(payload);
  return hmac.digest("hex");
}

/**
 * Creates a signed admin token with timestamp.
 */
export function createAdminToken(username: string): string {
  const timestamp = Date.now();
  const payload = Buffer.from(JSON.stringify({ username, timestamp })).toString("base64url");
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

/**
 * Verifies a token and returns the parsed payload if valid.
 */
export function verifyAdminToken(token?: string | null): { username: string; timestamp: number } | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payload, signature] = parts;
  const expectedSig = signPayload(payload);

  if (signature !== expectedSig) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    // Expire token after 7 days
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - decoded.timestamp > maxAge) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Checks if the request is from an authenticated admin via Request headers/cookies.
 */
export function isAuthenticatedRequest(req: NextRequest): boolean {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return Boolean(verifyAdminToken(token));
}

/**
 * Checks if the current Next.js server context is authenticated.
 */
export async function isAuthenticatedServer(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    return Boolean(verifyAdminToken(token));
  } catch {
    return false;
  }
}

