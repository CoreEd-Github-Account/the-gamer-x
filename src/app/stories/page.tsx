import React from "react";
import type { Metadata } from "next";
import { getStories } from "@/lib/stories";
import StoriesArchiveClient from "./StoriesArchiveClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Latest Stories & Gaming News | TheGamerX",
  description:
    "Explore the latest gaming news, breaking releases, developer features, and stories shaping the gaming world on TheGamerX.",
};

export default async function StoriesArchivePage() {
  const stories = await getStories();
  return <StoriesArchiveClient initialStories={stories} />;
}

