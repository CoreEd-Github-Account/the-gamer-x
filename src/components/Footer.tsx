import React from "react";
import { SITE_INFO, FOOTER_DATA } from "../data/landingData";
import { GlobalSettings } from "../types";

const SocialIcon: React.FC<{ platform: string }> = ({ platform }) => {
  switch (platform) {
    case "twitter":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "discord":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    default:
      return null;
  }
};

export interface FooterProps {
  aboutText?: string;
  copyrightText?: string;
  twitterLink?: string;
  discordLink?: string;
  youtubeLink?: string;
  settings?: GlobalSettings;
}

export const Footer: React.FC<FooterProps> = ({
  aboutText,
  copyrightText,
  twitterLink,
  discordLink,
  youtubeLink,
  settings,
}) => {
  const mission =
    aboutText ||
    settings?.footerAboutText ||
    FOOTER_DATA.mission;

  const copyright =
    copyrightText ||
    settings?.copyrightText ||
    FOOTER_DATA.copyright;

  const twitterHref =
    twitterLink ||
    settings?.twitterLink ||
    FOOTER_DATA.socialLinks.find((s) => s.platform === "twitter")?.href ||
    "https://twitter.com";

  const youtubeHref =
    youtubeLink ||
    settings?.youtubeLink ||
    FOOTER_DATA.socialLinks.find((s) => s.platform === "youtube")?.href ||
    "https://youtube.com";

  const discordHref =
    discordLink ||
    settings?.discordLink ||
    FOOTER_DATA.socialLinks.find((s) => s.platform === "discord")?.href ||
    "https://discord.com";

  const instagramHref =
    FOOTER_DATA.socialLinks.find((s) => s.platform === "instagram")?.href ||
    "https://instagram.com";

  const socialLinks = [
    { name: "Twitter", href: twitterHref, platform: "twitter" as const },
    { name: "YouTube", href: youtubeHref, platform: "youtube" as const },
    { name: "Discord", href: discordHref, platform: "discord" as const },
    { name: "Instagram", href: instagramHref, platform: "instagram" as const },
  ];

  return (
    <footer className="w-full border-t border-white/10 bg-[#06090f] pt-12 sm:pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-white/5">
          {/* Brand & Socials Column (2 cols wide on desktop) */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              {/* Brand Logo */}
              <div className="flex items-center gap-3 mb-3">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-cyan-400 to-blue-600 shadow-sm shadow-cyan-500/20">
                  <span className="font-black text-white text-base tracking-tighter">
                    {SITE_INFO.logoLetter}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-lg tracking-wider text-white leading-none">
                    {SITE_INFO.name}
                  </span>
                  <span className="text-[9px] font-semibold tracking-widest text-slate-400 uppercase mt-0.5">
                    {SITE_INFO.tagline}
                  </span>
                </div>
              </div>

              {/* Mission Statement */}
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-6 font-normal">
                {mission}
              </p>
            </div>

            {/* Social Icons Row */}
            <div className="flex items-center gap-2.5">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-400 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
                >
                  <SocialIcon platform={item.platform} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links Columns */}
          {FOOTER_DATA.linkGroups.map((group) => (
            <div key={group.title} className="flex flex-col">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-white mb-4">
                {group.title}
              </h4>
              <ul className="space-y-2.5 text-xs">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-slate-400 hover:text-cyan-400 transition-colors duration-150 inline-block py-0.5 font-medium"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>{copyright}</p>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#privacy" className="hover:text-slate-400 transition-colors">Privacy</a>
            <span>&bull;</span>
            <a href="#terms" className="hover:text-slate-400 transition-colors">Terms</a>
            <span>&bull;</span>
            <a href="#cookies" className="hover:text-slate-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
