import React from 'react'
import Image from 'next/image';

const SponsorsSection = () => {
  return (
    <section id="sponsors" className="py-16 bg-background dark:bg-black/95">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground dark:text-white mb-2">
              Didukung oleh Partner Terbaik
            </h2>
            <p className="text-muted-foreground dark:text-gray-400">
              Kompetisi ini terselenggara atas dukungan penuh dari partner kami.
            </p>
        </div>
        <div className="flex justify-center items-center">
             <div className="relative w-full max-w-4xl h-80 rounded-lg overflow-hidden shadow-2xl">
                <Image
                    src="https://images.pexels.com/photos/3775157/pexels-photo-3775157.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Sponsor Utama"
                    fill
                    className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <h3 className="text-white text-4xl font-extrabold tracking-wider">
                        PARTNER EVENT
                    </h3>
                </div>
             </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection