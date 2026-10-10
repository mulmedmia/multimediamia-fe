"use client";

import React from "react";
import {
  Clock,
  CheckCircle2,
  Clock3,
  XCircle,
  Zap,
  Gem,
  FileText,
  ExternalLink,
  UploadCloud,
} from "lucide-react";
import { cn, formatDeadline, isExpired } from "@/lib/utils";

export function MissionCard({ mission, onOpenDetail, onOpenSubmit }) {
  const sub = mission.my_submission;
  const expired = isExpired(mission.deadline);

  return (
    <div
      onClick={() => onOpenDetail && onOpenDetail(mission)}
      className="mia-card p-5 sm:p-6 hover:border-[#E01C20]/60 hover:shadow-[0_0_25px_rgba(224,28,32,0.18)] transition-all duration-300 relative flex flex-col justify-between group space-y-4 cursor-pointer"
    >
      <div className="space-y-3">
        {/* Header Row: Deadline & Status Badge */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-[#AAB1BD]">
            <Clock
              className={cn(
                "h-3.5 w-3.5 text-[#FED700]",
                expired && "text-red-500",
              )}
            />
            <span className={cn(expired && "text-red-400")}>
              Deadline: {formatDeadline(mission.deadline, "short")}
            </span>
          </div>

          {/* Category and Status Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {mission.category?.name ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                {mission.category.name}
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                🌐 Semua Kategori
              </span>
            )}

            {sub?.status === "APPROVED" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-3 w-3" />
                <span>Disetujui</span>
              </span>
            )}
            {sub?.status === "PENDING" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Clock3 className="h-3 w-3" />
                <span>Review</span>
              </span>
            )}
            {sub?.status === "REJECTED" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E01C20]/15 text-[#E01C20] border border-[#E01C20]/30">
                <XCircle className="h-3 w-3" />
                <span>Ditolak</span>
              </span>
            )}
            {!sub && expired && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-[#AAB1BD]">
                Kadaluarsa
              </span>
            )}
            {!sub && !expired && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30">
                Tersedia
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-[#FFF9F5] group-hover:text-[#E01C20] transition-colors line-clamp-2">
          {mission.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#AAB1BD] line-clamp-2 leading-relaxed">
          {mission.description ||
            "Tidak ada deskripsi tersedia untuk misi ini."}
        </p>
      </div>

      <div className="space-y-4 mt-auto">
        {/* Reward Range Pill */}
        <div
          className={cn(
            "grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#141824] border border-white/10",
            "lg:flex lg:justify-around",
          )}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Zap className="h-3.5 w-3.5 fill-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-[#AAB1BD]">
                Hadiah XP
              </p>
              <p className="text-xs sm:text-sm font-bold text-[#FED700] truncate">
                {mission.min_xp === mission.max_xp
                  ? `${mission.min_xp}`
                  : `${mission.min_xp} - ${mission.max_xp}`}{" "}
                XP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <Gem className="h-3.5 w-3.5 fill-cyan-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-[#AAB1BD]">
                Diamond
              </p>
              <p className="text-xs sm:text-sm font-bold text-[#00D2FF] truncate">
                {mission.min_diamond === mission.max_diamond
                  ? `${mission.min_diamond}`
                  : `${mission.min_diamond} - ${mission.max_diamond}`}
              </p>
            </div>
          </div>
        </div>

        {/* Admin Review Result Box (If Approved / Rejected) */}
        {sub?.status === "APPROVED" && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
            <div className="flex items-center justify-between font-semibold text-emerald-400">
              <span>Hadiah Diperoleh:</span>
              <span>
                +{sub.awarded_xp} XP & +{sub.awarded_diamond} 💎
              </span>
            </div>
            {sub.admin_feedback && (
              <p className="text-[#AAB1BD] italic text-[11px]">
                &quot;{sub.admin_feedback}&quot;
              </p>
            )}
          </div>
        )}

        {sub?.status === "REJECTED" && (
          <div className="p-3 rounded-xl bg-[#E01C20]/10 border border-[#E01C20]/20 text-xs space-y-1">
            <p className="font-semibold text-red-400">Pengumpulan ditolak</p>
            {sub.admin_feedback && (
              <p className="text-[#AAB1BD] text-[11px]">
                Alasan: {sub.admin_feedback}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t border-border/40">
          {/* Google Docs Instructions Button */}
          {mission.google_docs_url && (
            <a
              href={mission.google_docs_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="w-full rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#FFF9F5] flex items-center justify-center gap-1.5 h-9 cursor-pointer transition-all"
              >
                <FileText className="h-3.5 w-3.5 text-[#FED700]" />
                <span>Buka Panduan Google Docs</span>
                <ExternalLink className="h-3 w-3 text-[#AAB1BD]" />
              </button>
            </a>
          )}

          {/* Submit / Status Button */}
          {sub?.status === "APPROVED" ? (
            <button
              disabled
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-full bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold h-10 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Misi Selesai</span>
            </button>
          ) : sub?.status === "PENDING" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenSubmit) onOpenSubmit(mission);
              }}
              className={cn(
                "w-full mia-btn-primary text-xs font-semibold h-10 inline-flex items-center justify-center gap-1.5 cursor-pointer",
                "bg-amber-500/20! [&_svg]:text-amber-300! text-amber-300! border! border-amber-500/30! hover:bg-amber-500/30! hover:!shadow-[0_0_20px_oklch(76.9%_0.188_70.08_/_0.4)]",
              )}
            >
              <UploadCloud className="h-4 w-4" />
              <span>Edit Pengumpulan</span>
            </button>
          ) : sub?.status === "REJECTED" && !expired ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenSubmit) onOpenSubmit(mission);
              }}
              className="w-full mia-btn-primary text-xs font-semibold h-10 inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="h-4 w-4 text-white" />
              <span>Kirim Ulang Tugas</span>
            </button>
          ) : expired ? (
            <button
              disabled
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-full bg-white/5 text-[#AAB1BD]/50 border border-white/10 text-xs font-semibold h-10 flex items-center justify-center gap-1.5"
            >
              <span>Misi Telah Berakhir</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenSubmit) onOpenSubmit(mission);
              }}
              className="w-full mia-btn-primary text-xs font-semibold h-10 inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="h-4 w-4 text-white" />
              <span>Kirim Pengumpulan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
