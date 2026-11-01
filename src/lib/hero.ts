import { marked } from "marked";
import { HeroSlide } from "../types";
import { HERO_SLIDES } from "../data/landingData";
import { getStories, saveStories } from "./stories";

/**
 * Generates a clean URL slug from text.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Generates dummy markdown blog content for a hero slide if none is provided.
 */
export function generateDefaultMarkdown(title: string, badge: string, description: string): string {
  return `## Comprehensive Breakdown & First Impressions

Welcome to our in-depth feature covering **${title}**.

${description}

The gaming community is buzzing with excitement as new technical breakthroughs and gameplay mechanics come to light. Whether you are tracking performance benchmarks, world design, or release milestones, our editorial desk has analyzed every critical detail.

### Key Highlights & Technical Breakthroughs

- **Next-Gen Graphical Fidelity**: Advanced lighting shaders, ray-traced reflections, and volumetric atmospheres.
- **Responsive Gameplay Loop**: Re-engineered player physics, low-latency control models, and reactive world behaviors.
- **Expansive Living Worlds**: Vast environments with dense NPC routines and seamless streaming.

> "Our engineering and creative vision is driven by a singular goal: pushing interactive storytelling and technological fidelity to their absolute limits."

### What This Means for Players

With modern consoles and high-end PC hardware reaching peak maturity, developers are finally able to realize long-anticipated creative ambitions without compromising frame rates or immersion.

Stay locked into **TheGamerX** for continuous coverage, benchmark breakdowns, and exclusive developer interviews as more updates drop.`;
}

/**
 * Retrieves the current hero slides derived from unified stories.
 * Finds all stories marked with isHero: true.
 * If none are flagged, falls back to the first 3 stories.
 */
export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const stories = await getStories();
    const heroStories = stories.filter((s) => s.isHero);

    const sourceStories = heroStories.length > 0 ? heroStories : stories.slice(0, 3);

    if (sourceStories.length > 0) {
      return sourceStories.map((story, index) => {
        const slug = story.slug || story.id || slugify(story.title);
        return {
          id: story.id || slug,
          slug,
          number: story.heroNumber || String(index + 1).padStart(2, "0"),
          badge: story.heroBadge || "FEATURED STORY",
          title: story.title,
          description: story.heroDescription || story.description || "",
          ctaText: story.heroCtaText || "READ FULL STORY",
          ctaLink: `/stories/${slug}`,
          imageUrl: story.heroImageUrl || story.imageUrl || "/images/hero/gta6-trailer.jpg",
          imageAlt: story.title,
          content: story.content || generateDefaultMarkdown(story.title, story.heroBadge || "FEATURED STORY", story.description || ""),
        };
      });
    }
  } catch (error) {
    console.error("Failed to load hero slides from stories:", error);
  }

  // Final fallback to hardcoded slides
  return HERO_SLIDES.map((slide) => {
    const slug = slide.id || slugify(slide.title);
    return {
      ...slide,
      slug,
      ctaLink: `/stories/${slug}`,
      content: generateDefaultMarkdown(slide.title, slide.badge, slide.description),
    };
  });
}

/**
 * Saves hero slides by synchronizing them into the unified stories storage.
 */
export async function saveHeroSlides(slides: HeroSlide[]): Promise<HeroSlide[]> {
  if (!Array.isArray(slides) || slides.length === 0) {
    throw new Error("Hero slides must be a non-empty array");
  }

  const stories = await getStories();
  const slideMap = new Map(slides.map((s) => [s.slug || s.id, s]));

  const updatedStories = stories.map((story) => {
    const slide = slideMap.get(story.slug || story.id);
    if (slide) {
      return {
        ...story,
        isHero: true,
        heroNumber: slide.number,
        heroBadge: slide.badge,
        heroCtaText: slide.ctaText,
        heroImageUrl: slide.imageUrl,
        heroDescription: slide.description,
        content: slide.content || story.content,
      };
    }
    return story;
  });

  await saveStories(updatedStories);
  return getHeroSlides();
}

/**
 * Finds a hero slide by slug or id.
 */
export async function getHeroSlideBySlug(slug: string): Promise<HeroSlide | null> {
  const slides = await getHeroSlides();
  const normalized = slug.toLowerCase().trim();

  const found = slides.find(
    (s) =>
      (s.slug && s.slug.toLowerCase() === normalized) ||
      (s.id && s.id.toLowerCase() === normalized) ||
      s.ctaLink?.endsWith(`/${normalized}`) ||
      s.ctaLink === `#${normalized}`
  );

  return found || null;
}

/**
 * Returns all hero slide slugs.
 */
export async function getAllHeroSlugs(): Promise<string[]> {
  const slides = await getHeroSlides();
  return slides.map((s) => s.slug || s.id).filter(Boolean);
}

/**
 * Parses markdown into HTML string using marked.
 */
export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  if (!markdown) return "";
  const html = await marked.parse(markdown, { gfm: true, breaks: true });
  return html;
}
