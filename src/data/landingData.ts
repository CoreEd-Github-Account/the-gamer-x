import {
  NavLink,
  HeroSlide,
  Story,
  TrendingGame,
  IndustryArticle,
} from "../types";

export interface SiteInfo {
  name: string;
  tagline?: string;
  logoLetter: string;
  logoUrl: string;
}

export const SITE_INFO: SiteInfo = {
  name: "TheGamerX",
  logoLetter: "GX",
  logoUrl: "/logo.png",
};

export const NAV_LINKS: NavLink[] = [
  { label: "LATEST STORIES", href: "/stories" },
  { label: "TRENDING", href: "/#trending" },
  { label: "ANALYSIS", href: "/#analysis" },
  { label: "FORUM", href: "/forum" },
  { label: "HARDWARE", href: "/#hardware" },
  { label: "WRITE FOR US", href: "/write-for-us" },
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "gta-6-trailer-2",
    number: "01",
    badge: "FEATURED STORY",
    title: "GTA 6 Trailer 2 Breakdown",
    description: "Every detail you might have missed from Rockstar's biggest trailer yet.",
    ctaText: "READ FULL STORY",
    ctaLink: "#story-gta6",
    imageUrl: "/images/hero/gta6-trailer.jpg",
    imageAlt: "Grand Theft Auto VI dusk skyline and sports car showcase",
  },
  {
    id: "witcher-4-engine",
    number: "02",
    badge: "FEATURED STORY",
    title: "The Witcher 4: Next-Gen World Reveal",
    description: "CD Projekt Red unveils northern kingdoms fidelity powered by Unreal Engine 5.",
    ctaText: "READ FULL STORY",
    ctaLink: "#story-witcher4",
    imageUrl: "/images/hero/gta6-trailer.jpg",
    imageAlt: "The Witcher 4 landscape concept",
  },
  {
    id: "ps5-pro-analysis",
    number: "03",
    badge: "FEATURED STORY",
    title: "PlayStation 5 Pro Architectural Deep Dive",
    description: "Inside Mark Cerny's enhanced PSSR AI upscaling technology and 60FPS ray tracing benchmarks.",
    ctaText: "READ FULL STORY",
    ctaLink: "#story-ps5pro",
    imageUrl: "/images/hero/gta6-trailer.jpg",
    imageAlt: "PlayStation 5 Pro technical teardown",
  },
  {
    id: "ue5-evolution",
    number: "04",
    badge: "FEATURED STORY",
    title: "Unreal Engine 5.6: The Next Leap in Real-Time Worlds",
    description: "Epic Games showcases next-generation Nanite foliage and real-time neural illumination.",
    ctaText: "READ FULL STORY",
    ctaLink: "#story-ue5",
    imageUrl: "/images/hero/gta6-trailer.jpg",
    imageAlt: "Unreal Engine 5.6 technical showcase",
  },
];

export const LATEST_STORIES: Story[] = [
  {
    id: "witcher-4-details",
    slug: "witcher-4-details",
    title: "The Witcher 4: New Gameplay Details Revealed",
    category: "NEWS",
    date: "May 7, 2025",
    readTime: "2 min read",
    imageUrl: "/images/stories/witcher-4.jpg",
    isMain: true,
    href: "/stories/witcher-4-details",
  },
  {
    id: "ps5-sales-65m",
    slug: "ps5-sales-65m",
    title: "PlayStation 5 Hits 65 Million Units Sold Worldwide",
    category: "NEWS",
    date: "May 6, 2025",
    readTime: "2 min read",
    imageUrl: "/images/stories/ps5-sales.jpg",
    href: "/stories/ps5-sales-65m",
  },
  {
    id: "xbox-nextgen-leak",
    slug: "xbox-nextgen-leak",
    title: "Xbox Next-Gen Console Leaks Online: What We Know",
    category: "NEWS",
    date: "May 6, 2025",
    readTime: "3 min read",
    imageUrl: "/images/stories/xbox-leak.jpg",
    href: "/stories/xbox-nextgen-leak",
  },
  {
    id: "wukong-dlc-summer",
    slug: "wukong-dlc-summer",
    title: "Black Myth: Wukong DLC Confirmed for Summer 2025",
    category: "NEWS",
    date: "May 5, 2025",
    readTime: "2 min read",
    imageUrl: "/images/stories/wukong-dlc.jpg",
    href: "/stories/wukong-dlc-summer",
  },
];

export const TRENDING_GAMES: TrendingGame[] = [
  {
    id: "gta-vi",
    slug: "gta-vi",
    title: "GTA VI",
    imageUrl: "/images/games/gta-vi.jpg",
    isFeatured: true,
    href: "/games/gta-vi",
  },
  {
    id: "elden-ring",
    slug: "elden-ring",
    title: "Elden Ring",
    imageUrl: "/images/games/elden-ring.jpg",
    href: "/games/elden-ring",
  },
  {
    id: "black-myth-wukong",
    slug: "black-myth-wukong",
    title: "Black Myth Wukong",
    imageUrl: "/images/games/black-myth-wukong.jpg",
    href: "/games/black-myth-wukong",
  },
  {
    id: "cyberpunk-2077",
    slug: "cyberpunk-2077",
    title: "Cyberpunk 2077",
    imageUrl: "/images/games/cyberpunk-2077.jpg",
    href: "/games/cyberpunk-2077",
  },
  {
    id: "cod-mwiii",
    slug: "cod-mwiii",
    title: "Call of Duty MWIII",
    imageUrl: "/images/games/cod-mw3.jpg",
    href: "/games/cod-mwiii",
  },
  {
    id: "ghost-of-yotei",
    slug: "ghost-of-yotei",
    title: "Ghost of Yōtei",
    imageUrl: "/images/games/ghost-of-yotei.jpg",
    href: "/games/ghost-of-yotei",
  },
  {
    id: "horizon-forbidden-west",
    slug: "horizon-forbidden-west",
    title: "Horizon Forbidden West",
    imageUrl: "/images/games/horizon-forbidden-west.jpg",
    href: "/games/horizon-forbidden-west",
  },
];
export const INDUSTRY_ARTICLES: IndustryArticle[] = [
  {
    id: "ubisoft-player-loss",
    slug: "ubisoft-player-loss",
    number: "01",
    category: "MARKET REPORT",
    title: "Why Ubisoft Keeps Losing Players",
    description: "A deep dive into Ubisoft's declining player numbers and what needs to change.",
    date: "May 6, 2025",
    readTime: "5 min read",
    imageUrl: "/images/industry/ubisoft.jpg",
    href: "/analysis/ubisoft-player-loss",
  },
  {
    id: "steam-impossible-to-beat",
    slug: "steam-impossible-to-beat",
    number: "02",
    category: "BUSINESS INSIGHT",
    title: "Why Steam Is Impossible To Beat",
    description: "Valve's ecosystem advantage is bigger than you think.",
    date: "May 6, 2025",
    readTime: "4 min read",
    imageUrl: "/images/industry/steam.jpg",
    href: "/analysis/steam-impossible-to-beat",
  },
  {
    id: "unreal-engine-5-6",
    slug: "unreal-engine-5-6",
    number: "03",
    category: "DEVELOPER INTERVIEW",
    title: "Inside Unreal Engine 5.6",
    description: "Epic Games on the future of game development and next-gen tools.",
    date: "May 6, 2025",
    readTime: "6 min read",
    imageUrl: "/images/industry/unreal-engine.jpg",
    href: "/analysis/unreal-engine-5-6",
  },
];

export const NEWSLETTER_DATA = {
  badge: "JOIN 45,000+ GAMERS",
  heading: "Get the best gaming news, analysis & exclusive insights delivered to your inbox.",
  placeholder: "Enter your email address",
  buttonText: "SUBSCRIBE",
  benefits: [
    "Weekly Newsletter",
    "No Spam",
    "Unsubscribe Anytime",
  ],
};

export const FOOTER_DATA = {
  mission: "Your ultimate destination for gaming news, insights, and industry analysis.",
  socialLinks: [
    { name: "Twitter", href: "https://twitter.com", platform: "twitter" as const },
    { name: "YouTube", href: "https://youtube.com", platform: "youtube" as const },
    { name: "Discord", href: "https://discord.com", platform: "discord" as const },
    { name: "Instagram", href: "https://instagram.com", platform: "instagram" as const },
  ],
  linkGroups: [
    {
      title: "EXPLORE",
      links: [
        { label: "Latest Stories", href: "#news" },
        { label: "Trending", href: "#trending" },
        { label: "Industry Analysis", href: "#analysis" },
        { label: "Hardware", href: "#hardware" },
        { label: "Features", href: "#features" },
      ],
    },
    {
      title: "COMPANY",
      links: [
        { label: "About Us", href: "#about" },
        { label: "Write for Us", href: "/write-for-us" },
        { label: "Contact", href: "#contact" },
        { label: "Advertise", href: "#advertise" },
        { label: "Careers", href: "#careers" },
      ],
    },
    {
      title: "LEGAL",
      links: [
        { label: "Privacy Policy", href: "#privacy" },
        { label: "Terms of Use", href: "#terms" },
        { label: "Cookie Policy", href: "#cookies" },
      ],
    },
  ],
  copyright: "© 2026 TheGamerX. All rights reserved.",
};
