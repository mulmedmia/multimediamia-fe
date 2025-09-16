"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  PersonIcon,
  StarIcon,
  DownloadIcon,
  RocketIcon,
} from "@radix-ui/react-icons";

const HeroSection = () => {
  return (
    <section
      id="beranda"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br  dark:from-red-900 dark:via-black dark:to-black relative overflow-hidden"
    >
      <div className="container mx-auto px-4 mt-20 mb-10 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-gradient-to-r from-red-600 to-red-700 dark:to-black text-white border-0 dark:border-red-800 px-4 py-2 text-sm font-medium shadow-lg">
            <StarIcon className="h-4 w-4 mr-2" />
            Kompetisi Digital Indonesia 2025
          </Badge>

          <h1 className="text-4xl md:text-7xl font-bold text-foreground dark:text-white mb-6 leading-tight">
            <span>
              <span className="inline">Multimedia </span>
              <span className="inline bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                in Action
              </span>
            </span>
            <span className="block text-3xl md:text-4xl mt-2 text-muted-foreground dark:text-gray-400">
              Kompetisi Digital Creative
            </span>
          </h1>

          <p className="text-xl text-muted-foreground dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Tunjukkan kreativitas dan inovasi Anda dalam 3 kategori lomba:
            <span className="font-semibold text-red-600 dark:text-red-400">
              {" "}
              Website Development, UI/UX Design, Dan Logo Design
            </span>
            .
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a
              href="https://drive.google.com/drive/folders/1WPSiwwLve8ZeWT19yVF44YGXRzRppShp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-red-600 text-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/40 dark:hover:text-white px-8 py-3 text-lg cursor-pointer"
              >
                <DownloadIcon className="h-5 w-5 mr-2" />
                Download Panduan
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
