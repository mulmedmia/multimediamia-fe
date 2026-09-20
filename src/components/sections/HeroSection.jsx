"use client";

import React from "react";
import Link from "next/link";
import { DownloadIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useAuthContext } from "@/providers/AuthProvider";
import { useGuidebook } from "@/hooks/use-guidebook";

const HeroSection = () => {
  const { user } = useAuthContext();
  const { guidebookUrl } = useGuidebook();

  const handleDaftarClick = (e) => {
    if (user) {
      e.preventDefault();
      const el = document.getElementById("lomba");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", "/#lomba");
      }
    }
  };
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
              <span>Kompetisi Digital Indonesia 2026</span>
            </span>
          </div>

          {/* Main Two-Tone Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-[52px] lg:text-[64px] font-bold text-[#FFF9F5] tracking-tight leading-[1.1]">
            <span className="inline-flex items-center justify-center gap-3 sm:gap-4 md:gap-5 flex-wrap">
              <div className="relative h-12 sm:h-16 md:h-20 lg:h-24 w-auto aspect-square drop-shadow-[0_0_25px_rgba(224,28,32,0.5)]">
                <Image
                  src="/mia2026_logo.png"
                  alt="MIA Logo"
                  sizes="(min-width: 1024px) 96px, (min-width: 768px) 80px, (min-width: 640px) 64px, 48px"
                  fill={true}
                  priority={true}
                  className="object-contain"
                />
              </div>
              <span>
                Multimedia{" "}
                <span className="bg-gradient-to-r from-[#E01C20] via-[#FF4500] to-[#FED700] bg-clip-text text-transparent">
                  In Action 2026
                </span>
              </span>
            </span>
            <span className="block text-2xl sm:text-3xl md:text-[36px] font-bold text-[#AAB1BD] mt-3 font-sans">
              From Visionaries to Architects of Change
            </span>
          </h1>

          {/* Body Copy */}
          <p className="text-base sm:text-lg md:text-[18.89px] text-[#AAB1BD] max-w-2xl mx-auto leading-relaxed">
            Jangan biarkan inovasimu hanya sebatas wacana! Tunjukkan skill teknis dan kreativitas tim kamu dalam 2 kategori lomba bergengsi:{" "}
            <span className="font-semibold text-[#E01C20]">
              Web Development
            </span>{" "}
            dan{" "}
            <span className="font-semibold text-[#E01C20]">UI/UX Design</span>.
            <br className="hidden sm:inline" />{" "}
            <span className="font-medium text-[#FFF9F5]">Dream It. Build It. Change It.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              href={user ? "/#lomba" : "/register"}
              className="w-full sm:w-auto"
              onClick={handleDaftarClick}
            >
              <span className="mia-btn-primary px-8 py-3.5 text-base flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-900/30">
                Daftar Sekarang
                <ArrowRightIcon className="w-4 h-4" />
              </span>
            </Link>

            <a
              href={guidebookUrl}
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
