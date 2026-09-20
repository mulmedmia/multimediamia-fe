"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const scoreFeedbackSchema = z.object({
  score: z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined ? undefined : Number(val),
    z
      .number({
        required_error: "Skor wajib diisi",
        invalid_type_error: "Skor harus berupa angka",
      })
      .min(0, "Skor minimal 0")
      .max(100, "Skor maksimal 100")
  ),
  feedback: z
    .string()
    .max(400, "Feedback maksimal 400 karakter")
    .optional(),
});

export default function SubmissionScoreModal({
  open,
  onClose,
  data,
  score,
  setScore,
  feedback,
  setFeedback,
  onSubmit,
  isLoading,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(scoreFeedbackSchema),
    defaultValues: {
      score: score ?? "",
      feedback: feedback ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        score: score ?? "",
        feedback: feedback ?? "",
      });
    }
  }, [open, score, feedback, reset]);

  if (!data) return null;

  const onFormSubmit = (formData) => {
    setScore(formData.score);
    setFeedback(formData.feedback);
    onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0A0D14] border border-border/50 text-[#FFF9F5] max-w-md rounded-2xl p-6 shadow-2xl">
        <DialogHeader className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
            <Star className="h-6 w-6" />
          </div>
          <DialogTitle className="text-lg font-bold text-center text-foreground">
            Penilaian & Feedback Karya
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground text-center">
            Berikan nilai evaluasi berkisar 0 - 100 serta catatan saran untuk peserta.
          </DialogDescription>
        </DialogHeader>

        {/* Ringkasan Karya */}
        <div className="p-3.5 bg-[#0F121A] border border-border/40 rounded-xl space-y-1.5 text-xs">
          <div className="flex justify-between items-center py-0.5 border-b border-border/20">
            <span className="text-muted-foreground">Judul Karya:</span>
            <span className="font-semibold text-foreground truncate max-w-[200px]">
              {data.project_name || data.title || "-"}
            </span>
          </div>
          <div className="flex justify-between items-center py-0.5 border-b border-border/20">
            <span className="text-muted-foreground">Peserta / Tim:</span>
            <span className="font-medium text-foreground truncate max-w-[200px]">
              {data.team_name ? data.team_name : data.user?.name || "-"}
            </span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-muted-foreground">Kategori:</span>
            <span className="text-muted-foreground">
              {data.category?.category_name || "-"}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="score" className="text-xs text-muted-foreground font-medium">
              Skor Nilai (0 - 100) <span className="text-[#E01C20]">*</span>
            </Label>
            <Input
              id="score"
              type="number"
              min="0"
              max="100"
              placeholder="Contoh: 85"
              {...register("score")}
              className={cn(
                "h-10 bg-input/40 rounded-xl px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all",
                errors.score
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-border/50 focus-visible:border-ring focus-visible:ring-ring/50"
              )}
            />
            {errors.score && (
              <p className="text-xs text-destructive font-medium mt-1">
                {errors.score.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="feedback" className="text-xs text-muted-foreground font-medium">
              Catatan / Feedback Juri (Opsional)
            </Label>
            <Textarea
              id="feedback"
              placeholder="Tuliskan catatan apresiasi, saran pengembangan, atau masukan juri..."
              rows={3}
              {...register("feedback")}
              className={cn(
                "bg-input/40 border-border/50 rounded-xl p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus-visible:ring-offset-0 focus-visible:outline-none",
                errors.feedback
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-border/50 focus-visible:border-ring focus-visible:ring-ring/50"
              )}
            />
            {errors.feedback && (
              <p className="text-xs text-destructive font-medium mt-1">
                {errors.feedback.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl text-xs text-muted-foreground hover:text-white"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-[#FF5722] to-[#E01C20] hover:from-[#e04515] hover:to-[#c4181c] text-white rounded-xl text-xs font-semibold px-4 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              {isLoading ? "Menyimpan..." : "Simpan Skor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
