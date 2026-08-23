import React from "react";
import Link from "next/link";
import { DownloadIcon, ArrowRightIcon, RocketIcon } from "@radix-ui/react-icons";

const ContactSection = () => (
  <section className="py-24 bg-transparent relative overflow-hidden">
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
        <h2 className="text-4xl sm:text-5xl md:text-[49.44px] font-bold text-[#FFF9F5] tracking-tight">
          Siap <span className="text-[#E01C20]">Berkompetisi?</span>
        </h2>

        {/* Subheading */}
        <p className="text-base sm:text-lg md:text-[18.89px] text-[#AAB1BD] max-w-xl mx-auto leading-relaxed">
          Jangan lewatkan kesempatan emas ini! Daftarkan diri Anda sekarang dan tunjukkan kreativitas terbaik Anda.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link href="/register" className="w-full sm:w-auto">
            <span className="mia-btn-primary px-9 py-4 text-base flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-900/40">
              Daftar Sekarang!
              <ArrowRightIcon className="w-4 h-4" />
            </span>
          </Link>

          <a
            href="https://drive.google.com/drive/folders/1x34lDmoqSFdOfsxUpxpe2KiAaGT2zk5m"
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

export default ContactSection;

