import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  StarFilledIcon,
  BookmarkIcon,
  ArrowRightIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";

const GamificationSection = () => {
  const features = [
    {
      icon: <StarFilledIcon className="h-8 w-8 text-amber-500" />,
      title: "Kumpulkan XP & Diamond",
      description:
        "Dapatkan xp dan diamond dari setiap aktivitas, mulai dari pendaftaran hingga submit karya.",
    },
    {
      icon: <StarFilledIcon className="h-8 w-8 text-red-500" />,
      title: "Leaderboard Kompetitif",
      description:
        "Pantau posisi Anda secara real-time di leaderboard dan bersaing untuk menjadi yang terbaik.",
    },
    {
      icon: <BookmarkIcon className="h-8 w-8 text-green-500" />,
      title: "Tukar dengan Hadiah",
      description:
        "Tukarkan diamonds yang terkumpul dengan merchandise atau tiket konsultasi eksklusif.",
    },
  ];

  return (
    <section id="leaderboard" className="py-20 bg-background dark:bg-black/95">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-red-600 to-red-700 text-white border-0 shadow-lg">
            <StarFilledIcon className="h-4 w-4 mr-2" />
            Fitur Gamifikasi & Leaderboard
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground dark:text-white mb-4">
            Lebih dari Sekadar Kompetisi
          </h2>
          <p className="text-lg text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Kami menghadirkan pengalaman kompetisi yang lebih seru dengan sistem
            gamifikasi dan leaderboard yang kompetitif.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <Card
              key={i}
              className="text-center p-6 bg-card dark:bg-gray-900/50 border dark:border-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex gap-6">
                {feature.icon}
                <h3 className="text-2xl font-bold mb-2 text-foreground dark:text-white">
                  {feature.title}
                </h3>
              </div>
              <p className="text-muted-foreground text-left mb-12 dark:text-gray-400">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/leaderboard" className="inline-block">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-red-600 text-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/40 dark:hover:text-white cursor-pointer"
            >
              Lihat Leaderboard
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GamificationSection;
