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

          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-black rounded-xl flex items-center justify-center shadow-lg">
              <LightningBoltIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-700 bg-clip-text text-transparent">
                Multimedia in Action
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-2">
            <Link href="/" passHref>
              <Button variant="outline">
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
