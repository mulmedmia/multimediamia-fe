import { Button } from "@/components/ui/button";

export default function SubmissionStatusModal({ open, onClose, data, status, setStatus, is_verified, setIsVerified, onSubmit, isLoading }) {
  if (!open || !data) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 min-w-[320px] max-w-lg w-full">
        <h2 className="text-lg font-semibold mb-4 text-foreground dark:text-white">Update Status Submission</h2>
        <div className="space-y-2 mb-4">
          <label className="block font-medium">Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="">Pilih status</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="REVISION">REVISION</option>
          </select>
          <label className="inline-flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={is_verified}
              onChange={e => setIsVerified(e.target.checked)}
            />
            Verifikasi
          </label>
        </div>
        <Button
          className="w-full mt-2"
          disabled={isLoading}
          onClick={onSubmit}
        >
          {isLoading ? "Menyimpan..." : "Update Status"}
        </Button>
        <Button variant="outline" className="mt-2 w-full" onClick={onClose}>Tutup</Button>
      </div>
    </div>
  );
}