"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUserCategories } from "@/hooks/user-use-category";
import {
  InstagramLogoIcon,
  TwitterLogoIcon,
  LinkedInLogoIcon,
  GitHubLogoIcon,
} from "@radix-ui/react-icons";

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
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10"
              >
                <InstagramLogoIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10"
              >
                <TwitterLogoIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10"
              >
                <LinkedInLogoIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10"
              >
                <GitHubLogoIcon className="h-4 w-4" />
              </Button>
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
                      Website Developer
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/category"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Mobile App Developer
                    </Link>
                  </li>
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
                      Game Development
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
                  href="/timeline"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Timeline
                </Link>
              </li>
              <li>
                <Link
                  href="/hadiah"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Hadiah
                </Link>
              </li>
              <li>
                <Link
                  href="/juri"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Juri
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/panduan"
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
              <li className="text-muted-foreground">Email: info@miaksm.com</li>
              <li className="text-muted-foreground">
                WhatsApp: +62 812-3456-7890
              </li>
              <li>
                <Link
                  href="/kontak"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/dukungan"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Dukungan Teknis
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
