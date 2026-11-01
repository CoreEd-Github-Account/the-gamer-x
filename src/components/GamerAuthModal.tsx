"use client";

import React, { useState } from "react";
import { useGamerAuth } from "../context/GamerAuthContext";

export const GamerAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    login,
    register,
    loginDemo,
    authError,
    clearError,
  } = useGamerAuth();

  const [mode, setMode] = useState<"demo" | "login" | "register">("demo");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [steamId, setSteamId] = useState("");
  const [psnId, setPsnId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleTabChange = (newMode: "demo" | "login" | "register") => {
    clearError();
    setMode(newMode);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await login(username, password);
    setIsSubmitting(false);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await register({
      username,
      password,
      displayName,
      steamId,
      psnId,
    });
    setIsSubmitting(false);
  };

  const handleDemoSelect = async (demoUsername: string) => {
    setIsSubmitting(true);
    await loginDemo(demoUsername);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0e1320] border border-blue-500/40 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-r from-blue-950/40 via-[#0e1320] to-[#0e1320]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-sm">
              🎮
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Gamer Account</h3>
              <p className="text-[11px] text-slate-400">Join discussions & earn community karma</p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="text-slate-400 hover:text-white p-1 text-base cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 p-2 bg-[#090d16] border-b border-white/5 gap-1">
          <button
            onClick={() => handleTabChange("demo")}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === "demo"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ⚡ 1-Click Demo
          </button>
          <button
            onClick={() => handleTabChange("login")}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === "login"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🔑 Sign In
          </button>
          <button
            onClick={() => handleTabChange("register")}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === "register"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            + New Profile
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5">
          {authError && (
            <div className="mb-4 p-2.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{authError}</span>
            </div>
          )}

          {/* Mode 1: 1-Click Demo Profiles */}
          {mode === "demo" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Select an existing demo gamer profile to test live discussions, replies, and reactions instantly without filling out a form:
              </p>

              {[
                {
                  username: "Ubaid_GX",
                  name: "Ubaid GX",
                  badge: "Staff",
                  color: "#2563eb",
                  desc: "Lead Founder & Admin",
                },
                {
                  username: "CircuitBreaker",
                  name: "Circuit Breaker",
                  badge: "Hardware Guru",
                  color: "#d97706",
                  desc: "GPU undervolting & tech benchmarks",
                },
                {
                  username: "ValkyrieRunner",
                  name: "Valkyrie",
                  badge: "Day 1 Gamer",
                  color: "#7c3aed",
                  desc: "Speedrunner & Action RPG grinder",
                },
                {
                  username: "TarnishedLore",
                  name: "Tarnished Lore",
                  badge: "Pro Reviewer",
                  color: "#2563eb",
                  desc: "Worldbuilding deep dives",
                },
              ].map((gamer) => (
                <button
                  key={gamer.username}
                  disabled={isSubmitting}
                  onClick={() => handleDemoSelect(gamer.username)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#090d16] hover:bg-slate-800/80 border border-white/5 hover:border-blue-500/40 transition-all text-left cursor-pointer group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center font-bold text-white text-xs shadow-sm">
                      {gamer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                          {gamer.name}
                        </span>
                        <span
                          className="px-1.5 py-0.2 rounded text-[9px] font-bold text-white"
                          style={{ backgroundColor: gamer.color }}
                        >
                          {gamer.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">{gamer.desc}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-400 group-hover:translate-x-0.5 transition-transform">
                    Play as &rarr;
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Mode 2: Standard Sign In */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  GamerTag / Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Ubaid_GX"
                  className="w-full px-3 py-2.5 bg-[#080b11] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Default demo password: gaming2026"
                  className="w-full px-3 py-2.5 bg-[#080b11] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Signing in..." : "Sign In to TheGamerX"}
              </button>
            </form>
          )}

          {/* Mode 3: Create New Profile */}
          {mode === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  GamerTag / Handle *
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. ShadowSniper"
                  className="w-full px-3 py-2 bg-[#080b11] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Shadow Sniper"
                    className="w-full px-3 py-2 bg-[#080b11] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full px-3 py-2 bg-[#080b11] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Steam ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={steamId}
                    onChange={(e) => setSteamId(e.target.value)}
                    placeholder="e.g. Sniper99"
                    className="w-full px-3 py-2 bg-[#080b11] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    PSN ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={psnId}
                    onChange={(e) => setPsnId(e.target.value)}
                    placeholder="e.g. Ghost_Sniper"
                    className="w-full px-3 py-2 bg-[#080b11] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Creating Profile..." : "Create Gamer Profile & Join"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamerAuthModal;

