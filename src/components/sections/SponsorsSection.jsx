import React from "react";
import Marquee from "react-fast-marquee";
import Image from "next/image";

const sponsors = [
  { src: "/sponsor/dicoding_logo.avif?v=2", name: "Dicoding" },
  { src: "/sponsor/dewabiz_logo.avif?v=2", name: "Dewabiz" },
  { src: "/sponsor/yup_logo.avif", name: "YUP" },
  { src: "/sponsor/spark_logo.avif", name: "Shopee Spark" },
];

const SponsorsSection = () => {
  return (
    <section id="sponsors" className="py-20 relative content-visibility-auto">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-14 space-y-4">
          <div className="inline-block">
            <span className="mia-pill-badge shadow-md">
              <span className="text-[#FED700]">◆</span>
              <span>Partner Kami</span>
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-[32px] font-bold text-[#FFF9F5] tracking-tight">
            Didukung oleh <span className="text-[#FED700]">Sponsor Terbaik</span>
          </h2>

          <p className="text-base md:text-[18px] text-[#AAB1BD] max-w-3xl mx-auto leading-relaxed">
            Kompetisi ini terselenggara atas dukungan penuh dari jajaran sponsor dan mitra industri terpercaya yang peduli pada akselerasi talenta digital Indonesia.
          </p>
        </div>

        {/* Sponsor Marquee Carousel with AVIF Logos */}
        <div className="overflow-hidden py-2">
          <Marquee
            gradient={true}
            gradientColor="#0A0D14"
            gradientWidth={80}
            speed={45}
            pauseOnHover={true}
            className="items-center"
          >
            {sponsors.concat(sponsors).concat(sponsors).map((sponsor, index) => (
              <div
                key={index}
                className="mia-card mx-3.5 w-52 sm:w-56 h-36 p-5 flex flex-col items-center justify-center gap-3 border border-border/40 hover:border-[#FED700]/50 transition-all duration-300 group shadow-xl bg-[#0F121A]/80 backdrop-blur-sm rounded-2xl"
              >
                <div className="relative w-36 h-18 flex items-center justify-center">
                  <Image
                    src={sponsor.src}
                    alt={sponsor.name}
                    width={140}
                    height={70}
                    className="max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <span className="text-xs font-semibold text-[#AAB1BD] group-hover:text-[#FFF9F5] transition-colors flex items-center gap-1.5">
                  <span className="text-[#FED700] text-[10px]">◆</span>
                  {sponsor.name}
                </span>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
