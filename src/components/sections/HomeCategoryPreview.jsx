"use client";

import React from "react";
import { useUserCategories } from "@/hooks/user-use-category";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Calendar, Users, User, Trophy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getSafeImageUrl } from "@/lib/image-loader";

const CATEGORY_CUSTOM_DATA = {
  UIA: {
    title: "UIA (UI/UX In Action)",
    description:
      "UI/UX In Action (UIA) adalah kompetisi desain UI/UX tingkat nasional bagi pelajar SMA/SMK dan mahasiswa. Melalui pendekatan Problem Based Design, UIA menantang peserta untuk memecahkan studi kasus dan menciptakan produk digital yang relevan dengan kebutuhan industri.",
    organizer: "KSM Multimedia UPN Veteran Jakarta",
    batch1: "24 September – 5 Oktober 2026",
    batch2: "6 – 16 Oktober 2026",
    teamType: "1 hingga 3 Orang",
  },
  WIA: {
    title: "🌐 WIA (Web In Action)",
    description:
      'Web In Action (WIA) adalah kompetisi web development tingkat nasional bagi pelajar SMA/SMK dan mahasiswa. Membawa semangat "From Visionaries to Architects of Change", WIA menantang peserta untuk merancang aplikasi web yang fungsional, solutif, dan berbasis studi kasus.',
    organizer: "KSM Multimedia UPN Veteran Jakarta",
    batch1: "24 September – 5 Oktober 2026",
    batch2: "6 – 16 Oktober 2026",
    teamType: "1 hingga 3 Orang",
  },
};

const formatBatchDateRange = (startDateStr, endDateStr, fallbackStr) => {
  if (!startDateStr && !endDateStr) return fallbackStr;
  try {
    const start = startDateStr ? new Date(startDateStr) : null;
    const end = endDateStr ? new Date(endDateStr) : null;

    if (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
      const sameMonth = start.getMonth() === end.getMonth();
      const sameYear = start.getFullYear() === end.getFullYear();

      const startDay = start.getDate();
      const endDay = end.getDate();

      const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];

      if (sameMonth && sameYear) {
        return `${startDay} – ${endDay} ${months[start.getMonth()]} ${start.getFullYear()}`;
      } else if (sameYear) {
        return `${startDay} ${months[start.getMonth()]} – ${endDay} ${months[end.getMonth()]} ${start.getFullYear()}`;
      } else {
        return `${startDay} ${months[start.getMonth()]} ${start.getFullYear()} – ${endDay} ${months[end.getMonth()]} ${end.getFullYear()}`;
      }
    } else if (start && !isNaN(start.getTime())) {
      return `Mulai ${start.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`;
    } else if (end && !isNaN(end.getTime())) {
      return `Hingga ${end.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`;
    }
  } catch (err) {
    console.error("Error formatting batch date range:", err);
  }
  return fallbackStr;
};

function PreviewCard({ category }) {
  const slugUpper = (category.slug || "").toUpperCase();
  const custom = CATEGORY_CUSTOM_DATA[slugUpper] || {};

  const title = custom.title || category.name || category.category_name;
  const description = category.description || custom.description || "Kompetisi multimedia terbaik untuk mengasah skill digital dan kreasi visualmu.";
  const organizer = category.organizer || custom.organizer || "KSM Multimedia UPN Veteran Jakarta";
  const batch1 = formatBatchDateRange(
    category.batch_1_start,
    category.batch_1_end,
    custom.batch1 || "24 September – 5 Oktober 2026"
  );
  const batch2 = formatBatchDateRange(
    category.batch_2_start,
    category.batch_2_end,
    custom.batch2 || "6 – 16 Oktober 2026"
  );
  const teamType = custom.teamType || (category.team_type === "GROUP" ? "1 hingga 3 Orang" : "Individu");

  return (
    <div className="mia-card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#E01C20]/40 flex flex-col h-full shadow-xl">
      {/* 16:9 Aspect Ratio Image Section */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#1E2939]">
        <Image
          src={getSafeImageUrl(category.image) || "/placeholder-image.png"}
          alt={title}
          fill={true}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-3 left-3 z-10">
          <span className="mia-pill-badge bg-[#0A0D14]/90 text-[#FFF9F5] backdrop-blur-md font-mono">
            <Trophy className="h-3 w-3 text-[#E01C20]" />
            {category.slug || category.category_name}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4 flex flex-col flex-1">
        <div>
          <h3 className="text-xl font-bold text-[#FFF9F5] group-hover:text-[#E01C20] transition-colors mb-2">
            {title}
          </h3>
          <p className="text-sm text-[#AAB1BD] leading-relaxed">
            {description}
          </p>
        </div>

        {/* Metadata Rows with Circular Icon Badges */}
        <div className="space-y-2.5 pt-2">
          {/* Organizer Row */}
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#1E2939]/60 border border-white/5">
            <div className="w-7 h-7 rounded-full bg-[#E01C20]/15 border border-[#E01C20]/30 flex items-center justify-center flex-shrink-0">
              <User className="h-3.5 w-3.5 text-[#E01C20]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[#99A1AF]">Penyelenggara</p>
              <p className="text-xs font-semibold text-[#FFF9F5] truncate">
                {organizer}
              </p>
            </div>
          </div>

          {/* Batch 1 & Batch 2 Rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#1E2939]/60 border border-white/5">
              <div className="w-6 h-6 rounded-full bg-[#FF4500]/15 border border-[#FF4500]/30 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-3 w-3 text-[#FF4500]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-[#99A1AF]">Batch 1</p>
                <p className="text-xs font-semibold text-[#FFF9F5] truncate">
                  {batch1}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#1E2939]/60 border border-white/5">
              <div className="w-6 h-6 rounded-full bg-[#FED700]/15 border border-[#FED700]/30 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-3 w-3 text-[#FED700]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-[#99A1AF]">Batch 2</p>
                <p className="text-xs font-semibold text-[#FFF9F5] truncate">
                  {batch2}
                </p>
              </div>
            </div>
          </div>

          {/* Team Type Row */}
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#1E2939]/60 border border-white/5">
            <div className="w-7 h-7 rounded-full bg-[#00B445]/15 border border-[#00B445]/30 flex items-center justify-center flex-shrink-0">
              <Users className="h-3.5 w-3.5 text-[#00B445]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[#99A1AF]">Kategori Tim</p>
              <p className="text-xs font-semibold text-[#FFF9F5]">
                {teamType}
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

const DEFAULT_PREVIEW_CATEGORIES = [
  {
    category_id: "cb73add96f85940bc06c278fa",
    slug: "UIA",
    name: "UIA (UI/UX In Action)",
    team_type: "GROUP",
  },
  {
    category_id: "c31d4835c411d093fa5430128",
    slug: "WIA",
    name: "Web In Action (WIA)",
    team_type: "GROUP",
  },
];

export default function HomeCategoryPreview() {
  const { data } = useUserCategories({
    limit: 4,
    page: 1,
    status: "",
    placeholderData: { categories: DEFAULT_PREVIEW_CATEGORIES },
  });

  const rawCategories = data?.categories || DEFAULT_PREVIEW_CATEGORIES;
  const sortedCategories = [...rawCategories].sort((a, b) => {
    if ((a.slug || "").toUpperCase() === "UIA") return -1;
    if ((b.slug || "").toUpperCase() === "UIA") return 1;
    return 0;
  });

  const categories =
    sortedCategories.length > 0 ? sortedCategories : DEFAULT_PREVIEW_CATEGORIES;

  return (
    <section id="lomba" className="py-20 bg-transparent relative scroll-mt-16 sm:scroll-mt-20">
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
            Pilih medan tantangan yang paling sesuai dengan keahlian tim kamu dan raih prestasi 
            terbaik di tingkat nasional!
          </p>
        </div>

        {/* 2-Column Desktop Cards Grid */}
        <div className="max-w-5xl mx-auto">
          {categories.length === 0 ? (
            <div className="mia-card p-10 sm:p-14 text-center space-y-4 max-w-lg mx-auto mb-12">
              <div className="w-16 h-16 bg-[#E01C20]/15 border border-[#E01C20]/30 text-[#E01C20] rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(224,28,32,0.2)]">
                <Trophy className="h-8 w-8 text-[#E01C20]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-bold text-[#FFF9F5]">
                  Belum Ada Kategori Lomba
                </h3>
                <p className="text-sm text-[#AAB1BD] leading-relaxed">
                  Informasi kategori kompetisi akan segera hadir. Pantau terus linimasa dan pengumuman terbaru kami!
                </p>
              </div>
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
