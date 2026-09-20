"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import Image from "next/image";

export const AuthHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent py-2">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="relative h-8 w-8 aspect-square">
              <Image
                src="/mia2026_logo.png"
                alt="Multimedia in Action Logo"
                fill={true}
                className="object-contain"
              />
            </div>
            <span className="hidden sm:inline text-lg font-bold text-[#FFF9F5]">
              Multimedia{" "}
              <span className="bg-gradient-to-r from-[#E01C20] via-[#FF4500] to-[#FED700] bg-clip-text text-transparent">
                In Action
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/" passHref>
              <span className="px-4 py-2 rounded-full bg-[#1E2939] border border-white/10 text-[#FFF9F5] text-sm font-medium hover:bg-[#151C28] transition-all flex items-center gap-2 cursor-pointer shadow-md">
                <ChevronLeftIcon className="h-4 w-4 text-[#E01C20]" />
                <span>Kembali ke Beranda</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
