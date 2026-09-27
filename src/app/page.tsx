import Header from "../components/Header";
import Hero from "../components/Hero";
import LatestStories from "../components/LatestStories";
import TrendingGames from "../components/TrendingGames";
import IndustryAnalysis from "../components/IndustryAnalysis";
import LatestReviews from "../components/LatestReviews";
import GameHubs from "../components/GameHubs";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Hero />
        <LatestStories />
        <TrendingGames />
        <IndustryAnalysis />
        <LatestReviews />
        <GameHubs />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
