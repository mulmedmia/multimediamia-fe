"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUserCategories } from "@/hooks/user-use-category";
import { InstagramLogoIcon, VideoIcon } from "@radix-ui/react-icons";
import { FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Fetch categories untuk menampilkan kompetisi yang tersedia
  const { data } = useUserCategories({
    limit: 10, // Ambil semua kategori
    page: 1,
    status: "VERIFIED",
  });
  const categories = data?.categories || [];

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">MIA KSM</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Kompetisi multimedia terbesar untuk mahasiswa Indonesia. Wujudkan
              kreativitas dan inovasi digital Anda bersama kami.
            </p>
            <div className="flex space-x-3">
              <Link
                href="https://www.instagram.com/multimedia.in.action?igsh=bGtvMWZpNDExbDVj"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/10"
                >
                  <FaInstagram className="h-4 w-4" />
                </Button>
              </Link>
              <Link
                href="https://www.tiktok.com/@multimediainaction?_t=ZS-8zwQ9E8K2i1&_r=1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/10"
                >
                  <FaTiktok className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Kompetisi Links - Dynamic dari API */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Kompetisi</h4>
            <ul className="space-y-2 text-sm">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.category_id}>
                    <Link
                      href={`/category/${category.category_id}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {category.category_name}
                    </Link>
                  </li>
                ))
              ) : (
                // Fallback jika API belum load atau tidak ada data
                <>
                  <li>
                    <Link
                      href="/category"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      UI/UX Design
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/category"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Website Developer
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link
                  href="/category"
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Lihat Semua →
                </Link>
              </li>
            </ul>
          </div>

          {/* Informasi Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Informasi</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/#timeline"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Timeline
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="https://drive.google.com/drive/folders/1x34lDmoqSFdOfsxUpxpe2KiAaGT2zk5m?usp=sharing"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Panduan
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak & Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Kontak</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">
                Email: mia.upnvj@gmail.com
              </li>
              <li className="text-muted-foreground">
                WhatsApp: +62 896-0110-1197
              </li>
              <li>
                <Link
                  href="https://wa.me/6289601101197"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-6"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {currentYear} Multimedia In Action. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
