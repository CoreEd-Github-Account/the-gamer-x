import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { GamerProfile } from "../types";

export const GAMER_COOKIE_NAME = "gamerx_user_session";
const USERS_FILE_PATH = path.join(process.cwd(), "src", "data", "forum-users.json");

function getSecretKey(): string {
  return (
    process.env.GAMER_SESSION_SECRET ||
    "gamerx_forum_session_secret_key_32chars_long_2026"
  );
}

export const INITIAL_GAMERS: (GamerProfile & { passwordHash: string })[] = [
  {
    id: "gamer-ubaid",
    username: "Ubaid_GX",
    displayName: "Ubaid GX",
    badge: "Staff",
    badgeColor: "#2563eb",
    steamId: "TheGamerX_Admin",
    psnId: "GX_Commander",
    karma: 4200,
    joinedAt: "Jan 2026",
    bio: "Lead Editor & Founder at TheGamerX. PC & PS5 player.",
    passwordHash: hashPassword("gaming2026"),
  },
  {
    id: "gamer-circuit",
    username: "CircuitBreaker",
    displayName: "Circuit Breaker",
    badge: "Hardware Guru",
    badgeColor: "#d97706",
    steamId: "CircuitOverload",
    karma: 3420,
    joinedAt: "Feb 2026",
    bio: "Hardware tester, undervolting nerd & custom loop enthusiast.",
    passwordHash: hashPassword("gaming2026"),
  },
  {
    id: "gamer-valkyrie",
    username: "ValkyrieRunner",
    displayName: "Valkyrie",
    badge: "Day 1 Gamer",
    badgeColor: "#7c3aed",
    steamId: "Valkyrie99",
    karma: 1820,
    joinedAt: "March 2026",
    bio: "Action RPG speedrunner & Soulsborne veteran.",
    passwordHash: hashPassword("gaming2026"),
  },
  {
    id: "gamer-tarnished",
    username: "TarnishedLore",
    displayName: "Tarnished Lore",
    badge: "Pro Reviewer",
    badgeColor: "#2563eb",
    steamId: "EldenTarnished",
    karma: 2150,
    joinedAt: "March 2026",
    bio: "Writing deep dives into game worldbuilding and combat choreography.",
    passwordHash: hashPassword("gaming2026"),
  },
];

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + getSecretKey()).digest("hex");
}

export async function getAllGamers(): Promise<(GamerProfile & { passwordHash: string })[]> {
  try {
    const raw = await fs.readFile(USERS_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // If file doesn't exist, initialize with initial users
  }

  try {
    await fs.mkdir(path.dirname(USERS_FILE_PATH), { recursive: true });
    await fs.writeFile(USERS_FILE_PATH, JSON.stringify(INITIAL_GAMERS, null, 2), "utf-8");
  } catch {
    // Ignore in-memory fallback
  }

  return INITIAL_GAMERS;
}

export async function saveAllGamers(gamers: (GamerProfile & { passwordHash: string })[]): Promise<void> {
  await fs.mkdir(path.dirname(USERS_FILE_PATH), { recursive: true });
  await fs.writeFile(USERS_FILE_PATH, JSON.stringify(gamers, null, 2), "utf-8");
}

export async function findGamerByUsername(username: string): Promise<(GamerProfile & { passwordHash: string }) | null> {
  const all = await getAllGamers();
  const match = all.find((g) => g.username.toLowerCase() === username.toLowerCase().trim());
  return match || null;
}

function stripPassword(gamer: GamerProfile & { passwordHash: string }): GamerProfile {
  return {
    id: gamer.id,
    username: gamer.username,
    displayName: gamer.displayName,
    badge: gamer.badge,
    badgeColor: gamer.badgeColor,
    steamId: gamer.steamId,
    psnId: gamer.psnId,
    xboxId: gamer.xboxId,
    karma: gamer.karma,
    joinedAt: gamer.joinedAt,
    bio: gamer.bio,
  };
}

export async function registerGamer(data: {
  username: string;
  password?: string;
  displayName?: string;
  steamId?: string;
  psnId?: string;
}): Promise<GamerProfile> {
  const cleanUsername = data.username.trim().replace(/[^a-zA-Z0-9_]/g, "");
  if (!cleanUsername || cleanUsername.length < 3) {
    throw new Error("Username must be at least 3 alphanumeric characters.");
  }

  const existing = await findGamerByUsername(cleanUsername);
  if (existing) {
    throw new Error(`Username @${cleanUsername} is already registered.`);
  }

  const all = await getAllGamers();
  const newProfile: GamerProfile & { passwordHash: string } = {
    id: `gamer-${Date.now()}`,
    username: cleanUsername,
    displayName: data.displayName?.trim() || cleanUsername,
    badge: "Community Member",
    badgeColor: "#2563eb",
    steamId: data.steamId?.trim() || undefined,
    psnId: data.psnId?.trim() || undefined,
    karma: 10,
    joinedAt: "Just now",
    passwordHash: hashPassword(data.password || "gaming2026"),
  };

  all.push(newProfile);
  await saveAllGamers(all);

  return stripPassword(newProfile);
}

export async function authenticateGamer(
  username: string,
  password?: string
): Promise<GamerProfile | null> {
  const gamer = await findGamerByUsername(username);
  if (!gamer) return null;

  if (password) {
    const hashed = hashPassword(password);
    if (hashed !== gamer.passwordHash) {
      return null;
    }
  }

  return stripPassword(gamer);
}

function signPayload(payload: string): string {
  const hmac = crypto.createHmac("sha256", getSecretKey());
  hmac.update(payload);
  return hmac.digest("hex");
}

export function createGamerToken(profile: GamerProfile): string {
  const timestamp = Date.now();
  const payload = Buffer.from(
    JSON.stringify({
      id: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      badge: profile.badge,
      badgeColor: profile.badgeColor,
      steamId: profile.steamId,
      psnId: profile.psnId,
      timestamp,
    })
  ).toString("base64url");

  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

export function verifyGamerToken(token?: string | null): GamerProfile | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payload, signature] = parts;
  if (signPayload(payload) !== signature) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    // Expire token after 30 days
    const maxAge = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - decoded.timestamp > maxAge) {
      return null;
    }

    return {
      id: decoded.id,
      username: decoded.username,
      displayName: decoded.displayName || decoded.username,
      badge: decoded.badge || "Community Member",
      badgeColor: decoded.badgeColor || "#2563eb",
      steamId: decoded.steamId,
      psnId: decoded.psnId,
      karma: 50,
      joinedAt: "Active Player",
    };
  } catch {
    return null;
  }
}

export async function getCurrentGamerSession(): Promise<GamerProfile | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(GAMER_COOKIE_NAME)?.value;
  return verifyGamerToken(token);
}

export function getGamerFromRequest(req: NextRequest): GamerProfile | null {
  const token = req.cookies.get(GAMER_COOKIE_NAME)?.value;
  return verifyGamerToken(token);
}

