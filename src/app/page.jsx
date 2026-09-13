import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import HomeCategoryPreview from "@/components/sections/HomeCategoryPreview";
import GamificationSection from "@/components/sections/GamificationSection";
import TimelineSection from "@/components/sections/TimelineSection";
import SponsorsSection from "@/components/sections/SponsorsSection";
import FAQSection from "@/components/sections/FAQSection";
import ContactSection from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-[#0A0D14] mia-connected-bg text-[#FFF9F5] relative overflow-hidden selection:bg-[#E01C20] selection:text-white">
      <Header />
      <main className="relative z-10 space-y-16 md:space-y-24">
        <HeroSection />
        <HomeCategoryPreview />
        <GamificationSection />
        <TimelineSection />
        <SponsorsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
