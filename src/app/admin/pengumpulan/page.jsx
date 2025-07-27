"use client";

import React, { useMemo, useState } from "react";
import {
  useAdminSubmissions,
  usePatchSubmissionStatus,
  useDeleteSubmission,
  usePatchSubmissionScore,
} from "@/hooks/admin-use-submission";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useIsMobile } from "@/hooks/use-mobile";
import { getPengumpulanColumns } from "./pengumpulan-table-config";
import SubmissionDetailModal from "./SubmissionDetailModal";
import SubmissionStatusModal from "./SubmissionStatusModal";
import SubmissionScoreModal from "./SubmissionScoreModal";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function TableSkeleton() {
  return (
    <div className="border rounded-lg">
      <div className="p-4">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminPengumpulanPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detailData, setDetailData] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [scoreData, setScoreData] = useState(null);

  const [status, setStatus] = useState("");
  const [is_verified, setIsVerified] = useState(false);

  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");

  const isMobile = useIsMobile();
  const columns = useMemo(
    () =>
      getPengumpulanColumns({
        isMobile,
        setDetailData,
        setStatusData,
        setScoreData,
      }),
    [isMobile]
  );

  const {
    data: submissions = [],
    isLoading,
    isError,
  } = useAdminSubmissions({});
  const patchStatus = usePatchSubmissionStatus();
  const patchScore = usePatchSubmissionScore();
  const deleteMutation = useDeleteSubmission();

  const filteredData = useMemo(() => {
    let filtered = submissions;

    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    return filtered;
  }, [submissions, statusFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase();
      const searchableColumns = [
        row.original.user?.name,
        row.original.user?.email,
        row.original.category?.category_name,
        row.original.team_name,
        row.original.project_name,
        row.original.status,
        row.original.score?.toString(),
      ];

      return searchableColumns.some((value) =>
        value?.toString().toLowerCase().includes(searchValue)
      );
    },
    onGlobalFilterChange: setGlobalFilter,
  });

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

  if (isError)
    return <div className="text-destructive">Gagal memuat data.</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Pengumpulan Submission</h1>
          <p className="text-muted-foreground">
            Kelola submission peserta di sini.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cari submission..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="PENDING">PENDING</SelectItem>
              <SelectItem value="APPROVED">APPROVED</SelectItem>
              <SelectItem value="REJECTED">REJECTED</SelectItem>
              <SelectItem value="REVISION">REVISION</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className="border rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="border-b">
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 py-3 text-left font-medium text-sm"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-b hover:bg-muted/50">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 text-sm">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {table.getRowModel().rows.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada data yang ditemukan
              </div>
            )}
          </div>
        )}

        <SubmissionDetailModal
          open={!!detailData}
          onClose={() => setDetailData(null)}
          data={detailData}
        />

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
    </div>
  );
}
