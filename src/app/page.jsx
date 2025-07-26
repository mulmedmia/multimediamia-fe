import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import HomeCategoryPreview from "@/components/sections/HomeCategoryPreview"; // <-- GANTI DENGAN IMPORT INI
import GamificationSection from "@/components/sections/GamificationSection";
import TimelineSection from "@/components/sections/TimelineSection";
import PrizeSection from "@/components/sections/PrizeSection";
import JudgesSection from "@/components/sections/JudgesSection";
import SponsorsSection from "@/components/sections/SponsorsSection";
import FAQSection from "@/components/sections/FAQSection";
import ContactSection from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full relative">
      {/* Light Mode Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:hidden"></div>

      {/* Dark Mode Background */}
      <div className="hidden dark:block absolute inset-0 -z-10 h-full w-full bg-black">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#7f1d1d36,#000)]"></div>
      </div>

      <Header />
      <main>
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
