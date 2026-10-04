import {
  HeroSlide,
  Story,
  TrendingGame,
  IndustryArticle,
  ReviewItem,
  GameHubItem,
  GlobalSettings,
} from "../types";
import {
  HERO_SLIDES,
  LATEST_STORIES,
  TRENDING_GAMES,
  INDUSTRY_ARTICLES,
  LATEST_REVIEWS,
  GAME_HUBS,
  FOOTER_DATA,
  NEWSLETTER_DATA,
} from "../data/landingData";

const WORDPRESS_API_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "http://gamerx-blog.local/graphql";

export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string; locations?: unknown[] }>;
}

export function formatWpDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// -------------------------------------------------------------
// WordPress GraphQL Node Types
// -------------------------------------------------------------

export interface WpHeroSlideNode {
  id: string;
  title: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
    };
  } | null;
  heroSlideFields?: {
    slideNumber?: string;
    badgeLabel?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
    imageAltText?: string;
  } | null;
}

export interface WpStoryNode {
  id: string;
  slug?: string;
  title: string;
  content?: string | null;
  date?: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
    };
  } | null;
  storyFields?: {
    categoryTag?: string;
    readTime?: string;
    isMainFeaturedStory?: boolean;
    customExternalLink?: string;
  } | null;
}

export interface WpTrendingGameNode {
  id: string;
  slug?: string;
  title: string;
  content?: string | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
    };
  } | null;
  trendingGameFields?: {
    isFeaturedStarred?: boolean;
    gameHubLink?: string;
  } | null;
}

export interface WpIndustryAnalysisNode {
  id: string;
  slug?: string;
  title: string;
  content?: string | null;
  date?: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
    };
  } | null;
  industryAnalysisFields?: {
    articleNumber?: string;
    analysisTag?: string | string[];
    excerptSummary?: string;
    readTime?: string;
    articleLink?: string;
  } | null;
}

export interface WpReviewNode {
  id: string;
  slug?: string;
  title: string;
  content?: string | null;
  date?: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
    };
  } | null;
  reviewFields?: {
    reviewCategory?: string | string[];
    scoreRating?: number | string;
    maxScore?: number | string;
    reviewLink?: string;
  } | null;
}

export interface WpGameHubNode {
  id: string;
  title: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
    };
  } | null;
  gameHubFields?: {
    brandAccentColor?: string;
    hubInitials?: string;
    hubLink?: string;
  } | null;
}

export interface WpGlobalSettingsNode {
  id: string;
  title: string;
  globalSettingsFields?: {
    footerAboutText?: string;
    copyrightText?: string;
    twitterLink?: string;
    discordLink?: string;
    youtubeLink?: string;
    newsletterHeading?: string;
    newsletterSubtitle?: string;
  } | null;
}

export interface AllLandingGraphQLData {
  heroSlides?: { nodes: WpHeroSlideNode[] };
  stories?: { nodes: WpStoryNode[] };
  trendingGames?: { nodes: WpTrendingGameNode[] };
  industryAnalyses?: { nodes: WpIndustryAnalysisNode[] };
  reviews?: { nodes: WpReviewNode[] };
  gameHubs?: { nodes: WpGameHubNode[] };
  globalSettings?: { nodes: WpGlobalSettingsNode[] };
}

// -------------------------------------------------------------
// GraphQL Queries
// -------------------------------------------------------------

export const GET_HERO_SLIDES_QUERY = `
  query GetHeroSlides {
    heroSlides(first: 10) {
      nodes {
        id
        title
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        heroSlideFields {
          slideNumber
          badgeLabel
          description
          ctaText
          ctaLink
          imageAltText
        }
      }
    }
  }
`;

export const GET_STORIES_QUERY = `
  query GetStories {
    stories(first: 10) {
      nodes {
        id
        slug
        title
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        storyFields {
          categoryTag
          readTime
          isMainFeaturedStory
          customExternalLink
        }
      }
    }
  }
`;

export const GET_STORY_BY_SLUG_QUERY = `
  query GetStoryBySlug($slug: ID!) {
    story(id: $slug, idType: SLUG) {
      id
      slug
      title
      content
      date
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      storyFields {
        categoryTag
        readTime
        isMainFeaturedStory
        customExternalLink
      }
    }
  }
`;

export const GET_ALL_STORY_SLUGS_QUERY = `
  query GetAllStorySlugs {
    stories(first: 100) {
      nodes {
        id
        slug
        storyFields {
          customExternalLink
        }
      }
    }
  }
`;

export const GET_TRENDING_GAMES_QUERY = `
  query GetTrendingGames {
    trendingGames(first: 12) {
      nodes {
        id
        slug
        title
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        trendingGameFields {
          isFeaturedStarred
          gameHubLink
        }
      }
    }
  }
`;

export const GET_GAME_BY_SLUG_QUERY = `
  query GetGameBySlug($slug: ID!) {
    trendingGame(id: $slug, idType: SLUG) {
      id
      slug
      title
      content
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      trendingGameFields {
        isFeaturedStarred
        gameHubLink
      }
    }
  }
`;

export const GET_ALL_GAME_SLUGS_QUERY = `
  query GetAllGameSlugs {
    trendingGames(first: 100) {
      nodes {
        id
        slug
        trendingGameFields {
          gameHubLink
        }
      }
    }
  }
`;

export const GET_INDUSTRY_ANALYSES_QUERY = `
  query GetIndustryAnalyses {
    industryAnalyses(first: 10) {
      nodes {
        id
        slug
        title
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        industryAnalysisFields {
          articleNumber
          analysisTag
          excerptSummary
          readTime
          articleLink
        }
      }
    }
  }
`;

export const GET_ANALYSIS_BY_SLUG_QUERY = `
  query GetAnalysisBySlug($slug: ID!) {
    industryAnalysis(id: $slug, idType: SLUG) {
      id
      slug
      title
      content
      date
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      industryAnalysisFields {
        articleNumber
        analysisTag
        excerptSummary
        readTime
        articleLink
      }
    }
  }
`;

export const GET_ALL_ANALYSIS_SLUGS_QUERY = `
  query GetAllAnalysisSlugs {
    industryAnalyses(first: 100) {
      nodes {
        id
        slug
        industryAnalysisFields {
          articleLink
        }
      }
    }
  }
`;

export const GET_REVIEWS_QUERY = `
  query GetReviews {
    reviews(first: 10) {
      nodes {
        id
        slug
        title
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        reviewFields {
          reviewCategory
          scoreRating
          maxScore
          reviewLink
        }
      }
    }
  }
`;

export const GET_REVIEW_BY_SLUG_QUERY = `
  query GetReviewBySlug($slug: ID!) {
    review(id: $slug, idType: SLUG) {
      id
      slug
      title
      content
      date
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      reviewFields {
        reviewCategory
        scoreRating
        maxScore
        reviewLink
      }
    }
  }
`;

export const GET_ALL_REVIEW_SLUGS_QUERY = `
  query GetAllReviewSlugs {
    reviews(first: 100) {
      nodes {
        id
        slug
        reviewFields {
          reviewLink
        }
      }
    }
  }
`;

export const GET_GAME_HUBS_QUERY = `
  query GetGameHubs {
    gameHubs(first: 16) {
      nodes {
        id
        title
        featuredImage {
          node {
            sourceUrl
          }
        }
        gameHubFields {
          brandAccentColor
          hubInitials
          hubLink
        }
      }
    }
  }
`;

export const GET_GLOBAL_SETTINGS_QUERY = `
  query GetGlobalSettings {
    globalSettings(first: 1) {
      nodes {
        id
        title
        globalSettingsFields {
          footerAboutText
          copyrightText
          twitterLink
          discordLink
          youtubeLink
          newsletterHeading
          newsletterSubtitle
        }
      }
    }
  }
`;

export const GET_ALL_LANDING_DATA_QUERY = `
  query GetAllLandingData {
    heroSlides(first: 10) {
      nodes {
        id
        title
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        heroSlideFields {
          slideNumber
          badgeLabel
          description
          ctaText
          ctaLink
          imageAltText
        }
      }
    }
    stories(first: 10) {
      nodes {
        id
        slug
        title
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        storyFields {
          categoryTag
          readTime
          isMainFeaturedStory
          customExternalLink
        }
      }
    }
    trendingGames(first: 12) {
      nodes {
        id
        slug
        title
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        trendingGameFields {
          isFeaturedStarred
          gameHubLink
        }
      }
    }
    industryAnalyses(first: 10) {
      nodes {
        id
        slug
        title
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        industryAnalysisFields {
          articleNumber
          analysisTag
          excerptSummary
          readTime
          articleLink
        }
      }
    }
    reviews(first: 10) {
      nodes {
        id
        slug
        title
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        reviewFields {
          reviewCategory
          scoreRating
          maxScore
          reviewLink
        }
      }
    }
    gameHubs(first: 16) {
      nodes {
        id
        title
        featuredImage {
          node {
            sourceUrl
          }
        }
        gameHubFields {
          brandAccentColor
          hubInitials
          hubLink
        }
      }
    }
    globalSettings(first: 1) {
      nodes {
        id
        title
        globalSettingsFields {
          footerAboutText
          copyrightText
          twitterLink
          discordLink
          youtubeLink
          newsletterHeading
          newsletterSubtitle
        }
      }
    }
  }
`;

// -------------------------------------------------------------
// Core Fetch Function
// -------------------------------------------------------------

export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T | null> {
  try {
    const res = await fetch(WORDPRESS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.warn(`[WPGraphQL] HTTP error ${res.status} from ${WORDPRESS_API_URL}`);
      return null;
    }

    const json: GraphQLResponse<T> = await res.json();
    if (json.errors) {
      console.warn("[WPGraphQL] Query errors:", json.errors);
    }

    return json.data || null;
  } catch (error) {
    console.warn(`[WPGraphQL] Connection failed to ${WORDPRESS_API_URL}:`, error);
    return null;
  }
}

// -------------------------------------------------------------
// Mapping Functions with Fallback to Mock Data
// -------------------------------------------------------------

export function mapHeroSlides(nodes?: WpHeroSlideNode[]): HeroSlide[] {
  if (!nodes || nodes.length === 0) return HERO_SLIDES;

  const mapped: HeroSlide[] = nodes.map((node) => ({
    id: node.id,
    number: node.heroSlideFields?.slideNumber || "01",
    badge: node.heroSlideFields?.badgeLabel || "FEATURED STORY",
    title: node.title,
    description: node.heroSlideFields?.description || "",
    ctaText: node.heroSlideFields?.ctaText || "READ FULL STORY",
    ctaLink: node.heroSlideFields?.ctaLink || "#",
    imageUrl:
      node.featuredImage?.node?.sourceUrl || "/images/hero/gta6-trailer.jpg",
    imageAlt:
      node.heroSlideFields?.imageAltText ||
      node.featuredImage?.node?.altText ||
      node.title,
  }));

  return mapped.sort((a, b) => (a.number || "").localeCompare(b.number || ""));
}

export function mapStories(nodes?: WpStoryNode[]): Story[] {
  if (!nodes || nodes.length === 0) return LATEST_STORIES;

  return nodes.map((node, index) => {
    const slug = node.slug;
    const externalLink = node.storyFields?.customExternalLink?.trim();
    const isAbsoluteExternal =
      externalLink &&
      (externalLink.startsWith("http://") || externalLink.startsWith("https://"));

    // For all internal stories, strictly use the WordPress slug
    // Keep customExternalLink only as an absolute fallback for external URLs (like https://...)
    const href = slug
      ? `/stories/${slug}`
      : isAbsoluteExternal
      ? externalLink
      : "#";

    return {
      id: node.id,
      slug: node.slug,
      title: node.title,
      content: node.content || undefined,
      category: node.storyFields?.categoryTag || "NEWS",
      date: formatWpDate(node.date) || "Recently Added",
      readTime: node.storyFields?.readTime || "2 min read",
      imageUrl:
        node.featuredImage?.node?.sourceUrl || "/images/stories/witcher-4.jpg",
      isMain: node.storyFields?.isMainFeaturedStory ?? index === 0,
      href,
    };
  });
}

export function mapStoryDetail(
  node?: WpStoryNode | null,
  fallbackSlug?: string
): Story | null {
  if (!node) {
    const mock = LATEST_STORIES.find(
      (s) => s.id === fallbackSlug || s.href?.includes(fallbackSlug || "")
    );
    if (mock) {
      return {
        ...mock,
        slug: mock.id,
        content: `
          <p>Welcome to our comprehensive coverage of <strong>${mock.title}</strong>.</p>
          <p>The gaming landscape is experiencing a massive leap forward as developers leverage cutting-edge rendering pipelines and next-generation architectures to push technical boundaries.</p>
          <h2>Key Highlights & In-Depth Breakdown</h2>
          <p>Recent technical analyses indicate unprecedented fidelity, enhanced ray tracing capabilities, and responsive physics engines tailored for modern displays.</p>
          <blockquote>"Our engineering and creative teams are committed to setting a new benchmark for visual fidelity, immersive storytelling, and responsive controls."</blockquote>
          <p>Stay tuned to gamerX as we continue to track ongoing updates, developer patch notes, and community reception for this major story.</p>
        `,
      };
    }
    return null;
  }

  const defaultContent = `
    <p>Welcome to our in-depth coverage of <strong>${node.title}</strong>.</p>
    <p>The gaming industry continues to evolve at a rapid pace, and this latest development marks an exciting milestone for players worldwide. Whether you are tracking performance benchmarks, narrative updates, or competitive meta changes, our editorial team has assembled all the essential information.</p>
    <h2>What You Need to Know</h2>
    <p>Developers have emphasized high visual fidelity, seamless frame pacing, and responsiveness across modern gaming platforms. Early playtests and technical teardowns highlight impressive advancements.</p>
    <blockquote>"We are witnessing an extraordinary era of real-time fidelity and immersive world design."</blockquote>
    <h2>Looking Ahead</h2>
    <p>Stay tuned to gamerX for continuing coverage, full comparison benchmarks, and in-depth developer insights as further announcements arrive.</p>
  `;

  return {
    id: node.id,
    slug: node.slug || fallbackSlug || "",
    title: node.title,
    content: node.content?.trim() ? node.content : defaultContent,
    category: node.storyFields?.categoryTag || "NEWS",
    date: formatWpDate(node.date) || "Recently Added",
    readTime: node.storyFields?.readTime || "2 min read",
    imageUrl:
      node.featuredImage?.node?.sourceUrl || "/images/stories/witcher-4.jpg",
    isMain: node.storyFields?.isMainFeaturedStory ?? false,
    href: `/stories/${node.slug || fallbackSlug}`,
  };
}

export function mapTrendingGames(nodes?: WpTrendingGameNode[]): TrendingGame[] {
  if (!nodes || nodes.length === 0) return TRENDING_GAMES;

  return nodes.map((node, index) => {
    const slug = node.slug;
    const externalLink = node.trendingGameFields?.gameHubLink?.trim();
    const isAbsoluteExternal =
      externalLink &&
      (externalLink.startsWith("http://") || externalLink.startsWith("https://"));

    const href = slug
      ? `/games/${slug}`
      : isAbsoluteExternal
      ? externalLink
      : "#";

    return {
      id: node.id,
      slug: node.slug,
      title: node.title,
      content: node.content || undefined,
      imageUrl:
        node.featuredImage?.node?.sourceUrl || "/images/games/gta-vi.jpg",
      isFeatured: node.trendingGameFields?.isFeaturedStarred ?? index === 0,
      href,
    };
  });
}

export function mapGameDetail(
  node?: WpTrendingGameNode | null,
  fallbackSlug?: string
): TrendingGame | null {
  if (!node) {
    const mock = TRENDING_GAMES.find(
      (g) => g.slug === fallbackSlug || g.id === fallbackSlug || g.href?.includes(fallbackSlug || "")
    );
    if (mock) {
      return {
        ...mock,
        slug: mock.slug || mock.id,
        content: `
          <p>Welcome to the official game hub and overview for <strong>${mock.title}</strong> on gamerX.</p>
          <p>Explore full system requirements, gameplay mechanics, patch histories, and community strategies for one of the most trending titles in modern gaming.</p>
          <h2>Overview & Core Features</h2>
          <p>Experience expansive open worlds, deep customization trees, and relentless gameplay that sets a standard for its genre.</p>
          <blockquote>"An essential masterpiece delivering unforgettable adventures and industry-defining moments."</blockquote>
          <h2>Community & Live Updates</h2>
          <p>Stay tuned to gamerX for breaking patch coverage, competitive meta tier lists, and complete weapon guides.</p>
        `,
      };
    }
    return null;
  }

  const defaultContent = `
    <p>Welcome to the official game hub and intelligence overview for <strong>${node.title}</strong> on gamerX.</p>
    <p>As one of the most widely played and acclaimed titles across current-gen platforms, ${node.title} delivers a high-octane gaming experience with state-of-the-art visuals and responsive gameplay mechanics.</p>
    <h2>Key Highlights & Overview</h2>
    <p>Our editorial team tracks live updates, community reaction, benchmark performance, and developer roadmap announcements.</p>
    <blockquote>"A standout achievement in gaming design, visual fidelity, and player engagement."</blockquote>
    <h2>Guides, Builds & Ongoing Coverage</h2>
    <p>Check back frequently for full walkthroughs, optimization settings, and tournament highlights on gamerX.</p>
  `;

  return {
    id: node.id,
    slug: node.slug || fallbackSlug || "",
    category: "TRENDING GAME",
    title: node.title,
    content: node.content?.trim() ? node.content : defaultContent,
    imageUrl:
      node.featuredImage?.node?.sourceUrl || "/images/games/gta-vi.jpg",
    isFeatured: node.trendingGameFields?.isFeaturedStarred ?? false,
    href: `/games/${node.slug || fallbackSlug}`,
  };
}

export function mapIndustryAnalyses(nodes?: WpIndustryAnalysisNode[]): IndustryArticle[] {
  if (!nodes || nodes.length === 0) return INDUSTRY_ARTICLES;

  const mapped: IndustryArticle[] = nodes.map((node, index) => {
    const rawTag = node.industryAnalysisFields?.analysisTag;
    const tag = Array.isArray(rawTag)
      ? rawTag[0] || "MARKET REPORT"
      : rawTag || "MARKET REPORT";

    const defaultNumber = String(index + 1).padStart(2, "0");
    const num = node.industryAnalysisFields?.articleNumber || defaultNumber;

    const slug = node.slug;
    const externalLink = node.industryAnalysisFields?.articleLink?.trim();
    const isAbsoluteExternal =
      externalLink &&
      (externalLink.startsWith("http://") || externalLink.startsWith("https://"));

    const href = slug
      ? `/analysis/${slug}`
      : isAbsoluteExternal
      ? externalLink
      : "#";

    return {
      id: node.id,
      slug: node.slug,
      number: num,
      category: tag,
      title: node.title,
      description: node.industryAnalysisFields?.excerptSummary || "",
      excerpt: node.industryAnalysisFields?.excerptSummary || "",
      content: node.content || undefined,
      date: formatWpDate(node.date) || "May 6, 2025",
      readTime: node.industryAnalysisFields?.readTime || "5 min read",
      imageUrl:
        node.featuredImage?.node?.sourceUrl || "/images/industry/ubisoft.jpg",
      href,
    };
  });

  return mapped.sort((a, b) => (a.number || "").localeCompare(b.number || ""));
}

export function mapAnalysisDetail(
  node?: WpIndustryAnalysisNode | null,
  fallbackSlug?: string
): IndustryArticle | null {
  if (!node) {
    const mock = INDUSTRY_ARTICLES.find(
      (a) => a.slug === fallbackSlug || a.id === fallbackSlug || a.href?.includes(fallbackSlug || "")
    );
    if (mock) {
      return {
        ...mock,
        slug: mock.slug || mock.id,
        content: `
          <p>Welcome to our executive industry analysis: <strong>${mock.title}</strong>.</p>
          <p>${mock.description}</p>
          <h2>Market Dynamics & Financial Impact</h2>
          <p>Our investigative report assesses studio capitalization, publisher revenue diversification, player retention churn, and platform holder fees.</p>
          <blockquote>"The market is moving faster than legacy publisher structures can adapt. Agile studios with strong direct-to-consumer models are dominating the current cycle."</blockquote>
          <h2>Strategic Takeaways & Long-Term Outlook</h2>
          <p>Understanding these shifts is crucial for investors, game directors, and technology providers navigating the current gaming landscape.</p>
        `,
      };
    }
    return null;
  }

  const rawTag = node.industryAnalysisFields?.analysisTag;
  const tag = Array.isArray(rawTag)
    ? rawTag[0] || "MARKET REPORT"
    : rawTag || "MARKET REPORT";

  const num = node.industryAnalysisFields?.articleNumber || "01";
  const excerpt =
    node.industryAnalysisFields?.excerptSummary ||
    "An in-depth executive briefing on the financial and technological trends shaping the interactive entertainment business.";

  const defaultContent = `
    <p>Welcome to our deep industry analysis: <strong>${node.title}</strong>.</p>
    <p>${excerpt}</p>
    <h2>Strategic Context & Financial Vectors</h2>
    <p>The gaming industry is undergoing structural transformation driven by cross-platform distribution, subscription ecosystems, and live-service monetization challenges.</p>
    <blockquote>"Success in today's gaming ecosystem requires a nuanced balance between core gameplay retention, scalable infrastructure, and disciplined capital allocation."</blockquote>
    <h2>Key Industry Conclusions</h2>
    <p>As platform competition accelerates, studios must leverage high-efficiency engines and community-centric operations to maintain market share and drive sustainable profitability.</p>
  `;

  return {
    id: node.id,
    slug: node.slug || fallbackSlug || "",
    number: num,
    category: tag,
    title: node.title,
    description: excerpt,
    excerpt,
    content: node.content?.trim() ? node.content : defaultContent,
    date: formatWpDate(node.date) || "May 6, 2025",
    readTime: node.industryAnalysisFields?.readTime || "5 min read",
    imageUrl:
      node.featuredImage?.node?.sourceUrl || "/images/industry/ubisoft.jpg",
    href: `/analysis/${node.slug || fallbackSlug}`,
  };
}

export function mapReviews(nodes?: WpReviewNode[]): ReviewItem[] {
  if (!nodes || nodes.length === 0) return LATEST_REVIEWS;

  return nodes.map((node) => {
    const rawCategory = node.reviewFields?.reviewCategory;
    const category = Array.isArray(rawCategory)
      ? rawCategory[0] || "HARDWARE REVIEW"
      : rawCategory || "HARDWARE REVIEW";

    const rating = Number(node.reviewFields?.scoreRating) || 4.5;
    const maxRating = Number(node.reviewFields?.maxScore) || 5;

    const slug = node.slug;
    const externalLink = node.reviewFields?.reviewLink?.trim();
    const isAbsoluteExternal =
      externalLink &&
      (externalLink.startsWith("http://") || externalLink.startsWith("https://"));

    const href = slug
      ? `/reviews/${slug}`
      : isAbsoluteExternal
      ? externalLink
      : "#";

    return {
      id: node.id,
      slug: node.slug,
      category,
      title: node.title,
      content: node.content || undefined,
      rating,
      maxRating,
      date: formatWpDate(node.date) || "Recently Reviewed",
      imageUrl:
        node.featuredImage?.node?.sourceUrl || "/images/reviews/rtx-5090.jpg",
      href,
    };
  });
}

export function mapReviewDetail(
  node?: WpReviewNode | null,
  fallbackSlug?: string
): ReviewItem | null {
  if (!node) {
    const mock = LATEST_REVIEWS.find(
      (r) => r.slug === fallbackSlug || r.id === fallbackSlug || r.href?.includes(fallbackSlug || "")
    );
    if (mock) {
      return {
        ...mock,
        slug: mock.slug || mock.id,
        content: `
          <p>Welcome to the gamerX comprehensive review of <strong>${mock.title}</strong>.</p>
          <p>After rigorous hands-on testing across demanding AAA titles and specialized benchmarking suites, we evaluate build quality, acoustic performance, thermal dissipation, and raw price-to-performance metrics.</p>
          <h2>Design, Engineering & Ergonomics</h2>
          <p>Premium materials, refined thermal architectures, and intuitive software suites distinguish this product from competitive offerings.</p>
          <blockquote>"A triumph of hardware engineering that sets the bar for next-generation performance."</blockquote>
          <h2>Final Verdict: ${mock.rating}/${mock.maxRating || 5}</h2>
          <p>For enthusiasts demanding top-tier fidelity and uncompromising reliability, this hardware delivers exceptional value.</p>
        `,
      };
    }
    return null;
  }

  const rawCategory = node.reviewFields?.reviewCategory;
  const category = Array.isArray(rawCategory)
    ? rawCategory[0] || "HARDWARE REVIEW"
    : rawCategory || "HARDWARE REVIEW";

  const rating = Number(node.reviewFields?.scoreRating) || 4.5;
  const maxScore = Number(node.reviewFields?.maxScore) || 5;

  const defaultContent = `
    <p>Welcome to our in-depth evaluation and breakdown of <strong>${node.title}</strong>.</p>
    <p>Our hardware and gaming test lab puts every device through rigorous synthetic benchmarks, real-world frame timing analysis, and extended multi-hour endurance sessions.</p>
    <h2>Performance & Benchmark Results</h2>
    <p>Tested under heavy loads, thermal dynamics and power delivery remain remarkably controlled, delivering smooth 1% lows and consistent frame pacing.</p>
    <blockquote>"A well-engineered product that meets the exacting standards of modern gaming enthusiasts."</blockquote>
    <h2>The Verdict</h2>
    <p>Offering standout performance and robust build quality, this earns a confident recommendation from our editorial team.</p>
  `;

  return {
    id: node.id,
    slug: node.slug || fallbackSlug || "",
    category,
    title: node.title,
    rating,
    maxRating: maxScore,
    content: node.content?.trim() ? node.content : defaultContent,
    date: formatWpDate(node.date) || "Recently Reviewed",
    imageUrl:
      node.featuredImage?.node?.sourceUrl || "/images/reviews/rtx-5090.jpg",
    href: `/reviews/${node.slug || fallbackSlug}`,
  };
}

export function mapGameHubs(nodes?: WpGameHubNode[]): GameHubItem[] {
  if (!nodes || nodes.length === 0) return GAME_HUBS;

  return nodes.map((node) => ({
    id: node.id,
    name: node.title,
    imageUrl: node.featuredImage?.node?.sourceUrl,
    accentColor: node.gameHubFields?.brandAccentColor || "#0ea5e9",
    initials:
      node.gameHubFields?.hubInitials || node.title.slice(0, 2).toUpperCase(),
    href: node.gameHubFields?.hubLink || "#",
  }));
}

export function mapGlobalSettings(nodes?: WpGlobalSettingsNode[]): GlobalSettings {
  const fields = nodes?.[0]?.globalSettingsFields;
  return {
    footerAboutText: fields?.footerAboutText || FOOTER_DATA.mission,
    copyrightText: fields?.copyrightText || FOOTER_DATA.copyright,
    twitterLink:
      fields?.twitterLink ||
      FOOTER_DATA.socialLinks.find((s) => s.platform === "twitter")?.href ||
      "#",
    discordLink:
      fields?.discordLink ||
      FOOTER_DATA.socialLinks.find((s) => s.platform === "discord")?.href ||
      "#",
    youtubeLink:
      fields?.youtubeLink ||
      FOOTER_DATA.socialLinks.find((s) => s.platform === "youtube")?.href ||
      "#",
    newsletterHeading: fields?.newsletterHeading || NEWSLETTER_DATA.heading,
    newsletterSubtitle: fields?.newsletterSubtitle || undefined,
  };
}

// -------------------------------------------------------------
// High-Level Data Fetchers
// -------------------------------------------------------------

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const data = await fetchGraphQL<{ heroSlides?: { nodes: WpHeroSlideNode[] } }>(
    GET_HERO_SLIDES_QUERY
  );
  return mapHeroSlides(data?.heroSlides?.nodes);
}

export async function getStories(): Promise<Story[]> {
  const data = await fetchGraphQL<{ stories?: { nodes: WpStoryNode[] } }>(
    GET_STORIES_QUERY
  );
  return mapStories(data?.stories?.nodes);
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  const data = await fetchGraphQL<{ story?: WpStoryNode }>(
    GET_STORY_BY_SLUG_QUERY,
    { slug }
  );

  if (data?.story) {
    return mapStoryDetail(data.story, slug);
  }

  // Fallback: check if slug matches customExternalLink on any story in WP
  try {
    const allStories = await fetchGraphQL<{ stories?: { nodes: WpStoryNode[] } }>(
      GET_STORIES_QUERY
    );
    const matched = allStories?.stories?.nodes?.find((n) => {
      if (n.slug === slug) return true;
      const custom = n.storyFields?.customExternalLink?.trim();
      return custom === `/stories/${slug}` || custom === slug;
    });

    if (matched) {
      if (matched.slug && matched.slug !== slug) {
        const fullStory = await fetchGraphQL<{ story?: WpStoryNode }>(
          GET_STORY_BY_SLUG_QUERY,
          { slug: matched.slug }
        );
        if (fullStory?.story) {
          return mapStoryDetail(fullStory.story, slug);
        }
      }
      return mapStoryDetail(matched, slug);
    }
  } catch {
    // ignore
  }

  return mapStoryDetail(null, slug);
}

export async function getAllStorySlugs(): Promise<string[]> {
  try {
    const data = await fetchGraphQL<{ stories?: { nodes: WpStoryNode[] } }>(
      GET_ALL_STORY_SLUGS_QUERY
    );
    const slugs: string[] = [];

    (data?.stories?.nodes || []).forEach((n) => {
      if (n.slug) slugs.push(n.slug);
      const custom = n.storyFields?.customExternalLink?.trim();
      if (custom && custom.startsWith("/stories/")) {
        const extracted = custom.replace(/^\/stories\//, "").replace(/\/$/, "");
        if (extracted) slugs.push(extracted);
      }
    });

    // Combine with mock fallback story slugs/IDs so static export pre-renders them too
    const mockSlugs = LATEST_STORIES.map((s) => s.slug || s.id);
    return Array.from(new Set([...slugs, ...mockSlugs]));
  } catch (err) {
    console.error("Error in getAllStorySlugs:", err);
    return LATEST_STORIES.map((s) => s.slug || s.id);
  }
}

export async function getTrendingGames(): Promise<TrendingGame[]> {
  const data = await fetchGraphQL<{ trendingGames?: { nodes: WpTrendingGameNode[] } }>(
    GET_TRENDING_GAMES_QUERY
  );
  return mapTrendingGames(data?.trendingGames?.nodes);
}

export async function getGameBySlug(slug: string): Promise<TrendingGame | null> {
  const data = await fetchGraphQL<{ trendingGame?: WpTrendingGameNode }>(
    GET_GAME_BY_SLUG_QUERY,
    { slug }
  );

  if (data?.trendingGame) {
    return mapGameDetail(data.trendingGame, slug);
  }

  // Fallback: search nodes in case slug was custom alias
  try {
    const all = await fetchGraphQL<{ trendingGames?: { nodes: WpTrendingGameNode[] } }>(
      GET_TRENDING_GAMES_QUERY
    );
    const matched = all?.trendingGames?.nodes?.find((n) => {
      if (n.slug === slug) return true;
      const custom = n.trendingGameFields?.gameHubLink?.trim();
      return custom === `/games/${slug}` || custom === slug;
    });

    if (matched) {
      if (matched.slug && matched.slug !== slug) {
        const full = await fetchGraphQL<{ trendingGame?: WpTrendingGameNode }>(
          GET_GAME_BY_SLUG_QUERY,
          { slug: matched.slug }
        );
        if (full?.trendingGame) return mapGameDetail(full.trendingGame, slug);
      }
      return mapGameDetail(matched, slug);
    }
  } catch {
    // ignore
  }

  return mapGameDetail(null, slug);
}

export async function getAllGameSlugs(): Promise<string[]> {
  try {
    const data = await fetchGraphQL<{ trendingGames?: { nodes: WpTrendingGameNode[] } }>(
      GET_ALL_GAME_SLUGS_QUERY
    );
    const slugs: string[] = [];

    (data?.trendingGames?.nodes || []).forEach((n) => {
      if (n.slug) slugs.push(n.slug);
      const custom = n.trendingGameFields?.gameHubLink?.trim();
      if (custom && custom.startsWith("/games/")) {
        const extracted = custom.replace(/^\/games\//, "").replace(/\/$/, "");
        if (extracted) slugs.push(extracted);
      }
    });

    const mockSlugs = TRENDING_GAMES.map((g) => g.slug || g.id);
    return Array.from(new Set([...slugs, ...mockSlugs]));
  } catch (err) {
    console.error("Error in getAllGameSlugs:", err);
    return TRENDING_GAMES.map((g) => g.slug || g.id);
  }
}

export async function getIndustryAnalyses(): Promise<IndustryArticle[]> {
  const data = await fetchGraphQL<{ industryAnalyses?: { nodes: WpIndustryAnalysisNode[] } }>(
    GET_INDUSTRY_ANALYSES_QUERY
  );
  return mapIndustryAnalyses(data?.industryAnalyses?.nodes);
}

export async function getAnalysisBySlug(slug: string): Promise<IndustryArticle | null> {
  const data = await fetchGraphQL<{ industryAnalysis?: WpIndustryAnalysisNode }>(
    GET_ANALYSIS_BY_SLUG_QUERY,
    { slug }
  );

  if (data?.industryAnalysis) {
    return mapAnalysisDetail(data.industryAnalysis, slug);
  }

  // Fallback: search nodes in case slug was custom alias
  try {
    const all = await fetchGraphQL<{ industryAnalyses?: { nodes: WpIndustryAnalysisNode[] } }>(
      GET_INDUSTRY_ANALYSES_QUERY
    );
    const matched = all?.industryAnalyses?.nodes?.find((n) => {
      if (n.slug === slug) return true;
      const custom = n.industryAnalysisFields?.articleLink?.trim();
      return custom === `/analysis/${slug}` || custom === slug;
    });

    if (matched) {
      if (matched.slug && matched.slug !== slug) {
        const full = await fetchGraphQL<{ industryAnalysis?: WpIndustryAnalysisNode }>(
          GET_ANALYSIS_BY_SLUG_QUERY,
          { slug: matched.slug }
        );
        if (full?.industryAnalysis) return mapAnalysisDetail(full.industryAnalysis, slug);
      }
      return mapAnalysisDetail(matched, slug);
    }
  } catch {
    // ignore
  }

  return mapAnalysisDetail(null, slug);
}

export async function getAllAnalysisSlugs(): Promise<string[]> {
  try {
    const data = await fetchGraphQL<{ industryAnalyses?: { nodes: WpIndustryAnalysisNode[] } }>(
      GET_ALL_ANALYSIS_SLUGS_QUERY
    );
    const slugs: string[] = [];

    (data?.industryAnalyses?.nodes || []).forEach((n) => {
      if (n.slug) slugs.push(n.slug);
      const custom = n.industryAnalysisFields?.articleLink?.trim();
      if (custom && custom.startsWith("/analysis/")) {
        const extracted = custom.replace(/^\/analysis\//, "").replace(/\/$/, "");
        if (extracted) slugs.push(extracted);
      }
    });

    const mockSlugs = INDUSTRY_ARTICLES.map((a) => a.slug || a.id);
    return Array.from(new Set([...slugs, ...mockSlugs]));
  } catch (err) {
    console.error("Error in getAllAnalysisSlugs:", err);
    return INDUSTRY_ARTICLES.map((a) => a.slug || a.id);
  }
}

export async function getReviews(): Promise<ReviewItem[]> {
  const data = await fetchGraphQL<{ reviews?: { nodes: WpReviewNode[] } }>(
    GET_REVIEWS_QUERY
  );
  return mapReviews(data?.reviews?.nodes);
}

export async function getReviewBySlug(slug: string): Promise<ReviewItem | null> {
  const data = await fetchGraphQL<{ review?: WpReviewNode }>(
    GET_REVIEW_BY_SLUG_QUERY,
    { slug }
  );

  if (data?.review) {
    return mapReviewDetail(data.review, slug);
  }

  // Fallback: search nodes in case slug was custom alias
  try {
    const all = await fetchGraphQL<{ reviews?: { nodes: WpReviewNode[] } }>(
      GET_REVIEWS_QUERY
    );
    const matched = all?.reviews?.nodes?.find((n) => {
      if (n.slug === slug) return true;
      const custom = n.reviewFields?.reviewLink?.trim();
      return custom === `/reviews/${slug}` || custom === slug;
    });

    if (matched) {
      if (matched.slug && matched.slug !== slug) {
        const full = await fetchGraphQL<{ review?: WpReviewNode }>(
          GET_REVIEW_BY_SLUG_QUERY,
          { slug: matched.slug }
        );
        if (full?.review) return mapReviewDetail(full.review, slug);
      }
      return mapReviewDetail(matched, slug);
    }
  } catch {
    // ignore
  }

  return mapReviewDetail(null, slug);
}

export async function getAllReviewSlugs(): Promise<string[]> {
  try {
    const data = await fetchGraphQL<{ reviews?: { nodes: WpReviewNode[] } }>(
      GET_ALL_REVIEW_SLUGS_QUERY
    );
    const slugs: string[] = [];

    (data?.reviews?.nodes || []).forEach((n) => {
      if (n.slug) slugs.push(n.slug);
      const custom = n.reviewFields?.reviewLink?.trim();
      if (custom && custom.startsWith("/reviews/")) {
        const extracted = custom.replace(/^\/reviews\//, "").replace(/\/$/, "");
        if (extracted) slugs.push(extracted);
      }
    });

    const mockSlugs = LATEST_REVIEWS.map((r) => r.slug || r.id);
    return Array.from(new Set([...slugs, ...mockSlugs]));
  } catch (err) {
    console.error("Error in getAllReviewSlugs:", err);
    return LATEST_REVIEWS.map((r) => r.slug || r.id);
  }
}

export async function getGameHubs(): Promise<GameHubItem[]> {
  const data = await fetchGraphQL<{ gameHubs?: { nodes: WpGameHubNode[] } }>(
    GET_GAME_HUBS_QUERY
  );
  return mapGameHubs(data?.gameHubs?.nodes);
}

export async function getGlobalSettings(): Promise<GlobalSettings> {
  const data = await fetchGraphQL<{ globalSettings?: { nodes: WpGlobalSettingsNode[] } }>(
    GET_GLOBAL_SETTINGS_QUERY
  );
  return mapGlobalSettings(data?.globalSettings?.nodes);
}

/**
 * Fetches all landing page sections in a single unified GraphQL query
 */
export async function getAllLandingData() {
  const data = await fetchGraphQL<AllLandingGraphQLData>(GET_ALL_LANDING_DATA_QUERY);

  return {
    heroSlides: mapHeroSlides(data?.heroSlides?.nodes),
    stories: mapStories(data?.stories?.nodes),
    trendingGames: mapTrendingGames(data?.trendingGames?.nodes),
    industryAnalyses: mapIndustryAnalyses(data?.industryAnalyses?.nodes),
    reviews: mapReviews(data?.reviews?.nodes),
    gameHubs: mapGameHubs(data?.gameHubs?.nodes),
    globalSettings: mapGlobalSettings(data?.globalSettings?.nodes),
  };
}
