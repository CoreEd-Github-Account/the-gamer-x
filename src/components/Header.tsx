"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SITE_INFO, NAV_LINKS } from "../data/landingData";

export interface HeaderProps {
  logoUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({ logoUrl }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [logoError, setLogoError] = useState(false);

  const activeLogo = logoUrl || SITE_INFO.logoUrl || "/logo.png";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#080b11]/90 backdrop-blur-md transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Brand Logo & Wordmark */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden border border-cyan-500/30 group-hover:border-cyan-400/60 shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-500/40 bg-[#080b11] transition-all">
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
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-cyan-400 to-blue-600 font-black text-white text-base">
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
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-8" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`relative py-2 text-xs lg:text-[13px] font-bold tracking-wider transition-colors duration-150 ${
                  link.isActive
                    ? "text-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {link.label}
                {link.isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                )}
              </a>
            ))}
          </nav>

          {/* Right Action Icons: Search & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Toggle */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center gap-2 bg-slate-900/90 border border-cyan-500/40 rounded-full px-3 py-1.5 transition-all">
                  <svg
                    className="w-4 h-4 text-cyan-400"
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
                    className="text-slate-400 hover:text-white text-xs p-0.5"
                    aria-label="Close search"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
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

            {/* Hamburger Button (Mobile & Tablet) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
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
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold tracking-wider ${
                link.isActive
                  ? "bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400"
                  : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <span>{link.label}</span>
              {link.isActive && (
                <span className="text-xs text-cyan-400 font-mono">Active</span>
              )}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
