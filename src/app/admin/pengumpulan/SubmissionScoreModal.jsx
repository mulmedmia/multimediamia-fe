import { Button } from "@/components/ui/button";

export default function SubmissionScoreModal({ open, onClose, data, score, setScore, feedback, setFeedback, onSubmit, isLoading }) {
  if (!open || !data) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 min-w-[320px] max-w-lg w-full">
        <h2 className="text-lg font-semibold mb-4 text-foreground dark:text-white">Update Skor & Feedback</h2>
        <div className="space-y-2 mb-4">
          <input
            type="number"
            className="w-full border rounded px-2 py-1"
            placeholder="Skor"
            value={score}
            onChange={e => setScore(e.target.value)}
          />
          <textarea
            className="w-full border rounded px-2 py-1"
            placeholder="Feedback"
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
          />
        </div>
        <Button
          className="w-full mt-2"
          disabled={isLoading}
          onClick={onSubmit}
        >
          {isLoading ? "Menyimpan..." : "Update Skor"}
        </Button>
        <Button variant="outline" className="mt-2 w-full" onClick={onClose}>Tutup</Button>
      </div>
    </div>
  );
}