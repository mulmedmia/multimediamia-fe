import React from "react";
import Marquee from "react-fast-marquee";
import Image from "next/image";
import linkaja from "../../../public/linkaja.png";
import sariroti from "../../../public/sariroti.png";
import tokocrypto from "../../../public/tokocrypto.png";
import miaLogo from "../../../public/MIALOGO.png";

const SponsorsSection = () => {
  const sponsors = [
    { src: linkaja, alt: "LinkAja Sponsor" },
    { src: sariroti, alt: "Sari Roti Sponsor" },
    { src: tokocrypto, alt: "Tokocrypto Sponsor" },
    { src: miaLogo, alt: "MIA Sponsor" },
  ];

  return (
    <section id="sponsors" className="py-16 bg-background dark:bg-black">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
            <svg
              className="h-6 w-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Didukung oleh Sponsor Terbaik
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Kompetisi ini terselenggara atas dukungan penuh dari sponsor
            terpercaya
          </p>
        </div>

        {/* Main Sponsor Section */}
        <div className="mb-5">
          <div className="overflow-y-hidden">
            <Marquee
              gradient={false}
              speed={75}
              pauseOnHover={true}
              className="items-center"
            >
              {sponsors.map((sponsor, index) => (
                <div
                  key={index}
                  className="mx-2 w-60 h-60 rounded-lg overflow-hidden border border-gray-300"
                >
                  <Image
                    src={sponsor.src}
                    alt={sponsor.alt}
                    width={240}
                    height={240}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {sponsors.map((sponsor, index) => (
                <div
                  key={`dup-${index}`}
                  className="mx-2 w-60 h-60 rounded-lg overflow-hidden border border-gray-300"
                >
                  <Image
                    src={sponsor.src}
                    alt={sponsor.alt}
                    width={240}
                    height={240}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
