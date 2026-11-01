"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_INFO, NAV_LINKS } from "../data/landingData";
import { useGamerAuth } from "../context/GamerAuthContext";

export interface HeaderProps {
  logoUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({ logoUrl }) => {
  const pathname = usePathname();
  const { currentGamer, openAuthModal, logout } = useGamerAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [logoError, setLogoError] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("latest-stories");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const activeLogo = logoUrl || SITE_INFO.logoUrl || "/logo.png";

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["latest-stories", "trending", "analysis", "hardware"];
      const scrollY = window.scrollY + 140;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(sections[i]);
          return;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    const hash = href.includes("#") ? href.substring(href.indexOf("#") + 1) : "";
    if (hash) {
      const targetElement =
        document.getElementById(hash) ||
        (hash === "latest-stories" ? document.getElementById("news") : null) ||
        (hash === "news" ? document.getElementById("latest-stories") : null) ||
        (hash === "trending" ? document.getElementById("trending-games") : null) ||
        (hash === "analysis" ? document.getElementById("industry-analysis") : null);

      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", `#${hash}`);
        setActiveSection(hash);
        setMobileMenuOpen(false);
        return;
      }
    }
    setMobileMenuOpen(false);
  };

  const isLinkActive = (href: string, defaultActive?: boolean): boolean => {
    if (pathname?.startsWith("/forum") && href === "/forum") {
      return true;
    }
    if (pathname?.startsWith("/write-for-us") && href === "/write-for-us") {
      return true;
    }
    if (pathname !== "/" && href !== pathname) {
      return false;
    }
    if (href.includes(activeSection)) return true;
    if (
      activeSection === "latest-stories" &&
      (href.includes("news") || href.includes("latest-stories"))
    ) {
      return true;
    }
    if (!href.includes("#") && defaultActive) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#080b11]/90 backdrop-blur-md transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Brand Logo & Wordmark */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden border border-blue-500/30 group-hover:border-blue-400/60 shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 bg-[#080b11] transition-all">
              {!logoError && activeLogo ? (
                <Image
                  src={activeLogo}
                  alt={`${SITE_INFO.name} logo`}
                  width={40}
                  height={40}
                  priority
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 font-black text-white text-base">
                  {SITE_INFO.logoLetter}
                </div>
              )}
            </div>
            <div className="flex items-center">
              <Image
                src="/images/thegamerx-wordmark.png"
                alt={SITE_INFO.name}
                width={160}
                height={24}
                priority
                className="h-5 sm:h-6 md:h-6.5 w-auto object-contain group-hover:brightness-110 transition-all drop-shadow-[0_0_8px_rgba(1,71,252,0.35)]"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-8" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href, link.isActive);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative py-2 text-xs lg:text-[13px] font-bold tracking-wider transition-colors duration-150 cursor-pointer ${
                    active
                      ? "text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Icons: Search & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Toggle */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center gap-2 bg-slate-900/90 border border-blue-500/40 rounded-full px-3 py-1.5 transition-all">
                  <svg
                    className="w-4 h-4 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search stories, games..."
                    className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-36 sm:w-48"
                    autoFocus
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="text-slate-400 hover:text-white text-xs p-0.5 cursor-pointer"
                    aria-label="Close search"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
                  aria-label="Search articles"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Gamer Account Button (Desktop & Mobile) */}
            <div className="relative">
              {currentGamer ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 py-1 px-2.5 rounded-full bg-slate-900 border border-blue-500/40 hover:border-blue-400 text-xs transition-all cursor-pointer group shadow-sm shadow-blue-500/10"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-[10px] text-white">
                      {currentGamer.displayName?.charAt(0) || currentGamer.username.charAt(0)}
                    </div>
                    <span className="font-bold text-white max-w-[90px] truncate hidden sm:inline">
                      {currentGamer.displayName || currentGamer.username}
                    </span>
                    <span
                      className="hidden sm:inline px-1.5 py-0.2 rounded text-[9px] font-bold text-white"
                      style={{ backgroundColor: currentGamer.badgeColor || "#2563eb" }}
                    >
                      {currentGamer.badge}
                    </span>
                    <svg className="w-3 h-3 text-slate-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Gamer Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#0e1320] border border-white/10 shadow-2xl py-2 z-50 animate-in fade-in duration-150">
                      <div className="px-3 py-2 border-b border-white/10">
                        <p className="text-xs font-bold text-white">{currentGamer.displayName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">@{currentGamer.username}</p>
                        {currentGamer.steamId && (
                          <p className="text-[9px] text-slate-500 mt-1">Steam: {currentGamer.steamId}</p>
                        )}
                      </div>
                      <Link
                        href="/forum"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                      >
                        <span>💬</span>
                        <span>My Community Discussions</span>
                      </Link>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openAuthModal();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer text-left"
                      >
                        <span>🔄</span>
                        <span>Switch Gamer Profile</span>
                      </button>
                      <div className="border-t border-white/10 my-1" />
                      <button
                        onClick={async () => {
                          setUserDropdownOpen(false);
                          await logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
                      >
                        <span>🚪</span>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 hover:text-blue-300 border border-blue-500/30 text-xs font-bold transition-all cursor-pointer shadow-sm shadow-blue-500/10"
                >
                  <span className="text-[11px]">🎮</span>
                  <span className="hidden sm:inline">Sign In / Join</span>
                  <span className="sm:hidden">Join</span>
                </button>
              )}
            </div>

            {/* Hamburger Button (Mobile) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0b0f19] px-4 pt-3 pb-5 space-y-1 shadow-2xl animate-in slide-in-from-top duration-200">
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link.href, link.isActive);
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold tracking-wider cursor-pointer ${
                  active
                    ? "bg-blue-500/10 text-blue-400 border-l-2 border-blue-500"
                    : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <span>{link.label}</span>
                {active && (
                  <span className="text-xs text-blue-400 font-mono">Active</span>
                )}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Header;
