"use client";

import React, { useMemo, useState } from "react";
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
    <div className="border rounded-lg">
      <div className="p-4">
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <div className="flex gap-2">
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

export default function AdminGamifikasiPage() {
  const { data: users, isLoading, isError } = useGamifikasiUsers();
  const patchMutation = usePatchUserPoints();
  const [editUser, setEditUser] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const { register, handleSubmit, reset } = useForm();

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
        pageSize: 10,
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
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Manajemen Poin Gamifikasi</h1>
          <p className="text-muted-foreground">Kelola poin pengguna di sini.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cari pengguna..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton />
        ) : (
          <>
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

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Menampilkan{" "}
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}{" "}
                -{" "}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}{" "}
                dari {table.getFilteredRowModel().rows.length} data
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="text-sm">
                  Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
                  {table.getPageCount()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}

        <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Poin Pengguna</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Nama</Label>
                <div className="p-2 bg-muted rounded text-sm">
                  {editUser?.name}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="p-2 bg-muted rounded text-sm">
                  {editUser?.email}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="points">Poin</Label>
                <Input
                  id="points"
                  type="number"
                  {...register("points", { required: true })}
                  defaultValue={editUser?.points || 0}
                />
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
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
