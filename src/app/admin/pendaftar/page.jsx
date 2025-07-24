"use client";

import React, { useMemo, useState } from "react";
import { useAdminRegistrations } from "@/hooks/admin-use-pendaftar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useIsMobile } from "@/hooks/use-mobile";
import { getPendaftarColumns } from "./pendaftar-table-config";
import PendaftarDetailModal from "./PendaftarDetailModal";
import PendaftarVerifyModal from "./PendaftarVerifyModal";
import { Search } from "lucide-react";

export default function AdminPendaftarPage() {
  const { data: registrations, isLoading, isError } = useAdminRegistrations();
  const [detailData, setDetailData] = useState(null);
  const [verifyData, setVerifyData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const isMobile = useIsMobile();
  
  const columns = useMemo(
    () => getPendaftarColumns({ setDetailData, setVerifyData }),
    [setDetailData, setVerifyData]
  );

  // Filter data berdasarkan search term
  const filteredData = useMemo(() => {
    if (!registrations || !searchTerm) return registrations || [];
    
    return registrations.filter((registration) =>
      registration.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.category?.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [registrations, searchTerm]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center text-red-600 dark:text-red-400">
          <p>Gagal memuat data pendaftar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
          Pendaftar
        </h1>
        <p className="text-muted-foreground">
          Kelola pendaftar kompetisi di sini.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-xl sm:text-2xl font-bold">
              Daftar Pendaftar
            </CardTitle>
            <div className="flex-1 max-w-sm relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari pendaftar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm ? "Tidak ada pendaftar yang sesuai dengan pencarian." : "Tidak ada data pendaftar."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          className="px-4 py-3 text-left font-semibold text-foreground dark:text-white bg-gray-50 dark:bg-gray-800"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-4 py-3 text-foreground dark:text-white">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Detail */}
      <PendaftarDetailModal
        open={!!detailData}
        onClose={() => setDetailData(null)}
        data={detailData}
      />

      {/* Modal Verifikasi */}
      <PendaftarVerifyModal
        open={!!verifyData}
        onClose={() => setVerifyData(null)}
        data={verifyData}
      />
    </div>
  );
}