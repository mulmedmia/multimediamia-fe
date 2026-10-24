import React from "react";
import {
  StarFilledIcon,
  BookmarkIcon,
  ArrowRightIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";

const GamificationSection = () => {
  const features = [
    {
      icon: <span className="text-2xl select-none">💎</span>,
      iconBg: "bg-cyan-500/15 border-cyan-500/30",
      title: "Kumpulkan XP & Diamond",
      description:
        "Dapatkan XP dan Diamond dari setiap aktivitas di dalam platform, mulai dari tahap pendaftaran, pengerjaan misi harian dan mingguan, kuis, hingga pengumpulan karya secara tepat waktu. Semakin aktif dan konsisten timmu, semakin besar reward yang menanti!",
    },
    {
      icon: <span className="text-2xl select-none">🏆</span>,
      iconBg: "bg-amber-500/15 border-amber-500/30",
      title: "Leaderboard Kompetitif",
      description:
        "Pantau peringkat posisi tim kamu secara real-time di leaderboard publik. Bersainglah secara sportif dengan ratusan tim dari seluruh Indonesia untuk membuktikan siapa Architects of Change yang paling produktif!",
    },
    {
      icon: <span className="text-2xl select-none">🎁</span>,
      iconBg: "bg-rose-500/15 border-rose-500/30",
      title: "Tukar dengan Hadiah",
      description:
        "Tukarkan Diamonds yang terkumpul dengan berbagai reward eksklusif, mulai dari token kelas dicoding, hingga tiket spesial untuk mendapatkan akses konsultasi 1-on-1 secara langsung bersama mentor profesional.",
    },
  ];

  return (
    <section id="leaderboard" className="py-20 relative">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-14 space-y-4">
          <div className="inline-block">
            <span className="mia-pill-badge">
              <StarFilledIcon className="h-3.5 w-3.5 text-[#FED700]" />
              <span>Fitur Gamifikasi & Leaderboard</span>
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-[30.56px] font-bold text-[#FFF9F5] tracking-tight">
            Lebih dari <span className="text-[#E01C20]">Sekadar Kompetisi</span>
          </h2>

          <p className="text-base md:text-[18.89px] text-[#AAB1BD] max-w-2xl mx-auto leading-relaxed">
            Kami menghadirkan pengalaman kompetisi yang lebih seru, interaktif, dan menantang dengan sistem gamifikasi dan leaderboard kompetitif.
          </p>
        </div>

        {/* 3-Column Desktop Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, i) => (
            <div
              key={i}
              className="mia-card p-8 hover:-translate-y-1 hover:border-[#E01C20]/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Icon Container */}
                <div
                  className={`w-12 h-12 rounded-xl border ${feature.iconBg} flex items-center justify-center`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold text-[#FFF9F5]">
                  {feature.title}
                </h3>

                <p className="text-sm text-[#AAB1BD] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link href="/leaderboard" className="inline-block">
            <span className="mia-btn-secondary px-8 py-3 text-base inline-flex items-center gap-2 cursor-pointer">
              Lihat Leaderboard
              <ArrowRightIcon className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GamificationSection;

