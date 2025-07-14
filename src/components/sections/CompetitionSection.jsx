import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  DesktopIcon,
  MixerHorizontalIcon,
  FileTextIcon,
  Pencil2Icon,
  StarIcon,
} from "@radix-ui/react-icons";
import CompetitionCard from "./CompetitionCard";

const CompetitionSection = () => {
  const competitions = [
    {
      icon: <DesktopIcon className="h-6 w-6" />,
      title: "Website Development",
      description:
        "Buat website responsif dan inovatif dengan teknologi terkini.",
      prize: "Rp 8.000.000",
      deadline: "20 Agustus 2025",
      participants: "Tim 1-3",
      difficulty: "Advanced",
      requirements: [
        "Mahasiswa/Pelajar aktif",
        "Tim maksimal 3 orang",
        "Framework modern",
      ],
      color: "bg-gradient-to-br from-red-600 to-black",
    },
    {
      icon: <MixerHorizontalIcon className="h-6 w-6" />,
      title: "UI/UX Design",
      description:
        "Ciptakan pengalaman pengguna yang luar biasa dengan desain intuitif.",
      prize: "Rp 6.000.000",
      deadline: "18 Agustus 2025",
      participants: "Tim 1-2",
      difficulty: "Intermediate",
      requirements: [
        "Portofolio desain",
        "Prototype interaktif",
        "Design system",
      ],
      color: "bg-gradient-to-br from-purple-600 to-black",
    },
    {
      icon: <FileTextIcon className="h-6 w-6" />,
      title: "Digital Poster",
      description:
        "Buat poster digital yang menarik dengan pesan yang kuat dan visual memukau.",
      prize: "Rp 5.000.000",
      deadline: "15 Agustus 2025",
      participants: "Individual",
      difficulty: "Beginner",
      requirements: [
        "Resolusi 300 DPI",
        "Tema: Teknologi Masa Depan",
        "Karya original",
      ],
      color: "bg-gradient-to-br from-pink-600 to-black",
    },
    {
      icon: <Pencil2Icon className="h-6 w-6" />,
      title: "Essay Writing",
      description:
        "Tulis esai inspiratif tentang dampak teknologi digital dalam kehidupan.",
      prize: "Rp 5.000.000",
      deadline: "25 Agustus 2025",
      participants: "Individual",
      difficulty: "Intermediate",
      requirements: [
        "1000-1500 kata",
        "Referensi akademik",
        "Plagiarisme maks 10%",
      ],
      color: "bg-gradient-to-br from-green-600 to-black",
    },
  ];

  return (
    <section id="lomba" className="py-20 bg-gray-50 dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="mb-6 border-red-200 text-red-600 dark:border-red-800 dark:text-red-400"
          >
            <StarIcon className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
            Kategori Lomba
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground dark:text-white mb-4">
            Pilih Kategori Lomba Anda
          </h2>
          <p className="text-lg text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Empat kategori lomba yang menantang kreativitas dan kemampuan teknis
            Anda.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {competitions.map((competition, i) => (
            <CompetitionCard key={i} {...competition} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompetitionSection;