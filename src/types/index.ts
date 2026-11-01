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
  slug?: string;
  content?: string;
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
  isHero?: boolean;
  heroNumber?: string;
  heroBadge?: string;
  heroCtaText?: string;
  heroImageUrl?: string;
  heroDescription?: string;
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
  description?: string;
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

export interface HardwareItem {
  id: string;
  slug: string;
  title: string;
  category: "GPUs & CPUs" | "Consoles" | "Handhelds" | "Peripherals & Monitors" | "Build Guides";
  specsBadge?: string;
  rating?: string;
  date: string;
  readTime: string;
  imageUrl: string;
  description: string;
  content?: string;
  isFeatured?: boolean;
  href?: string;
}

export interface PitchSubmission {
  id: string;
  name: string;
  email: string;
  portfolioUrl?: string;
  category: "Industry Analysis" | "Hardware & Tech" | "Features & Essays" | "Guides & Meta" | "Investigative";
  title: string;
  pitch: string;
  samples?: string;
  estimatedWords?: string;
  status: "pending" | "under_review" | "accepted" | "declined";
  createdAt: string;
}

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
  logoUrl?: string;
  footerAboutText?: string;
  copyrightText?: string;
  twitterLink?: string;
  discordLink?: string;
  youtubeLink?: string;
  newsletterHeading?: string;
  newsletterSubtitle?: string;
}

export interface ForumAuthor {
  name: string;
  avatarUrl?: string;
  badge?: "Staff" | "Dev Insider" | "Hardware Guru" | "Day 1 Gamer" | "Pro Reviewer" | "Community Member";
  badgeColor?: string;
  steamId?: string;
  psnId?: string;
  postCount?: number;
}

export interface ForumReply {
  id: string;
  author: ForumAuthor;
  createdAt: string;
  content: string;
  upvotes: number;
  isSolution?: boolean;
}

export interface ForumThread {
  id: string;
  slug: string;
  title: string;
  category: "Game Hubs" | "Hardware & Tech" | "Industry Debates" | "News & Leaks" | "Community Lounge";
  gameTag?: string;
  isPinned?: boolean;
  isLocked?: boolean;
  upvotes: number;
  views: number;
  repliesCount: number;
  author: ForumAuthor;
  createdAt: string;
  lastActivity: string;
  content: string;
  reactions?: {
    hype: number;
    playedIt: number;
    rip: number;
    insightful: number;
  };
  replies?: ForumReply[];
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
  threadCount: number;
  accentColor: string;
}

export interface GamerProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  badge: "Staff" | "Dev Insider" | "Hardware Guru" | "Day 1 Gamer" | "Pro Reviewer" | "Community Member";
  badgeColor?: string;
  steamId?: string;
  psnId?: string;
  xboxId?: string;
  karma: number;
  joinedAt: string;
  bio?: string;
}
