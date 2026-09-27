"use client";

import React, { useState } from "react";
import Image from "next/image";
import SectionHeader from "./ui/SectionHeader";
import { GAME_HUBS } from "../data/landingData";
import { GameHubItem } from "../types";

const HubIcon: React.FC<{
  hub: GameHubItem;
}> = ({ hub }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !hub.imageUrl) {
    return (
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm shadow-inner"
        style={{
          backgroundColor: `${hub.accentColor || "#0ea5e9"}20`,
          color: hub.accentColor || "#0ea5e9",
          border: `1px solid ${hub.accentColor || "#0ea5e9"}40`,
        }}
      >
        {hub.initials || hub.name.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <div className="relative w-11 h-9 flex items-center justify-center">
      <Image
        src={hub.imageUrl}
        alt={`${hub.name} logo`}
        width={44}
        height={36}
        onError={() => setHasError(true)}
        className="object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-200"
      />
    </div>
  );
};

export const GameHubs: React.FC = () => {
  return (
    <section className="py-8 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        title="EXPLORE GAME HUBS"
        actionText="VIEW ALL HUBS"
        actionHref="#all-hubs"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 overflow-x-auto pb-2 sm:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {GAME_HUBS.map((hub: GameHubItem) => (
          <a
            key={hub.id}
            href={hub.href || `#${hub.id}`}
            className="group flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl bg-[#0e131f] border border-white/5 hover:border-cyan-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-200 min-w-[100px] sm:min-w-0"
          >
            {/* Hub Icon Block */}
            <div className="h-10 flex items-center justify-center mb-2.5">
              <HubIcon hub={hub} />
            </div>

            {/* Game Name */}
            <span className="text-[11px] font-bold text-slate-300 group-hover:text-white transition-colors text-center truncate w-full">
              {hub.name}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default GameHubs;
