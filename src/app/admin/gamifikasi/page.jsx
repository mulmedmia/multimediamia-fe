"use client";

import React, { useMemo, useState } from "react";
import { useGamifikasiUsers, usePatchUserPoints } from "@/hooks/admin-use-gamifikasi";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useIsMobile } from "@/hooks/use-mobile";
import { getGamifikasiColumns } from "./gamifikasi-table-config";

// Modal sederhana
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 min-w-[320px] relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white"
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default function AdminGamifikasiPage() {
  const { data: users, isLoading, isError } = useGamifikasiUsers();
  const patchMutation = usePatchUserPoints();
  const [editUser, setEditUser] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  // Responsif: gunakan hook & config
  const isMobile = useIsMobile();
  const isTablet = !isMobile && typeof window !== "undefined" && window.innerWidth < 1024;
  const columns = useMemo(
    () => getGamifikasiColumns({ isMobile, isTablet, setEditUser, reset }),
    [isMobile, isTablet, setEditUser, reset]
  );

  const table = useReactTable({
    data: users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const onSubmit = (data) => {
    patchMutation.mutate(
      { id: editUser.users_id, points: Number(data.points) },
      {
        onSuccess: () => setEditUser(null),
      }
    );
  };

  if (isLoading) return <div className="text-foreground dark:text-white">Loading...</div>;
  if (isError) return <div className="text-red-600 dark:text-red-400">Gagal memuat data.</div>;

  return (
    <div className="bg-background dark:bg-black min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4 text-foreground dark:text-white">Manajemen Poin Gamifikasi</h1>
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

      {/* Modal Edit Points */}
      <Modal open={!!editUser} onClose={() => setEditUser(null)}>
        <h2 className="text-lg font-semibold mb-4 text-foreground dark:text-white">Edit Points</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-foreground dark:text-white">Nama</label>
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-foreground dark:text-white">{editUser?.name}</div>
          </div>
          <div>
            <label className="block mb-1 font-medium text-foreground dark:text-white">Email</label>
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-foreground dark:text-white">{editUser?.email}</div>
          </div>
          <div>
            <label className="block mb-1 font-medium text-foreground dark:text-white">Points</label>
            <Input
              type="number"
              {...register("points", { required: true })}
              className="w-full bg-white dark:bg-gray-900 text-black dark:text-white"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditUser(null)}
              disabled={patchMutation.isPending}
              className="bg-white dark:bg-gray-900 text-black dark:text-white border dark:border-gray-700"
            >
              Batal
            </Button>
            <Button type="submit" disabled={patchMutation.isPending}>
              {patchMutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}