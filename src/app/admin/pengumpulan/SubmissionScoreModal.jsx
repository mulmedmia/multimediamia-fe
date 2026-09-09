import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
      .max(100, "Skor maksimal 100"),
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Skor & Feedback</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="score">Skor</Label>
            <Input
              id="score"
              type="number"
              min="0"
              max="100"
              placeholder="Masukkan skor (0-100)"
              {...register("score")}
              className={
                errors.score
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            />
            {errors.score && (
              <p className="text-xs text-destructive font-medium mt-1">
                {errors.score.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback (Opsional)</Label>
            <Textarea
              id="feedback"
              placeholder="Masukkan feedback (maksimal 400 karakter)"
              rows={4}
              {...register("feedback")}
              className={
                errors.feedback
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            />
            {errors.feedback && (
              <p className="text-xs text-destructive font-medium mt-1">
                {errors.feedback.message}
              </p>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Menyimpan..." : "Update Skor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
