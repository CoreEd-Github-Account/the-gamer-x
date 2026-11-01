import React from "react";
import type { Metadata } from "next";
import { getIndustryArticles } from "@/lib/industry";
import AnalysisArchiveClient from "./AnalysisArchiveClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Deep Industry Analysis & Market Research | TheGamerX",
  description:
    "Comprehensive executive market intelligence, studio analysis, engine tech breakdowns, and industry forecasts on TheGamerX.",
};

export default async function AnalysisArchivePage() {
  const articles = await getIndustryArticles();
  return <AnalysisArchiveClient initialArticles={articles} />;
}

