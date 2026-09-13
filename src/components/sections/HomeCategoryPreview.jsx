"use client";

import React from "react";
import { useUserCategories } from "@/hooks/user-use-category";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Calendar, Users, User, Trophy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function PreviewCard({ category }) {
  const isDeadlineSoon = () => {
    if (!category.deadline) return false;
    const deadline = new Date(category.deadline);
    const now = new Date();
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  return (
    <div className="mia-card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#E01C20]/40 flex flex-col h-full shadow-xl">
      {/* 16:9 Aspect Ratio Image Section */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#1E2939]">
        <Image
          src={category.image || "/placeholder-image.png"}
          alt={category.category_name}
          fill={true}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-3 left-3 z-10">
          <span className="mia-pill-badge bg-[#0A0D14]/90 text-[#FFF9F5] backdrop-blur-md">
            <Trophy className="h-3 w-3 text-[#E01C20]" />
            {category.category_name}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4 flex flex-col flex-1">
        <div>
          <h3 className="text-xl font-bold text-[#FFF9F5] group-hover:text-[#E01C20] transition-colors mb-2 line-clamp-1">
            {category.title || category.category_name}
          </h3>
          <p className="text-sm text-[#AAB1BD] line-clamp-2 leading-relaxed">
            {category.description ||
              "Kompetisi multimedia terbaik untuk mengasah skill digital dan kreasi visualmu."}
          </p>
        </div>

        {/* 3 Metadata Rows with Circular Icon Badges */}
        <div className="space-y-2.5 pt-2">
          {/* Organizer Row */}
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#1E2939]/60 border border-white/5">
            <div className="w-7 h-7 rounded-full bg-[#E01C20]/15 border border-[#E01C20]/30 flex items-center justify-center flex-shrink-0">
              <User className="h-3.5 w-3.5 text-[#E01C20]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[#99A1AF]">Penyelenggara</p>
              <p className="text-xs font-semibold text-[#FFF9F5] truncate">
                {category.organizer || "MIA KSM UPNVJ"}
              </p>
            </div>
          </div>

          {/* Deadline Row */}
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#1E2939]/60 border border-white/5">
            <div className="w-7 h-7 rounded-full bg-[#FF4500]/15 border border-[#FF4500]/30 flex items-center justify-center flex-shrink-0">
              <Calendar className="h-3.5 w-3.5 text-[#FF4500]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[#99A1AF]">Batas Pendaftaran</p>
              <p
                className={`text-xs font-semibold truncate ${isDeadlineSoon() ? "text-[#E01C20]" : "text-[#FFF9F5]"}`}
              >
                {category.deadline
                  ? new Date(category.deadline).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "20 November 2025"}
              </p>
            </div>
          </div>

          {/* Team Type Row */}
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#1E2939]/60 border border-white/5">
            <div className="w-7 h-7 rounded-full bg-[#FED700]/15 border border-[#FED700]/30 flex items-center justify-center flex-shrink-0">
              <Users className="h-3.5 w-3.5 text-[#FED700]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[#99A1AF]">Kategori Tim</p>
              <p className="text-xs font-semibold text-[#FFF9F5]">
                {category.team_type === "GROUP"
                  ? "Tim (2-3 Orang)"
                  : "Individu / Tim"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 mt-auto">
          <span className="mia-btn-primary w-full py-2.5 px-4 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md">
            Detail Kompetisi
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default function HomeCategoryPreview() {
  const { data, isLoading } = useUserCategories({
    limit: 4,
    page: 1,
    status: "",
  });

  // Fallback category items if API returns empty
  const fallbackCategories = [
    {
      category_id: "web-dev",
      category_name: "Website Development",
      title: "Web Development Competition",
      description:
        "Tantangan membangun aplikasi web modern, responsif, dan performan menggunakan teknologi terkini.",
      organizer: "MIA UPNVJ",
      deadline: "2025-11-16",
      team_type: "GROUP",
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    },
    {
      category_id: "ui-ux",
      category_name: "UI/UX Design",
      title: "UI/UX Design Competition",
      description:
        "Rancang pengalaman pengguna (UX) dan antarmuka (UI) yang solutif, intuitif, dan estetis untuk masalah nyata.",
      organizer: "MIA UPNVJ",
      deadline: "2025-11-16",
      team_type: "GROUP",
      image:
        "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80",
    },
  ];

  const categories =
    data?.categories && data.categories.length > 0
      ? data.categories
      : fallbackCategories;

  return (
    <section id="lomba" className="py-20 bg-transparent relative">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-14 space-y-4">
          <div className="inline-block">
            <span className="mia-pill-badge">
              <Trophy className="h-3.5 w-3.5 text-[#E01C20]" />
              <span>Kompetisi Multimedia</span>
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-[30.56px] font-bold text-[#FFF9F5] tracking-tight">
            Kategori Lomba <span className="text-[#E01C20]">Populer</span>
          </h2>
          <p className="text-base md:text-[18.89px] text-[#AAB1BD] max-w-2xl mx-auto leading-relaxed">
            Temukan tantangan yang paling sesuai untukmu dan raih prestasi
            terbaikmu
          </p>
        </div>

        {/* 2-Column Desktop Cards Grid */}
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="mia-card p-6 space-y-4">
                  <Skeleton className="h-48 w-full rounded-xl bg-[#1E2939]" />
                  <Skeleton className="h-6 w-3/4 bg-[#1E2939]" />
                  <Skeleton className="h-4 w-full bg-[#1E2939]" />
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full bg-[#1E2939]" />
                    <Skeleton className="h-10 w-full bg-[#1E2939]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {categories.map((category) => (
                <Link
                  key={category.category_id}
                  href={`/category/${category.category_id}`}
                  className="block group"
                >
                  <PreviewCard category={category} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Action */}
        <div className="text-center">
          <Link href="/category" className="inline-block">
            <span className="mia-btn-secondary px-8 py-3 text-base inline-flex items-center gap-2 cursor-pointer">
              Lihat Semua Kategori
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
