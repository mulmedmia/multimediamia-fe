"use client";

import React from "react";
import Link from "next/link";
import { DownloadIcon, ArrowRightIcon, RocketIcon } from "@radix-ui/react-icons";
import { useAuthContext } from "@/providers/AuthProvider";
import { useGuidebook } from "@/hooks/use-guidebook";

const ContactSection = () => {
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
    <section className="py-24 bg-transparent relative overflow-hidden content-visibility-auto">
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Eyebrow Badge */}
          <div className="inline-block">
            <span className="mia-pill-badge shadow-md">
              <RocketIcon className="h-3.5 w-3.5 text-[#E01C20]" />
              <span>Mulai Berkompetisi</span>
            </span>
          </div>

          {/* Closing CTA Headline */}
          <h2 className="text-4xl sm:text-5xl md:text-[48px] font-bold text-[#FFF9F5] tracking-tight">
            Siap menjadi <span className="text-[#E01C20]">Architects of Change?</span>
          </h2>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-[18.89px] text-[#AAB1BD] max-w-2xl mx-auto leading-relaxed">
            Jangan lewatkan kesempatan emas ini! Daftarkan tim kamu sekarang dan wujudkan solusi inovatifmu bersama MIA 2026.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              href={user ? "/#lomba" : "/register"}
              className="w-full sm:w-auto"
              onClick={handleDaftarClick}
            >
              <span className="mia-btn-primary px-9 py-4 text-base flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-900/40">
                Daftar Sekarang!
                <ArrowRightIcon className="w-4 h-4" />
              </span>
            </Link>

            <a
              href={guidebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <span className="mia-btn-secondary px-8 py-4 text-base flex items-center justify-center gap-2 cursor-pointer">
                <DownloadIcon className="w-4 h-4" />
                Download Panduan
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
