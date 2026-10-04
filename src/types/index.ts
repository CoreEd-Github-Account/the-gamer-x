export interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface HeroSlide {
  id: string;
  number: string;
  badge: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  imageAlt: string;
}

export interface Story {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl: string;
  slug?: string;
  content?: string;
  isMain?: boolean;
  description?: string;
  href?: string;
}

export type StoryItem = Story;

export interface TrendingGame {
  id: string;
  title: string;
  imageUrl: string;
  category?: string;
  slug?: string;
  content?: string;
  isFeatured?: boolean;
  href?: string;
}

export type GameItem = TrendingGame;

export interface IndustryArticle {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  excerpt?: string;
  date: string;
  readTime: string;
  imageUrl: string;
  slug?: string;
  content?: string;
  href?: string;
}

export type AnalysisItem = IndustryArticle;

export interface ReviewItem {
  id: string;
  category: string;
  title: string;
  rating: number;
  maxRating?: number;
  date: string;
  imageUrl: string;
  slug?: string;
  content?: string;
  href?: string;
}

export interface GameHubItem {
  id: string;
  name: string;
  imageUrl?: string;
  accentColor?: string;
  initials?: string;
  href?: string;
}

export type HubItem = GameHubItem;

export interface SocialLink {
  name: string;
  href: string;
  platform: "twitter" | "youtube" | "discord" | "instagram";
}

export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

export interface GlobalSettings {
  footerAboutText?: string;
  copyrightText?: string;
  twitterLink?: string;
  discordLink?: string;
  youtubeLink?: string;
  newsletterHeading?: string;
  newsletterSubtitle?: string;
}
