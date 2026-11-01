import Header from "../components/Header";
import Hero from "../components/Hero";
import LatestStories from "../components/LatestStories";
import TrendingGames from "../components/TrendingGames";
import IndustryAnalysis from "../components/IndustryAnalysis";
import Hardware from "../components/Hardware";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import { getGlobalSettings } from "../lib/wordpress";
import { getHeroSlides } from "../lib/hero";
import { getStories } from "../lib/stories";
import { getTrendingGames } from "../lib/games";
import { getIndustryArticles } from "../lib/industry";
import { getHardwareItems } from "../lib/hardware";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [heroSlides, stories, trendingGames, industryArticles, hardwareItems, globalSettings] = await Promise.all([
    getHeroSlides(),
    getStories(),
    getTrendingGames(),
    getIndustryArticles(),
    getHardwareItems(),
    getGlobalSettings(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Hero slides={heroSlides} />
        <LatestStories stories={stories} />
        <TrendingGames games={trendingGames} />
        <IndustryAnalysis articles={industryArticles} />
        <Hardware items={hardwareItems} />
        <Newsletter
          heading={globalSettings.newsletterHeading}
          subtitle={globalSettings.newsletterSubtitle}
          settings={globalSettings}
        />
      </main>
      <Footer
        aboutText={globalSettings.footerAboutText}
        copyrightText={globalSettings.copyrightText}
        twitterLink={globalSettings.twitterLink}
        discordLink={globalSettings.discordLink}
        youtubeLink={globalSettings.youtubeLink}
        settings={globalSettings}
      />
    </div>
  );
}
