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
  const [currentStat, setCurrentStat] = useState(0);
  const stats = [
    {
      icon: CalendarIcon,
      value: "25 Agustus",
      label: "Deadline Pendaftaran",
      color: "text-red-500",
      darkColor: "dark:text-red-400",
    },
    {
      icon: PersonIcon,
      value: "50+",
      label: "Peserta Terdaftar",
      color: "text-blue-500",
      darkColor: "dark:text-blue-400",
    },
    {
      icon: StarIcon,
      value: "3 Juta+",
      label: "Total Hadiah",
      color: "text-green-500",
      darkColor: "dark:text-green-400",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

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

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className={cn(
                  "transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer bg-card dark:bg-black/30 dark:border-gray-800",
                  currentStat === index
                    ? "ring-2 ring-red-500 ring-opacity-50 animate-pulse bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-black/50"
                    : "hover:bg-gray-50 dark:hover:bg-gray-900/50"
                )}
              >
                <CardContent className="p-6 text-center relative overflow-hidden">
                  {currentStat === index && (
                    <div className="absolute inset-0 bg-gradient-to-r from-red-100 via-transparent to-red-100 dark:from-red-900/30 dark:to-black/30 animate-pulse opacity-30 dark:opacity-50"></div>
                  )}
                  <div
                    className={cn(
                      "relative z-10 transition-all duration-300",
                      currentStat === index ? "transform scale-110" : ""
                    )}
                  >
                    <stat.icon
                      className={cn(
                        "h-8 w-8 mb-3 mx-auto transition-all duration-300",
                        stat.color,
                        stat.darkColor,
                        currentStat === index ? "animate-bounce" : ""
                      )}
                    />
                    <div className="text-2xl font-bold text-foreground dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;