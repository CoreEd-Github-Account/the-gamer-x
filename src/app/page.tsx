import Header from "../components/Header";
import Hero from "../components/Hero";
import LatestStories from "../components/LatestStories";
import TrendingGames from "../components/TrendingGames";
import IndustryAnalysis from "../components/IndustryAnalysis";
import LatestReviews from "../components/LatestReviews";
import GameHubs from "../components/GameHubs";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import { getAllLandingData } from "../lib/wordpress";

export default async function Home() {
  const data = await getAllLandingData();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Hero slides={data.heroSlides} />
        <LatestStories stories={data.stories} />
        <TrendingGames games={data.trendingGames} />
        <IndustryAnalysis articles={data.industryAnalyses} />
        <LatestReviews reviews={data.reviews} />
        <GameHubs hubs={data.gameHubs} />
        <Newsletter
          heading={data.globalSettings.newsletterHeading}
          subtitle={data.globalSettings.newsletterSubtitle}
          settings={data.globalSettings}
        />
      </main>
      <Footer
        aboutText={data.globalSettings.footerAboutText}
        copyrightText={data.globalSettings.copyrightText}
        twitterLink={data.globalSettings.twitterLink}
        discordLink={data.globalSettings.discordLink}
        youtubeLink={data.globalSettings.youtubeLink}
        settings={data.globalSettings}
      />
    </div>
  );
}
