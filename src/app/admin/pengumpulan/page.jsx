"use client";

import React, { useMemo, useState } from "react";
import { useAdminSubmissions, usePatchSubmissionStatus, useDeleteSubmission, usePatchSubmissionScore } from "@/hooks/admin-use-submission";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useIsMobile } from "@/hooks/use-mobile";
import { getPengumpulanColumns } from "./pengumpulan-table-config";
import SubmissionDetailModal from "./SubmissionDetailModal";
import SubmissionStatusModal from "./SubmissionStatusModal";
import SubmissionScoreModal from "./SubmissionScoreModal";

export default function AdminPengumpulanPage() {
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [detailData, setDetailData] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [scoreData, setScoreData] = useState(null);

  // State untuk status & verifikasi
  const [status, setStatus] = useState("");
  const [is_verified, setIsVerified] = useState(false);

  // State untuk skor & feedback
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");

  const isMobile = useIsMobile();
  const columns = useMemo(
    () => getPengumpulanColumns({
      isMobile,
      setDetailData,
      setStatusData,
      setScoreData
    }),
    [isMobile]
  );

  const { data: submissions = [], isLoading, isError } = useAdminSubmissions({ search });
  const patchStatus = usePatchSubmissionStatus();
  const patchScore = usePatchSubmissionScore();
  const deleteMutation = useDeleteSubmission();

  const table = useReactTable({
    data: submissions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Reset modal state on open
  React.useEffect(() => {
    if (statusData) {
      setStatus(statusData.status ?? "");
      setIsVerified(statusData.is_verified ?? false);
    }
    if (scoreData) {
      setScore(scoreData.score ?? "");
      setFeedback(scoreData.feedback ?? "");
    }
  }, [statusData, scoreData]);

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

      {/* Modal Detail */}
      <SubmissionDetailModal
        open={!!detailData}
        onClose={() => setDetailData(null)}
        data={detailData}
      />

      {/* Modal Status */}
      <SubmissionStatusModal
        open={!!statusData}
        onClose={() => setStatusData(null)}
        data={statusData}
        status={status}
        setStatus={setStatus}
        is_verified={is_verified}
        setIsVerified={setIsVerified}
        isLoading={patchStatus.isPending}
        onSubmit={() =>
          patchStatus.mutate(
            { id: statusData.submission_id, status, is_verified },
            { onSuccess: () => setStatusData(null) }
          )
        }
      />

      {/* Modal Score */}
      <SubmissionScoreModal
        open={!!scoreData}
        onClose={() => setScoreData(null)}
        data={scoreData}
        score={score}
        setScore={setScore}
        feedback={feedback}
        setFeedback={setFeedback}
        isLoading={patchScore.isPending}
        onSubmit={() =>
          patchScore.mutate(
            { id: scoreData.submission_id, score: Number(score), feedback },
            { onSuccess: () => setScoreData(null) }
          )
        }
      />
    </div>
  );
}