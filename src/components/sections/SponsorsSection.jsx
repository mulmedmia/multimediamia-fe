import React from "react";
import Marquee from "react-fast-marquee";
import Image from "next/image";
import linkaja from "../../../public/linkaja.png";
import sariroti from "../../../public/sariroti.png";
import tokocrypto from "../../../public/tokocrypto.png";
import miaLogo from "../../../public/mia2026_logo.png";

const SponsorsSection = () => {
  const sponsors = [
    { src: linkaja, name: "LinkAja" },
    { src: sariroti, name: "Sari Roti" },
    { src: tokocrypto, name: "Tokocrypto" },
    { src: miaLogo, name: "MIA UPNVJ" },
  ];

  return (
    <section id="sponsors" className="py-20 relative">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-14 space-y-4">
          <div className="inline-block">
            <span className="mia-pill-badge">
              <span className="text-[#FED700]">◆</span>
              <span>Partner Kami</span>
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-[30.56px] font-bold text-[#FFF9F5] tracking-tight">
            Didukung oleh <span className="text-[#FED700]">Sponsor Terbaik</span>
          </h2>

          <p className="text-base md:text-[18.89px] text-[#AAB1BD] max-w-2xl mx-auto leading-relaxed">
            Kompetisi ini terselenggara atas dukungan penuh dari sponsor terpercaya
          </p>
        </div>

        {/* Sponsor Marquee with MIA Cards */}
        <div className="overflow-hidden py-2">
          <Marquee
            gradient={true}
            gradientColor="#0A0D14"
            gradientWidth={80}
            speed={50}
            pauseOnHover={true}
            className="items-center"
          >
            {sponsors.concat(sponsors).map((sponsor, index) => (
              <div
                key={index}
                className="mia-card mx-3 w-48 h-32 p-4 flex flex-col items-center justify-center gap-2 hover:border-[#FED700]/50 transition-all duration-300 group"
              >
                <div className="relative w-20 h-16 flex items-center justify-center">
                  <Image
                    src={sponsor.src}
                    alt={sponsor.name}
                    width={80}
                    height={60}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <span className="text-xs font-semibold text-[#AAB1BD] group-hover:text-[#FFF9F5] transition-colors flex items-center gap-1">
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

