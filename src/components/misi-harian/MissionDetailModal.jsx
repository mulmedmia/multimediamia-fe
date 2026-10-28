"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Zap,
  Gem,
  FileText,
  ExternalLink,
  UploadCloud,
  CheckCircle2,
  Clock3,
  XCircle,
  Link,
  MessageSquare,
  PenBox,
} from "lucide-react";
import { cn, formatDeadline, isExpired } from "@/lib/utils";
import { Separator } from "../ui/separator";

const getRemainingTimeStr = (dateString) => {
  if (!dateString) return "";
  try {
    const deadline = new Date(dateString);
    const now = new Date();
    const diffMs = deadline - now;
    if (diffMs <= 0) return "";
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} hari ${diffHours % 24} jam`;
    } else if (diffHours > 0) {
      return `${diffHours} jam`;
    } else {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} menit`;
    }
  } catch {
    return "";
  }
};

export function MissionDetailModal({
  isOpen,
  onOpenChange,
  mission,
  onOpenSubmit,
}) {
  if (!mission) return null;

  const targetDate = mission.deadline;
  const sub = mission.my_submission;
  const expired = isExpired(targetDate);

  const isApproved = sub?.status === "APPROVED";
  const isReviewed = sub?.status === "PENDING";
  const isRejected = sub?.status === "REJECTED";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-[#0A0D14] border border-white/10 text-[#FFF9F5] max-w-lg rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto selection:bg-primary pb-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Status Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {mission.category?.name ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                {mission.category.name}
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                🌐 Semua Kategori
              </span>
            )}

            {isApproved && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-3 w-3" />
                <span>Disetujui</span>
              </span>
            )}
            {isReviewed && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Clock3 className="h-3 w-3" />
                <span>Menunggu Review</span>
              </span>
            )}
            {isRejected && (
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

        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-xl font-bold text-[#FFF9F5]">
            {mission.title}
          </DialogTitle>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-xs text-[#AAB1BD] py-0.5">
              <Clock
                className={cn(
                  "h-3.5 w-3.5 text-[#FED700]",
                  expired && "text-red-500",
                )}
              />
              <div
                className={cn(
                  "flex flex-col sm:inline-block",
                  expired && "text-red-400",
                )}
              >
                <span>Deadline: </span>
                <span>{formatDeadline(mission.deadline, "long")}</span>
              </div>
            </div>

            {!expired && (
              <div className="flex flex-col sm:inline-block text-xs text-right">
                <span>Sisa Waktu: </span>
                <span>{getRemainingTimeStr(targetDate)}</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <Separator className="bg-border/40" />

        <div className="space-y-5 ">
          {/* Mission Full Description */}
          <div>
            <p className="text-sm text-[#AAB1BD] leading-relaxed whitespace-pre-line">
              {mission.description ||
                "Tidak ada deskripsi tersedia untuk misi ini."}
            </p>
          </div>

          {/* Docs Instruction Link (if available) */}
          <div className="space-y-1.5 pt-1">
            <p className="text-xs text-muted-foreground font-medium">
              Materi Pendukung
            </p>

            {mission.google_docs_url && (
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-5 w-5 text-[#FED700] flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#FFF9F5]">
                      Panduan & Instruksi Resmi
                    </p>
                    <p className="text-[11px] text-[#AAB1BD] truncate">
                      Google Docs instruksi penugasan
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full border border-white/15 bg-transparent hover:bg-white/2! text-[#FFF9F5] px-3.5! py-1.5! text-xs inline-flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                  asChild
                >
                  <a
                    href={mission.google_docs_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Buka</span>
                    <ExternalLink className="h-3! w-3! text-[#AAB1BD]" />
                  </a>
                </Button>
              </div>
            )}
          </div>

          {sub && (
            <>
              {/* Submission Status */}
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground font-medium">
                  Pengumpulan Anda
                </p>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <Link className="h-5 w-5 text-blue-400 flex-shrink-0 mt-1.5" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#FFF9F5]">
                          Link Pengumpulan
                        </p>
                        <p className="text-[11px] text-[#AAB1BD] truncate">
                          {sub.submission_url}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full border border-white/15 bg-transparent hover:bg-white/2! text-[#FFF9F5] px-3.5! py-1.5! text-xs inline-flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                      asChild
                    >
                      <a
                        href={sub.submission_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>Buka</span>
                        <ExternalLink className="h-3! w-3! text-[#AAB1BD]" />
                      </a>
                    </Button>
                  </div>

                  {sub.notes && (
                    <div className="flex items-start gap-3 min-w-0">
                      <PenBox className="h-5 w-5 text-blue-400 flex-shrink-0 mt-1.5" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#FFF9F5]">
                          Catatan
                        </p>
                        <p className="text-[11px] text-[#AAB1BD] truncate whitespace-pre-line">
                          {sub.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Feedback */}
              {sub.admin_feedback && (
                <div
                  className={cn(
                    "p-3.5 border rounded-2xl space-y-1.5 backdrop-blur-xs",
                    isRejected && "bg-primary/15 border-primary/25",
                    isApproved && "bg-emerald-600/5 border-emerald-500/15",
                  )}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <MessageSquare
                      className={cn(
                        "h-5 w-5 text-primary flex-shrink-0 mt-1",
                        isApproved && "text-emerald-500",
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-xs font-semibold text-red-300",
                          isApproved && "text-emerald-500",
                        )}
                      >
                        {isRejected
                          ? "Pengumpulan ditolak"
                          : "Feedback Panitia:"}
                      </p>
                      <p className="text-[11px] text-[#AAB1BD] truncate break-words whitespace-pre-line italic pt-1">
                        {sub.admin_feedback}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter
          className={cn(
            "flex-col gap-4 py-4 -mx-6 mt-4 px-6 border-t border-white/10 bg-blue-600/4",
            isApproved && "bg-emerald-600/20 border-emerald-500/30",
          )}
        >
          {/* Approved information */}
          <div className="flex items-center gap-6 grow">
            {isApproved && (
              <div className="flex items-center grow text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4 mr-1.5 shrink-0" />
                <span>Hadiah diperoleh</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Zap className="h-4 w-4 fill-amber-400" />
              </div>
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-[11px] uppercase tracking-wider text-[#AAB1BD] font-medium",
                    isApproved && "text-emerald-300",
                  )}
                >
                  {isApproved ? "XP" : "Hadiah XP"}
                </p>
                <p className="text-sm font-bold text-[#FED700] truncate">
                  {isApproved && "+ "}
                  {mission.min_xp === mission.max_xp
                    ? `${mission.min_xp}`
                    : `${mission.min_xp} - ${mission.max_xp}`}{" "}
                  XP
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                <Gem className="h-4 w-4 fill-cyan-400" />
              </div>
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-[11px] uppercase tracking-wider text-[#AAB1BD] font-medium",
                    isApproved && "text-emerald-300",
                  )}
                >
                  Diamond
                </p>
                <p className="text-sm font-bold text-[#00D2FF] truncate">
                  {isApproved && "+ "}
                  {mission.min_diamond === mission.max_diamond
                    ? `${mission.min_diamond}`
                    : `${mission.min_diamond} - ${mission.max_diamond}`}
                </p>
              </div>
            </div>
          </div>

          {/* Action button inside Detail Modal, approved already shown at the top */}
          {expired && !isApproved ? (
            <Button
              disabled
              className="rounded-full bg-white/5 text-[#AAB1BD]/50 border border-white/10 text-xs font-semibold h-10 px-5 cursor-not-allowed"
            >
              <span>Misi Telah Berakhir</span>
            </Button>
          ) : (
            (!isApproved || isReviewed) && (
              <Button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  if (onOpenSubmit) onOpenSubmit(mission, true);
                }}
                className={cn(
                  "mia-btn-primary text-xs font-semibold h-10 px-5 cursor-pointer inline-flex items-center gap-1.5",
                  isReviewed &&
                    "bg-amber-500/20! [&_svg]:text-amber-300! text-amber-300! border! border-amber-500/30! hover:bg-amber-500/30! hover:!shadow-[0_0_20px_oklch(76.9%_0.188_70.08_/_0.4)]",
                )}
              >
                <UploadCloud className="h-4 w-4 text-white" />
                <span>
                  {!sub
                    ? "Kirim Pengumpulan"
                    : isReviewed
                      ? "Edit Pengumpulan"
                      : "Kirim Ulang Tugas"}
                </span>
              </Button>
            )
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
