import React from "react";
import type { Metadata } from "next";
import { getTrendingGames } from "@/lib/games";
import GamesArchiveClient from "./GamesArchiveClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trending Games & Game Hubs | TheGamerX",
  description:
    "Explore the top trending gaming titles, active hubs, ratings, and upcoming blockbusters on TheGamerX.",
};

export default async function GamesArchivePage() {
  const games = await getTrendingGames();
  return <GamesArchiveClient initialGames={games} />;
}

