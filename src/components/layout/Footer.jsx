"use client";

import React from "react";
import Link from "next/link";
import { useUserCategories } from "@/hooks/user-use-category";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { EnvelopeClosedIcon, MobileIcon } from "@radix-ui/react-icons";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const { data } = useUserCategories({
    limit: 10,
    page: 1,
    status: "VERIFIED",
  });
  const categories = data?.categories || [];

  return (
    <footer className="bg-[#07090E] border-t border-white/10 text-[#FFF9F5] pt-16 pb-8 relative z-10">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Main Footer Content - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8 aspect-square">
                <Image
                  src="/mia2026_logo.png"
                  alt="Logo"
                  fill={true}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-[#FFF9F5]">
                Multimedia <span className="text-[#E01C20]">in Action</span>
              </span>
            </Link>

            <p className="text-sm text-[#AAB1BD] leading-relaxed">
              Kompetisi multimedia terbesar untuk mahasiswa Indonesia. Wujudkan
              kreativitas dan inovasi digital Anda bersama kami.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href="https://www.instagram.com/multimedia.in.action?igsh=bGtvMWZpNDExbDVj"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1E2939] border border-white/10 flex items-center justify-center text-[#AAB1BD] hover:text-[#FFF9F5] hover:bg-[#E01C20] transition-all cursor-pointer"
                aria-label="Instagram"
              >
                <FaInstagram className="h-4 w-4" />
              </Link>
              <Link
                href="https://www.tiktok.com/@multimediainaction?_t=ZS-8zwQ9E8K2i1&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1E2939] border border-white/10 flex items-center justify-center text-[#AAB1BD] hover:text-[#FFF9F5] hover:bg-[#E01C20] transition-all cursor-pointer"
                aria-label="TikTok"
              >
                <FaTiktok className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Column 2: Kompetisi */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-[#FFF9F5] uppercase tracking-wider">
              Kompetisi
            </h4>
            <ul className="space-y-2.5 text-sm text-[#AAB1BD]">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.category_id}>
                    <Link
                      href={`/category/${category.category_id}`}
                      className="hover:text-[#E01C20] transition-colors"
                    >
                      {category.category_name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link
                      href="/category"
                      className="hover:text-[#E01C20] transition-colors"
                    >
                      UI/UX Design
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/category"
                      className="hover:text-[#E01C20] transition-colors"
                    >
                      Website Development
                    </Link>
                  </li>
                </>
              )}
              <li className="pt-1">
                <Link
                  href="/category"
                  className="text-[#E01C20] hover:underline font-semibold flex items-center gap-1"
                >
                  Lihat Semua →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Informasi */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-[#FFF9F5] uppercase tracking-wider">
              Informasi
            </h4>
            <ul className="space-y-2.5 text-sm text-[#AAB1BD]">
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
                  FAQ
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
                  href="https://drive.google.com/drive/folders/1x34lDmoqSFdOfsxUpxpe2KiAaGT2zk5m?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E01C20] transition-colors"
                >
                  Panduan Lomba
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Kontak */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-[#FFF9F5] uppercase tracking-wider">
              Kontak
            </h4>
            <ul className="space-y-3 text-sm text-[#AAB1BD]">
              <li className="flex items-center gap-2">
                <EnvelopeClosedIcon className="h-4 w-4 text-[#E01C20]" />
                <a
                  href="mailto:mia.upnvj@gmail.com"
                  className="hover:text-[#E01C20] transition-colors"
                >
                  mia.upnvj@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MobileIcon className="h-4 w-4 text-[#E01C20]" />
                <a
                  href="https://wa.me/6289601101197"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E01C20] transition-colors"
                >
                  +62 896-0110-1197
                </a>
              </li>
              <li className="pt-1">
                <a
                  href="https://wa.me/6289601101197"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mia-btn-secondary px-4 py-2 text-xs inline-flex items-center gap-1.5"
                >
                  Hubungi Panitia
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-6" />

        {/* Bottom Copyright */}
        <div className="text-center text-xs text-[#99A1AF]">
          © {currentYear} Multimedia in Action (MIA). All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
