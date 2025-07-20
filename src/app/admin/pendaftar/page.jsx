"use client";

import React, { useMemo, useState } from "react";
import { useAdminRegistrations, useVerifyRegistration } from "@/hooks/admin-use-pendaftar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useIsMobile } from "@/hooks/use-mobile";
import { getPendaftarColumns } from "./pendaftar-table-config";

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

export default function AdminPendaftarPage() {
  const { data: registrations, isLoading, isError } = useAdminRegistrations();
  const verifyMutation = useVerifyRegistration();
  const [editData, setEditData] = useState(null);

  const isMobile = useIsMobile();
  const columns = useMemo(
    () => getPendaftarColumns({ isMobile, setEditData }),
    [isMobile, setEditData]
  );

  const table = useReactTable({
    data: registrations || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleVerify = (is_verified) => {
    verifyMutation.mutate(
      { id: editData.registration_id, is_verified },
      { onSuccess: () => setEditData(null) }
    );
  };

  if (isLoading) return <div className="text-foreground dark:text-white">Memuat data...</div>;
  if (isError) return <div className="text-red-600 dark:text-red-400">Gagal memuat data.</div>;

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-black dark:text-white mb-4">Pendaftar</h1>
      <p className="text-muted-foreground mb-6">Kelola pendaftar kompetisi di sini.</p>
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

      {/* Modal Verifikasi */}
      <Modal open={!!editData} onClose={() => setEditData(null)}>
        <h2 className="text-lg font-semibold mb-4 text-foreground dark:text-white">Verifikasi Pendaftar</h2>
        <div className="space-y-2 mb-4">
          <div><strong>Nama:</strong> {editData?.user?.name}</div>
          <div><strong>Email:</strong> {editData?.user?.email}</div>
          <div><strong>Kategori:</strong> {editData?.category?.category_name}</div>
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
          <div><strong>Status:</strong> {editData?.is_verified ? "Terverifikasi" : "Belum Terverifikasi"}</div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setEditData(null)}
            disabled={verifyMutation.isPending}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant={editData?.is_verified ? "destructive" : "default"}
            onClick={() => handleVerify(!editData?.is_verified)}
            disabled={verifyMutation.isPending}
          >
            {verifyMutation.isPending
              ? "Memproses..."
              : editData?.is_verified
                ? "Batalkan Verifikasi"
                : "Verifikasi"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}