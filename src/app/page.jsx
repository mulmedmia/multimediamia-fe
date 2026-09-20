import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import HomeCategoryPreview from "@/components/sections/HomeCategoryPreview";

// Dynamic imports untuk section di bawah lipatan layar (below-the-fold)
// Memotong ukuran bundle awal secara signifikan dan meningkatkan skor TBT/LCP
const GamificationSection = dynamic(
  () => import("@/components/sections/GamificationSection"),
  {
    loading: () => <div className="min-h-[360px]" />,
  }
);

const TimelineSection = dynamic(
  () => import("@/components/sections/TimelineSection"),
  {
    loading: () => <div className="min-h-[360px]" />,
  }
);

const SponsorsSection = dynamic(
  () => import("@/components/sections/SponsorsSection"),
  {
    loading: () => <div className="min-h-[220px]" />,
  }
);

const MediaPartnerSection = dynamic(
  () => import("@/components/sections/MediaPartnerSection"),
  {
    loading: () => <div className="min-h-[260px]" />,
  }
);

const FAQSection = dynamic(
  () => import("@/components/sections/FAQSection"),
  {
    loading: () => <div className="min-h-[360px]" />,
  }
);

const ContactSection = dynamic(
  () => import("@/components/sections/ContactSection"),
  {
    loading: () => <div className="min-h-[280px]" />,
  }
);

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
        <MediaPartnerSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
