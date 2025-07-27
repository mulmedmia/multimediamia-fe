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
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Skor & Feedback</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="score">Skor</Label>
            <Input
              id="score"
              type="number"
              placeholder="Masukkan skor"
              value={score}
              onChange={(e) => setScore(e.target.value)}
            />
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
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Batal
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Menyimpan..." : "Update Skor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
