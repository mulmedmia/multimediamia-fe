"use client";

import React, { useMemo, useState } from "react";
import { useGamifikasiUsers, usePatchUserPoints } from "@/hooks/admin-use-gamifikasi";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

// Modal sederhana
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
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

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Nama" },
      { accessorKey: "email", header: "Email" },
      {
        accessorKey: "points",
        header: "Points",
        cell: ({ row }) => row.original.points ?? 0,
      },
      { accessorKey: "role", header: "Role" },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => (
          <Button
            size="sm"
            onClick={() => {
            setEditUser(row.original);
            reset({ points: "" }); // <-- selalu kosong
            }}
          >
            Edit
          </Button>
        ),
      },
    ],
    [reset]
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

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Gagal memuat data.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manajemen Poin Gamifikasi</h1>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-2 text-left font-semibold">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-2">
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
        <h2 className="text-lg font-semibold mb-4">Edit Points</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Nama</label>
            <div className="p-2 bg-gray-100 rounded">{editUser?.name}</div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <div className="p-2 bg-gray-100 rounded">{editUser?.email}</div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Points</label>
            <Input
              type="number"
              {...register("points", { required: true })}
              className="w-full"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditUser(null)}
              disabled={patchMutation.isPending}
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