"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, Zap, Gem, ExternalLink } from "lucide-react";
import { useSubmitMission } from "@/hooks/user-use-missions";
import { toast } from "sonner";

export function MissionSubmitModal({
  isOpen,
  onOpenChange,
  mission,
  onOpenDetail,
  backToDetail,
}) {
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const submitMutation = useSubmitMission();
  const showPreviousButton = onOpenDetail && backToDetail;

  useEffect(() => {
    if (isOpen && mission) {
      setSubmissionUrl(mission?.my_submission?.submission_url || "");
      setSubmissionNotes(mission?.my_submission?.notes || "");
    }
  }, [isOpen, mission]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!submissionUrl.trim()) {
      toast.error("Link pengumpulan wajib diisi!");
      return;
    }

    try {
      new URL(submissionUrl);
    } catch {
      toast.error(
        "Format URL pengumpulan tidak valid (harus diawali http:// atau https://)",
      );
      return;
    }

    submitMutation.mutate(
      {
        id: mission.mission_id,
        submission_url: submissionUrl.trim(),
        notes: submissionNotes.trim() || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setSubmissionUrl("");
          setSubmissionNotes("");
        },
      },
    );
  };

  if (!mission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0A0D14] border border-white/10 text-[#FFF9F5] max-w-lg rounded-2xl p-6 shadow-2xl  selection:bg-primary">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl font-bold flex items-center gap-4 text-foreground">
            <div className="w-10 h-10 rounded-2xl bg-[#E01C20]/15 border border-[#E01C20]/30 flex items-center justify-center text-[#E01C20] shadow-[0_0_15px_rgba(224,28,32,0.15)]">
              <UploadCloud className="h-5 w-5 text-[#E01C20]" />
            </div>
            <span>Kirim Pengumpulan Misi</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-[#AAB1BD]">
            Misi:{" "}
            <span className="text-[#FFF9F5] font-semibold">
              {mission.title}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Reward reminder */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
            <span className="text-[#AAB1BD]">
              {mission.min_xp === mission.max_xp &&
              mission.min_diamond === mission.max_diamond
                ? "Reward Misi (Pasti):"
                : "Perkiraan Reward:"}
            </span>
            <div className="flex items-center gap-3 font-semibold">
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <Zap className="h-3 w-3 fill-amber-400" />
                {mission.min_xp === mission.max_xp
                  ? `${mission.min_xp} XP`
                  : `${mission.min_xp} - ${mission.max_xp} XP`}
              </span>
              <span className="text-cyan-400 font-semibold flex items-center gap-1">
                <Gem className="h-3 w-3 fill-cyan-400" />
                {mission.min_diamond === mission.max_diamond
                  ? `${mission.min_diamond}`
                  : `${mission.min_diamond} - ${mission.max_diamond}`}
              </span>
            </div>
          </div>

          {!mission.category_id && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 leading-relaxed">
              🌐 <b>Misi Bersama (Semua Kategori):</b> Anda cukup mengumpulkan
              misi ini 1 kali. Reward XP dan Diamond akan otomatis diberikan ke
              seluruh tim lomba aktif yang Anda ikuti!
            </div>
          )}

          {/* Instruction Link reminder */}
          {mission.google_docs_url && (
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
              <span className="text-[#AAB1BD]">
                Belum membaca instruksi lengkap?
              </span>
              <a
                href={mission.google_docs_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FED700] hover:underline font-semibold flex items-center gap-1"
              >
                <span>Buka Docs</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          {/* URL Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="linkPengumpulan"
              className="text-xs font-medium text-[#FFF9F5] flex items-center justify-between"
            >
              <span>
                Link Karya / Pengumpulan (URL){" "}
                <span className="text-red-500">*</span>
              </span>
              <span className="text-[10px] text-[#AAB1BD]">
                Google Drive / YouTube / Medsos
              </span>
            </label>
            <Input
              id="linkPengumpulan"
              type="url"
              required
              placeholder="https://drive.google.com/file/d/... atau https://..."
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              className="bg-[#141824] border-white/10 text-[#FFF9F5] placeholder:text-[#AAB1BD]/50 rounded-xl h-10 text-sm focus-visible:ring-[#E01C20]"
            />
            <p className="text-[11px] text-[#AAB1BD]">
              ⚠️ Pastikan link atau file yang Anda lampirkan sudah diset ke mode{" "}
              <b>Public (Anyone with link can view)</b>.
            </p>
          </div>

          {/* Notes Textarea */}
          <div className="space-y-1.5">
            <label
              htmlFor="catatan"
              className="text-xs font-medium text-[#FFF9F5]"
            >
              Catatan Tambahan (Opsional)
            </label>
            <Textarea
              id="catatan"
              rows={3}
              placeholder="Tuliskan catatan tambahan untuk admin (misal: bagian yang dikerjakan, username sosmed, dll)..."
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              className="bg-input dark:bg-input/30 border-white/10 text-[#FFF9F5] placeholder:text-[#AAB1BD]/50 rounded-xl text-sm focus-visible:ring-[#E01C20] resize-none mt-0.5"
            />
          </div>

          <DialogFooter className="gap-2 pt-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                onOpenChange(false);
                showPreviousButton
                  ? onOpenDetail(mission)
                  : onOpenChange(false);
              }}
              className="rounded-full border border-white/15 bg-transparent hover:bg-white/5 text-[#FFF9F5] text-xs font-semibold h-10 px-4 cursor-pointer"
            >
              {showPreviousButton ? "Kembali" : "Batal"}
            </Button>
            <Button
              type="submit"
              disabled={submitMutation.isPending}
              className="mia-btn-primary text-xs font-semibold h-10 px-5 cursor-pointer inline-flex items-center gap-1.5"
            >
              {submitMutation.isPending ? (
                "Mengirim..."
              ) : (
                <>
                  <UploadCloud className="h-4 w-4 text-white" />
                  <span>Kirim Pengumpulan</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
