import React from "react";
import Marquee from "react-fast-marquee";
import Image from "next/image";

const SponsorsSection = () => {
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
            Didukung oleh Partner Terbaik
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Kompetisi ini terselenggara atas dukungan penuh dari partner dan
            sponsor terpercaya
          </p>
        </div>

        {/* Main Sponsor Section */}
        <div className="mb-5">
          <div className="overflow-y-hidden">
            <Marquee
              gradient={true}
              gradientColor={[255, 255, 255]}
              gradientWidth={50}
              speed={75}
              pauseOnHover={true}
              className="items-center"
            >
              {/* Cards */}
              <div className="mx-8 w-60 h-60 rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://multimediainaction.com/wp-content/uploads/2024/08/cropped-mia_2024singa-8.png"
                  alt="MIA Sponsor 1"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mx-8 w-60 h-60 rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://www.upnvj.ac.id/id/files/thumb/89f8a80e388ced3704b091e21f510755/520"
                  alt="MIA Sponsor 2"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mx-8 w-60 h-60 rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://multimediainaction.com/wp-content/uploads/2024/08/cropped-mia_2024singa-8.png"
                  alt="MIA Sponsor 3"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mx-8 w-60 h-60 rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://www.upnvj.ac.id/id/files/thumb/89f8a80e388ced3704b091e21f510755/520"
                  alt="MIA Sponsor 4"
                  className="w-full h-full object-cover"
                />
              </div>
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
