import fs from "fs/promises";
import path from "path";
import { marked } from "marked";
import { TrendingGame } from "../types";
import { TRENDING_GAMES } from "../data/landingData";
import { slugify } from "./hero";

const GAMES_FILE_PATH = path.join(process.cwd(), "src", "data", "trending-games.json");

/**
 * Generates default markdown for a game hub if none is provided.
 */
export function generateDefaultGameMarkdown(title: string, category?: string, description?: string): string {
  return `## ${title}: Game Hub & Overview

Welcome to the dedicated **${title}** hub on TheGamerX.

${description || "Stay locked into our comprehensive hub for the latest developer updates, gameplay breakdowns, platform benchmarks, and seasonal coverage."}

### Key Features & Overview

- **Genre & Style**: ${category || "Action / Adventure"}
- **Next-Gen Visual Fidelity**: Modern shaders, volumetric lighting, and high-framerate performance.
- **Deep Gameplay Systems**: Fluid combat mechanics, responsive controls, and rich world building.

> "Designed to push hardware boundaries and deliver an unforgettable interactive experience."

Stay tuned to **TheGamerX** for continuous coverage, guide releases, and community discussions.`;
}

/**
 * Retrieves all trending games from disk or fallback data.
 */
export async function getTrendingGames(): Promise<TrendingGame[]> {
  try {
    const raw = await fs.readFile(GAMES_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((game) => {
        const slug = game.slug || game.id || slugify(game.title);
        return {
          ...game,
          slug,
          href: `/games/${slug}`,
          content: game.content || generateDefaultGameMarkdown(game.title, game.category, game.description),
        };
      });
    }
  } catch {
    // If file doesn't exist yet, fallback to default seed data
  }

  return TRENDING_GAMES.map((game, index) => {
    const slug = game.slug || game.id || slugify(game.title);
    return {
      ...game,
      slug,
      isFeatured: index === 0,
      href: `/games/${slug}`,
      category: game.category || "Trending Game",
      content: game.content || generateDefaultGameMarkdown(game.title, game.category, game.description),
    };
  });
}

/**
 * Saves trending games to JSON storage.
 */
export async function saveTrendingGames(games: TrendingGame[]): Promise<TrendingGame[]> {
  if (!Array.isArray(games) || games.length === 0) {
    throw new Error("Games list must be a non-empty array");
  }

  const formatted: TrendingGame[] = games.map((game, index) => {
    const slug = game.slug || slugify(game.title) || `game-${index + 1}`;
    const isFeatured = Boolean(game.isFeatured);

    return {
      id: game.id || slug,
      slug,
      title: game.title || "Untitled Game",
      category: game.category || "Trending Game",
      imageUrl: game.imageUrl || "/images/games/gta-vi.jpg",
      isFeatured,
      description: game.description || "",
      href: `/games/${slug}`,
      content: game.content || generateDefaultGameMarkdown(game.title, game.category, game.description),
    };
  });

  await fs.writeFile(GAMES_FILE_PATH, JSON.stringify(formatted, null, 2), "utf-8");
  return formatted;
}

/**
 * Finds a single game by its slug or id.
 */
export async function getGameBySlug(slug: string): Promise<TrendingGame | null> {
  const games = await getTrendingGames();
  const normalized = slug.toLowerCase().trim();

  const found = games.find(
    (g) =>
      (g.slug && g.slug.toLowerCase() === normalized) ||
      (g.id && g.id.toLowerCase() === normalized) ||
      g.href?.endsWith(`/${normalized}`)
  );

  return found || null;
}

/**
 * Returns all game slugs for static generation.
 */
export async function getAllGameSlugs(): Promise<string[]> {
  const games = await getTrendingGames();
  return games.map((g) => g.slug || g.id).filter((slug): slug is string => Boolean(slug));
}

/**
 * Parses markdown into HTML string using marked.
 */
export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  if (!markdown) return "";
  const html = await marked.parse(markdown, { gfm: true, breaks: true });
  return html;
}

