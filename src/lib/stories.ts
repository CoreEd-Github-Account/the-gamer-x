import fs from "fs/promises";
import path from "path";
import { Story } from "../types";
import { LATEST_STORIES } from "../data/landingData";
import { slugify } from "./hero";

const STORIES_FILE_PATH = path.join(process.cwd(), "src", "data", "stories.json");

/**
 * Retrieves all stories from disk or fallback data.
 */
export async function getStories(): Promise<Story[]> {
  try {
    const raw = await fs.readFile(STORIES_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((story) => {
        const slug = story.slug || story.id || slugify(story.title);
        return {
          ...story,
          slug,
          href: `/stories/${slug}`,
        };
      });
    }
  } catch {
    // If file doesn't exist yet, attempt to initialize from fallback data
  }

  return LATEST_STORIES.map((story) => {
    const slug = story.slug || story.id || slugify(story.title);
    return {
      ...story,
      slug,
      href: `/stories/${slug}`,
    };
  });
}

/**
 * Saves stories to JSON storage, preserving hero carousel configuration.
 */
export async function saveStories(stories: Story[]): Promise<Story[]> {
  if (!Array.isArray(stories) || stories.length === 0) {
    throw new Error("Stories must be a non-empty array");
  }

  // Ensure exactly one main story exists (default to the first if none marked)
  const hasMain = stories.some((s) => s.isMain);

  // Track hero index for heroNumber fallback
  let heroCounter = 1;

  const formatted: Story[] = stories.map((story, index) => {
    const slug = story.slug || slugify(story.title) || `story-${index + 1}`;
    const isMain = hasMain ? Boolean(story.isMain) : index === 0;
    const isHero = Boolean(story.isHero);

    const heroNumber = isHero
      ? story.heroNumber || String(heroCounter++).padStart(2, "0")
      : undefined;

    return {
      id: story.id || slug,
      slug,
      title: story.title || "Untitled Story",
      category: story.category || "News",
      date: story.date || "May 2026",
      readTime: story.readTime || "3 min read",
      imageUrl: story.imageUrl || "/images/stories/witcher-4.jpg",
      description: story.description || "",
      isMain,
      isHero,
      heroNumber,
      heroBadge: isHero ? (story.heroBadge || "FEATURED STORY") : undefined,
      heroCtaText: isHero ? (story.heroCtaText || "READ FULL STORY") : undefined,
      heroImageUrl: isHero ? (story.heroImageUrl || story.imageUrl || "/images/hero/gta6-trailer.jpg") : undefined,
      heroDescription: isHero ? (story.heroDescription || story.description || "") : undefined,
      href: `/stories/${slug}`,
      content: story.content || `## ${story.title}\n\nWrite your complete article in markdown here.`,
    };
  });

  await fs.writeFile(STORIES_FILE_PATH, JSON.stringify(formatted, null, 2), "utf-8");
  return formatted;
}

/**
 * Finds a single story by its slug or id.
 */
export async function getStoryBySlug(slug: string): Promise<Story | null> {
  const stories = await getStories();
  const normalized = slug.toLowerCase().trim();

  const found = stories.find(
    (s) =>
      (s.slug && s.slug.toLowerCase() === normalized) ||
      (s.id && s.id.toLowerCase() === normalized) ||
      s.href?.endsWith(`/${normalized}`)
  );

  return found || null;
}

/**
 * Returns all story slugs.
 */
export async function getAllStorySlugs(): Promise<string[]> {
  const stories = await getStories();
  return stories.map((s) => s.slug || s.id).filter((slug): slug is string => Boolean(slug));
}
