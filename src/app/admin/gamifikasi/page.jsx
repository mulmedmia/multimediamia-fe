"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  useGamifikasiUsers,
  usePatchUserPoints,
} from "@/hooks/admin-use-gamifikasi";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useIsMobile } from "@/hooks/use-mobile";
import { getGamifikasiColumns } from "./gamifikasi-table-config";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

function TableSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-2 sm:p-4">
        <div className="space-y-3 sm:space-y-4">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center gap-2 sm:gap-4"
            >
              <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
                <Skeleton className="h-3 sm:h-4 w-24 sm:w-32" />
                <Skeleton className="h-2 sm:h-3 w-36 sm:w-48" />
              </div>
              <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                <Skeleton className="h-6 sm:h-8 w-12 sm:w-16" />
                <Skeleton className="h-6 sm:h-8 w-12 sm:w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminGamifikasiPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const {
    data: response,
    isLoading,
    isError,
  } = useGamifikasiUsers({ page, limit });
  const patchMutation = usePatchUserPoints();
  const [editUser, setEditUser] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const { register, handleSubmit, reset } = useForm();

  const users = response?.users || [];
  const meta = response?.meta;

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [globalFilter]);

  const isMobile = useIsMobile();
  const columns = useMemo(
    () => getGamifikasiColumns({ isMobile, setEditUser, reset }),
    [isMobile, setEditUser, reset]
  );

  const table = useReactTable({
    data: users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase();
      const searchableColumns = [
        row.original.name,
        row.original.email,
        row.original.role,
        row.original.points?.toString(),
      ];

      return searchableColumns.some((value) =>
        value?.toString().toLowerCase().includes(searchValue)
      );
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: limit,
      },
    },
  });

  const onSubmit = (data) => {
    patchMutation.mutate(
      { id: editUser.users_id, points: Number(data.points) },
      {
        onSuccess: () => setEditUser(null),
      }
    );
  };

  if (isError)
    return <div className="text-destructive">Gagal memuat data.</div>;

  return (
    <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-semibold">
            Manajemen Poin Gamifikasi
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Kelola poin pengguna di sini.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cari pengguna..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton />
        ) : (
          <>
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id} className="border-b bg-muted/50">
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-xs sm:text-sm"
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
                          <td
                            key={cell.id}
                            className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm"
                          >
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

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                Menampilkan {(page - 1) * limit + 1} -{" "}
                {Math.min(page * limit, meta?.total || 0)} dari{" "}
                {meta?.total || 0} data
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <div className="text-xs sm:text-sm text-center">
                  Halaman {page} dari {meta?.totalPages || 1}
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="h-8 px-2 sm:px-3"
                  >
                    <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline ml-1">Previous</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((p) => Math.min(meta?.totalPages || 1, p + 1))
                    }
                    disabled={page === (meta?.totalPages || 1)}
                    className="h-8 px-2 sm:px-3"
                  >
                    <span className="hidden sm:inline mr-1">Next</span>
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
          <DialogContent className="w-[95vw] max-w-md mx-4">
            <DialogHeader>
              <DialogTitle className="text-lg">Edit Poin Pengguna</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Nama</Label>
                <div className="p-3 bg-muted rounded text-sm break-words">
                  {editUser?.name}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Email</Label>
                <div className="p-3 bg-muted rounded text-sm break-words">
                  {editUser?.email}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="points" className="text-sm">
                  Poin
                </Label>
                <Input
                  id="points"
                  type="number"
                  {...register("points", { required: true })}
                  defaultValue={editUser?.points || 0}
                  className="w-full"
                />
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditUser(null)}
                  disabled={patchMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={patchMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {patchMutation.isPending ? "Menyimpan..." : "Simpan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
