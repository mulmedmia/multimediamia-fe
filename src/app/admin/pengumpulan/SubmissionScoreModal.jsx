import { useState, useEffect } from "react";
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

const scoreSchema = z.object({
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
  feedback: z.string().optional(),
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
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [open, score]);

  if (!data) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = scoreSchema.safeParse({ score, feedback });
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes("score"));
      if (issue) {
        setError(issue.message);
        return;
      }
    }
    setError("");
    onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Skor & Feedback</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="score">Skor</Label>
            <Input
              id="score"
              type="number"
              min="0"
              max="100"
              placeholder="Masukkan skor (0-100)"
              value={score}
              onChange={(e) => {
                setError("");
                setScore(e.target.value);
              }}
              className={
                error ? "border-destructive focus-visible:ring-destructive" : ""
              }
            />
            {error && (
              <p className="text-xs text-destructive font-medium">{error}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Masukkan feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
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
