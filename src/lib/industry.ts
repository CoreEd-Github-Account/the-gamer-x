import fs from "fs/promises";
import path from "path";
import { marked } from "marked";
import { IndustryArticle } from "../types";
import { INDUSTRY_ARTICLES } from "../data/landingData";
import { slugify } from "./hero";

const INDUSTRY_FILE_PATH = path.join(process.cwd(), "src", "data", "industry-analysis.json");

/**
 * Generates default markdown for an industry report if none is provided.
 */
export function generateDefaultAnalysisMarkdown(title: string, category?: string, description?: string): string {
  return `## ${title}

Welcome to this in-depth industry breakdown by the **TheGamerX Intelligence** desk.

${description || "Our team provides deep-dive market research, developer insights, and technology forecasts shaping the future of global gaming."}

### Key Market Takeaways

- **Strategic Realignment**: Evolving monetization frameworks and shifting player demographics.
- **Technology Breakthroughs**: Next-generation engines, cloud pipelines, and hardware adoption curves.
- **Long-Term Industry Impact**: What this means for studios, publishers, and players worldwide.

> "Understanding underlying industry dynamics is essential to anticipating where gaming technology and culture head next."

Stay connected to **TheGamerX** for continuing financial, technical, and executive coverage.`;
}

/**
 * Retrieves all industry analysis articles from disk or fallback data.
 */
export async function getIndustryArticles(): Promise<IndustryArticle[]> {
  try {
    const raw = await fs.readFile(INDUSTRY_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((article, index) => {
        const slug = article.slug || article.id || slugify(article.title);
        const number = article.number || String(index + 1).padStart(2, "0");
        return {
          ...article,
          slug,
          number,
          href: `/analysis/${slug}`,
          content: article.content || generateDefaultAnalysisMarkdown(article.title, article.category, article.description),
        };
      });
    }
  } catch {
    // If file doesn't exist yet, fallback to default seed data
  }

  return INDUSTRY_ARTICLES.map((article, index) => {
    const slug = article.slug || article.id || slugify(article.title);
    const number = article.number || String(index + 1).padStart(2, "0");
    return {
      ...article,
      slug,
      number,
      href: `/analysis/${slug}`,
      content: article.content || generateDefaultAnalysisMarkdown(article.title, article.category, article.description),
    };
  });
}

/**
 * Saves industry analysis articles to JSON storage.
 */
export async function saveIndustryArticles(articles: IndustryArticle[]): Promise<IndustryArticle[]> {
  if (!Array.isArray(articles) || articles.length === 0) {
    throw new Error("Industry analysis articles must be a non-empty array");
  }

  const formatted: IndustryArticle[] = articles.map((article, index) => {
    const slug = article.slug || slugify(article.title) || `analysis-${index + 1}`;
    const number = article.number || String(index + 1).padStart(2, "0");

    return {
      id: article.id || slug,
      slug,
      number,
      category: article.category || "Market Report",
      title: article.title || "Untitled Analysis",
      description: article.description || "",
      date: article.date || "May 2026",
      readTime: article.readTime || "5 min read",
      imageUrl: article.imageUrl || "/images/industry/ubisoft.jpg",
      href: `/analysis/${slug}`,
      content: article.content || generateDefaultAnalysisMarkdown(article.title, article.category, article.description),
    };
  });

  await fs.writeFile(INDUSTRY_FILE_PATH, JSON.stringify(formatted, null, 2), "utf-8");
  return formatted;
}

/**
 * Finds a single industry analysis article by slug or id.
 */
export async function getAnalysisBySlug(slug: string): Promise<IndustryArticle | null> {
  const articles = await getIndustryArticles();
  const normalized = slug.toLowerCase().trim();

  const found = articles.find(
    (a) =>
      (a.slug && a.slug.toLowerCase() === normalized) ||
      (a.id && a.id.toLowerCase() === normalized) ||
      a.href?.endsWith(`/${normalized}`)
  );

  return found || null;
}

/**
 * Returns all analysis slugs for static generation.
 */
export async function getAllAnalysisSlugs(): Promise<string[]> {
  const articles = await getIndustryArticles();
  return articles.map((a) => a.slug || a.id).filter((slug): slug is string => Boolean(slug));
}

/**
 * Parses markdown into HTML string using marked.
 */
export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  if (!markdown) return "";
  const html = await marked.parse(markdown, { gfm: true, breaks: true });
  return html;
}

