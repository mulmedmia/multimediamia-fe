"use client";

import React from "react";
import Link from "next/link";
import { DownloadIcon, ArrowRightIcon } from "@radix-ui/react-icons";

const HeroSection = () => {
  return (
    <section
      id="beranda"
      className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 bg-transparent overflow-hidden"
    >
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Eyebrow Pill Badge */}
          <div className="inline-block">
            <span className="mia-pill-badge shadow-md">
              <span className="text-amber-400">🔥</span>
              <span>Kompetisi Digital Indonesia 2025</span>
            </span>
          </div>

          {/* Main Two-Tone Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-[52px] lg:text-[64px] font-bold text-[#FFF9F5] tracking-tight leading-[1.1]">
            <span className="inline-flex items-center justify-center gap-3 sm:gap-4 md:gap-5 flex-wrap">
              <img
                src="/mia2026_logo.png"
                alt="MIA Logo"
                className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto object-contain drop-shadow-[0_0_25px_rgba(224,28,32,0.5)]"
              />
              <span>
                Multimedia{" "}
                <span className="bg-gradient-to-r from-[#E01C20] via-[#FF4500] to-[#FED700] bg-clip-text text-transparent">
                  in Action
                </span>
              </span>
            </span>
            <span className="block text-2xl sm:text-3xl md:text-[36px] font-bold text-[#AAB1BD] mt-3 font-sans">
              Kompetisi Digital Creative
            </span>
          </h1>

          {/* Body Copy */}
          <p className="text-base sm:text-lg md:text-[18.89px] text-[#AAB1BD] max-w-2xl mx-auto leading-relaxed">
            Tunjukkan kreativitas dan inovasi Anda dalam 2 kategori lomba:{" "}
            <span className="font-semibold text-[#E01C20]">
              Website Development
            </span>
            , dan{" "}
            <span className="font-semibold text-[#E01C20]">
              UI/UX Design
            </span>
            .
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/register" className="w-full sm:w-auto">
              <span className="mia-btn-primary px-8 py-3.5 text-base flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-900/30">
                Daftar Sekarang
                <ArrowRightIcon className="w-4 h-4" />
              </span>
            </Link>

            <a
              href="https://drive.google.com/drive/folders/1x34lDmoqSFdOfsxUpxpe2KiAaGT2zk5m?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <span className="mia-btn-secondary px-8 py-3.5 text-base flex items-center justify-center gap-2 cursor-pointer">
                <DownloadIcon className="w-4 h-4" />
                Lihat Guidebook
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

