"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useUserCategories } from "@/hooks/user-use-category";
import { useGuidebook } from "@/hooks/use-guidebook";
import { FaInstagram, FaTiktok, FaLinkedin, FaGlobe } from "react-icons/fa";

const Footer = () => {
  const { guidebookUrl } = useGuidebook();

  const { data } = useUserCategories({
    limit: 10,
    page: 1,
  });
  const categories = data?.categories || [];

  const uiaCategory = categories.find(
    (c) => (c.slug || "").toUpperCase() === "UIA"
  );
  const wiaCategory = categories.find(
    (c) => (c.slug || "").toUpperCase() === "WIA"
  );

  const uiaHref = uiaCategory ? `/category/${uiaCategory.category_id}` : "/category";
  const wiaHref = wiaCategory ? `/category/${wiaCategory.category_id}` : "/category";

  return (
    <footer className="bg-[#07090E] border-t border-white/10 text-[#FFF9F5] pt-16 pb-8 relative z-10">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative h-8 w-8 aspect-square flex-shrink-0">
                <Image
                  src="/mia2026_logo.png"
                  alt="MIA Logo"
                  fill={true}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-[#FFF9F5]">
                Multimedia{" "}
                <span className="bg-gradient-to-r from-[#E01C20] via-[#FF4500] to-[#FED700] bg-clip-text text-transparent">
                  In Action 2026
                </span>
              </span>
            </Link>

            <p className="text-sm text-[#AAB1BD] leading-relaxed max-w-sm">
              Kompetisi multimedia berbasis proyek industri terbesar untuk pelajar SMA/SMK dan mahasiswa Indonesia. Wujudkan kreativitas dan inovasi digitalmu bersama kami.
            </p>
          </div>

          {/* Column 2: Kompetisi */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold text-[#FFF9F5] uppercase tracking-wider">
              Kompetisi
            </h4>
            <ul className="space-y-2 text-sm text-[#AAB1BD]">
              <li>
                <Link
                  href={uiaHref}
                  className="hover:text-[#E01C20] transition-colors"
                >
                  UIA (UI/UX In Action)
                </Link>
              </li>
              <li>
                <Link
                  href={wiaHref}
                  className="hover:text-[#E01C20] transition-colors"
                >
                  WIA (Web Development)
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  href="/category"
                  className="text-[#E01C20] hover:underline font-semibold inline-flex items-center gap-1 text-sm"
                >
                  Lihat Semua →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Informasi */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-bold text-[#FFF9F5] uppercase tracking-wider">
              Informasi
            </h4>
            <ul className="space-y-2 text-sm text-[#AAB1BD]">
              <li>
                <Link
                  href="/#timeline"
                  className="hover:text-[#E01C20] transition-colors"
                >
                  Timeline Proyek
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="hover:text-[#E01C20] transition-colors"
                >
                  FAQ (Frequently Asked Questions)
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="hover:text-[#E01C20] transition-colors"
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <a
                  href={guidebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E01C20] transition-colors"
                >
                  Panduan Lomba
                </a>
              </li>
              <li>
                <a
                  href="https://forms.gle/L2GTwsMEREkcGxh29"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E01C20] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>🐛</span>
                  <span>Laporkan Bug Web</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Kontak & Stay Connected */}
          <div className="lg:col-span-3 space-y-5">
            {/* Kontak Kami */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#FFF9F5] uppercase tracking-wider">
                Kontak Kami
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-[#AAB1BD]">
                <li>
                  <a
                    href="mailto:mia.upnvj@gmail.com"
                    className="hover:text-[#E01C20] transition-colors flex items-center gap-1.5"
                  >
                    <span>✉️</span>
                    <span>Email: <span className="text-[#FFF9F5] hover:underline">mia.upnvj@gmail.com</span></span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/6281384239173"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#E01C20] transition-colors flex items-center gap-1.5"
                  >
                    <span>📞</span>
                    <span>UIA: <span className="text-[#FFF9F5] hover:underline">+62 813-8423-9173</span> (Sabira)</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/6285894728193"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#E01C20] transition-colors flex items-center gap-1.5"
                  >
                    <span>📞</span>
                    <span>WIA: <span className="text-[#FFF9F5] hover:underline">+62 858-9472-8193</span> (Maulana)</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Stay Connected */}
            <div className="space-y-2.5 pt-2 border-t border-white/5">
              <h4 className="text-xs font-bold text-[#FFF9F5] uppercase tracking-wider">
                Stay Connected
              </h4>
              <div className="flex items-center gap-2.5 pt-0.5">
                {/* Website */}
                <a
                  href="https://www.mia2026.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#141824] border border-white/10 flex items-center justify-center text-[#AAB1BD] hover:text-[#FFF9F5] hover:bg-[#E01C20] hover:border-[#E01C20] transition-all duration-300 shadow-sm cursor-pointer"
                  aria-label="Website MIA 2026"
                  title="Website (www.mia2026.com)"
                >
                  <FaGlobe className="h-4 w-4" />
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/multimedia.in.action/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#141824] border border-white/10 flex items-center justify-center text-[#AAB1BD] hover:text-[#FFF9F5] hover:bg-[#E01C20] hover:border-[#E01C20] transition-all duration-300 shadow-sm cursor-pointer"
                  aria-label="Instagram"
                  title="Instagram (@multimedia.in.action)"
                >
                  <FaInstagram className="h-4 w-4" />
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@multimediainaction?_t=ZS-8zwQ9E8K2i1&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#141824] border border-white/10 flex items-center justify-center text-[#AAB1BD] hover:text-[#FFF9F5] hover:bg-[#E01C20] hover:border-[#E01C20] transition-all duration-300 shadow-sm cursor-pointer"
                  aria-label="TikTok"
                  title="TikTok (@multimediainaction)"
                >
                  <FaTiktok className="h-4 w-4" />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/multimedia-in-action-mia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#141824] border border-white/10 flex items-center justify-center text-[#AAB1BD] hover:text-[#FFF9F5] hover:bg-[#0077B5] hover:border-[#0077B5] transition-all duration-300 shadow-sm cursor-pointer"
                  aria-label="LinkedIn"
                  title="LinkedIn (Multimedia In Action)"
                >
                  <FaLinkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-6" />

        {/* Bottom Copyright */}
        <div className="text-center text-xs text-[#99A1AF]">
          © 2026 Multimedia in Action (MIA). All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
