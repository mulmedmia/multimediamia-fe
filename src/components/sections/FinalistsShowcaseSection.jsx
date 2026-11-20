"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import { Trophy, Users, ArrowRight, ImageIcon } from "lucide-react";
import { useAllSubmissions } from "@/hooks/user-use-submissions";
import { getSafeImageUrl } from "@/lib/image-loader";
import { cn } from "@/lib/utils";

function getCategoryMeta(category) {
  const slug = (category?.slug || "").toUpperCase();
  const name = (category?.name || category?.category_name || "").toUpperCase();

  if (slug === "UIA" || slug === "UI/UX DESIGN" || name.includes("UI/UX")) {
    return {
      key: "UIA",
      order: 1,
      shortLabel: "UIA",
      fullName: category?.name || category?.category_name || "UI/UX In Action",
      direction: "left",
      badgeClass: "bg-purple-500/20 text-purple-200 border border-purple-400/40",
      dotClass: "bg-purple-400",
      accentTextClass: "text-purple-300",
    };
  }

  if (
    slug === "WIA" ||
    slug === "WEB DEVELOPMENT" ||
    name.includes("WEB IN ACTION") ||
    name.includes("WEB")
  ) {
    return {
      key: "WIA",
      order: 2,
      shortLabel: "WIA",
      fullName: category?.name || category?.category_name || "Web In Action",
      direction: "right",
      badgeClass: "bg-sky-500/20 text-sky-200 border border-sky-400/40",
      dotClass: "bg-sky-400",
      accentTextClass: "text-sky-300",
    };
  }

  const fallback = category?.slug || category?.name || "MIA";
  return {
    key: category?.category_id || fallback,
    order: 3,
    shortLabel: fallback,
    fullName: category?.name || category?.category_name || fallback,
    direction: "left",
    badgeClass: "bg-emerald-500/20 text-emerald-200 border border-emerald-400/40",
    dotClass: "bg-emerald-400",
    accentTextClass: "text-emerald-300",
  };
}

function FinalistMarqueeRow({ group }) {
  return (
    <div className="space-y-3">
      {/* Row Label */}
      <div className="flex items-center gap-2.5 px-1">
        <span className={cn("w-2.5 h-2.5 rounded-full", group.dotClass)} />
        <h3 className="text-sm sm:text-base font-bold text-[#FFF9F5] tracking-tight">
          Top 10 Finalis{" "}
          <span className={group.accentTextClass}>{group.fullName}</span>
        </h3>
      </div>

      {/* Marquee Track */}
      <div className="overflow-hidden py-1.5">
        <Marquee
          direction={group.direction}
          gradient={true}
          gradientColor="#0A0D14"
          gradientWidth={70}
          speed={36}
          pauseOnHover={true}
          autoFill={true}
          className="items-stretch"
        >
          {group.items.map((submission) => {
            const rawThumb = submission.thumbnail_url || submission.thumbnail;
            const thumbUrl = rawThumb ? getSafeImageUrl(rawThumb) : null;
            const teamName =
              submission.registration?.team_name ||
              submission.team_name ||
              submission.registration?.user?.name ||
              submission.user?.name ||
              "-";

            return (
              <Link
                key={submission.submission_id}
                href={`/show-it/${submission.submission_id}`}
                className="mia-card mx-3.5 w-72 sm:w-80 flex flex-col overflow-hidden border border-[#FED700]/25 hover:border-[#FED700]/70 hover:shadow-[0_0_28px_rgba(254,215,0,0.16)] bg-[#0F121A]/85 backdrop-blur-sm rounded-2xl transition-all duration-300 group cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#141824] border-b border-white/10 flex items-center justify-center">
                  <div className="absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0A0D14]/85 backdrop-blur-sm border border-[#FED700]/50 text-[#FED700] text-[10px] font-semibold shadow-md">
                    <Trophy className="h-3 w-3" />
                    <span>Finalis</span>
                  </div>

                  <div
                    className={cn(
                      "absolute top-2.5 right-2.5 z-10 px-2.5 py-1 rounded-full backdrop-blur-sm text-[10px] font-bold shadow-md",
                      group.badgeClass,
                    )}
                  >
                    {group.shortLabel}
                  </div>

                  {thumbUrl ? (
                    <img
                      src={thumbUrl}
                      alt={submission.project_name || "Thumbnail Karya Finalis"}
                      draggable={false}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#AAB1BD] p-4 bg-gradient-to-br from-[#1E2939]/40 to-[#0F131E]/60">
                      <ImageIcon className="w-9 h-9 text-[#FED700]/50 mb-1.5" />
                      <span className="text-xs text-[#99A1AF] font-medium text-center line-clamp-1">
                        {submission.project_name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Info */}
                <div className="p-4 flex flex-col justify-between gap-2.5 flex-1">
                  <h4 className="text-sm sm:text-base font-bold text-[#FFF9F5] group-hover:text-[#FED700] transition-colors line-clamp-1">
                    {submission.project_name}
                  </h4>

                  <div className="flex items-center justify-between gap-2 text-xs text-[#AAB1BD]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Users className="h-3.5 w-3.5 text-[#FED700] flex-shrink-0" />
                      <span className="truncate font-medium">{teamName}</span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[#FED700] font-semibold flex-shrink-0 group-hover:translate-x-0.5 transition-transform">
                      <span>Show It</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </Marquee>
      </div>
    </div>
  );
}

const FinalistsShowcaseSection = () => {
  const { data, isLoading, isError } = useAllSubmissions(
    "all",
    "",
    null,
    1,
    50,
    "FINAL",
    "true",
  );

  const finalistGroups = useMemo(() => {
    const raw = data?.submissions || [];
    const eligible = raw.filter(
      (sub) =>
        sub.status === "APPROVED" &&
        Boolean(sub.is_verified) &&
        Boolean(sub.is_finalist),
    );

    const grouped = new Map();
    for (const sub of eligible) {
      const meta = getCategoryMeta(sub.category);
      if (!grouped.has(meta.key)) {
        grouped.set(meta.key, { ...meta, items: [] });
      }
      grouped.get(meta.key).items.push(sub);
    }

    return Array.from(grouped.values()).sort((a, b) => a.order - b.order);
  }, [data?.submissions]);

  if (isLoading || isError || finalistGroups.length === 0) {
    return null;
  }

  return (
    <section id="finalis" className="py-10 sm:py-14 relative">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 space-y-4">
          <div className="inline-block">
            <span className="mia-pill-badge shadow-md">
              <Trophy className="h-3.5 w-3.5 text-[#FED700]" />
              <span>Top 10 Finalis MIA 2026</span>
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-[36px] font-bold text-[#FFF9F5] tracking-tight">
            Finalis <span className="text-[#FED700]">Lomba</span>
          </h2>

          <p className="text-sm sm:text-base md:text-[18px] text-[#AAB1BD] max-w-3xl mx-auto leading-relaxed">
            Deretan karya terbaik dari kategori{" "}
            <span className="font-semibold text-purple-300">UI/UX In Action</span>{" "}
            dan{" "}
            <span className="font-semibold text-sky-300">Web In Action</span>{" "}
            yang berhasil melaju ke tahap Top 10 Finalis.
          </p>
        </div>

        {/* Dual Opposite-Direction Marquee Rows (Atas: UIA ke kiri, Bawah: WIA ke kanan) */}
        <div className="space-y-8">
          {finalistGroups.map((group) => (
            <FinalistMarqueeRow key={group.key} group={group} />
          ))}
        </div>

        {/* CTA to Show It */}
        <div className="text-center mt-10">
          <Link
            href="/show-it"
            className="mia-btn-secondary px-6 py-2.5 text-sm inline-flex items-center gap-2 cursor-pointer hover:border-[#FED700]/50 transition-all"
          >
            <span>Lihat Semua Finalis di Show It</span>
            <ArrowRight className="h-4 w-4 text-[#FED700]" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalistsShowcaseSection;
