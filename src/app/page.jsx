import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import CompetitionSection from "@/components/sections/CompetitionSection";
import GamificationSection from "@/components/sections/GamificationSection";
import TimelineSection from "@/components/sections/TimelineSection";
import PrizeSection from "@/components/sections/PrizeSection";
import JudgesSection from "@/components/sections/JudgesSection";
import SponsorsSection from "@/components/sections/SponsorsSection";
import FAQSection from "@/components/sections/FAQSection";
import ContactSection from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-background dark:bg-black">

      <Header />
      <main>
        <HeroSection />
        <CompetitionSection />
        <GamificationSection />
        <TimelineSection />
        <PrizeSection />
        <JudgesSection />
        <SponsorsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}