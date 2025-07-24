"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LightningBoltIcon } from "@radix-ui/react-icons";
import { ChevronLeftIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export const AuthHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div>
              <img
                src="/MIALOGO.png"
                alt="Logo"
                className="h-6 w-6 object-contain"
              />
            </div>
            {/* Brand name is hidden on extra-small screens to save space */}
            <span className="hidden sm:inline text-xl font-bold bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-700 bg-clip-text text-transparent">
              Multimedia in Action
            </span>
          </Link>

          <div className="flex items-center space-x-2">
            <Link href="/" passHref>
              <Button variant="outline" size="icon" className="sm:hidden">
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="sr-only">Kembali ke Beranda</span>
              </Button>
              <Button variant="outline" className="hidden sm:flex">
                <ChevronLeftIcon className="mr-2 h-4 w-4" />
                Kembali ke Beranda
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
