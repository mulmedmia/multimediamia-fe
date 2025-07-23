"use client";

import React, { useMemo, useState } from "react";
import { useAdminSubmissions, usePatchSubmissionStatus, useDeleteSubmission, usePatchSubmissionScore } from "@/hooks/admin-use-submission";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useIsMobile } from "@/hooks/use-mobile";
import { getPengumpulanColumns } from "./pengumpulan-table-config";

// Modal sederhana
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 min-w-[320px] max-w-lg w-full">
        {children}
        <Button variant="outline" className="mt-4 w-full" onClick={onClose}>Tutup</Button>
      </div>
    </div>
  );
}

export default function AdminPengumpulanPage() {
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [editData, setEditData] = useState(null);

  const isMobile = useIsMobile();
  const columns = useMemo(
    () => getPengumpulanColumns({ isMobile, setEditData }),
    [isMobile, setEditData]
  );

  const { data: submissions = [], isLoading, isError } = useAdminSubmissions({ search });
  const patchStatus = usePatchSubmissionStatus();
  const deleteMutation = useDeleteSubmission();
  const patchScore = usePatchSubmissionScore();

  const table = useReactTable({
    data: submissions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Modal state
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("");
  const [is_verified, setIsVerified] = useState(false);

  // Reset modal state on open
  React.useEffect(() => {
    if (editData) {
      setScore(editData.score ?? "");
      setFeedback(editData.feedback ?? "");
      setStatus(editData.status ?? "");
      setIsVerified(editData.is_verified ?? false);
    }
  }, [editData]);

  if (isLoading) return <div className="text-foreground dark:text-white">Memuat data...</div>;
  if (isError) return <div className="text-red-600 dark:text-red-400">Gagal memuat data.</div>;

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-black dark:text-white mb-4">Pengumpulan Submission</h1>
      <p className="text-muted-foreground mb-6">Kelola submission peserta di sini.</p>
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <div className="flex-1 relative">
          <Input
            placeholder="Cari submission..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setSearch(input)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setSearch(input)} className="w-full sm:w-auto">
          Cari
        </Button>
      </div>
      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left font-semibold text-foreground dark:text-white bg-gray-50 dark:bg-gray-800"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b dark:border-gray-800">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-2 text-foreground dark:text-white">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Detail & Action */}
      <Modal open={!!editData} onClose={() => setEditData(null)}>
        <h2 className="text-lg font-semibold mb-4 text-foreground dark:text-white">Detail Submission</h2>
        {editData && (
          <div className="space-y-2 mb-4">
            <div><strong>Nama:</strong> {editData?.user?.name}</div>
            <div><strong>Email:</strong> {editData?.user?.email}</div>
            <div><strong>Kategori:</strong> {editData?.category?.category_name}</div>
            <div><strong>Judul:</strong> {editData?.title}</div>
            <div>
              <strong>File:</strong>{" "}
              <a
                href={editData?.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Lihat File
              </a>
            </div>
            <div><strong>Status:</strong> {editData?.status}</div>
            <div><strong>Skor:</strong> {editData?.score ?? "-"}</div>
            <div><strong>Feedback:</strong> {editData?.feedback ?? "-"}</div>
          </div>
        )}

        {/* Update Status */}
        <div className="space-y-2 mb-2">
          <label className="block font-medium">Update Status</label>
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
          <Button
            className="w-full mt-2"
            disabled={patchStatus.isPending}
            onClick={() =>
              patchStatus.mutate(
                { id: editData.submission_id, status, is_verified },
                { onSuccess: () => setEditData(null) }
              )
            }
          >
            {patchStatus.isPending ? "Menyimpan..." : "Update Status"}
          </Button>
        </div>

        {/* Update Score & Feedback */}
        <div className="space-y-2 mb-2">
          <label className="block font-medium">Update Skor & Feedback</label>
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
          <Button
            className="w-full mt-2"
            disabled={patchScore.isPending}
            onClick={() =>
              patchScore.mutate(
                { id: editData.submission_id, score: Number(score), feedback },
                { onSuccess: () => setEditData(null) }
              )
            }
          >
            {patchScore.isPending ? "Menyimpan..." : "Update Skor"}
          </Button>
        </div>

        {/* Delete */}
        <Button
          variant="destructive"
          className="w-full mt-2"
          disabled={deleteMutation.isPending}
          onClick={() => deleteMutation.mutate(editData.submission_id, { onSuccess: () => setEditData(null) })}
        >
          {deleteMutation.isPending ? "Menghapus..." : "Hapus Submission"}
        </Button>
      </Modal>
    </div>
  );
}